import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import fs from 'fs'
import products from '../src/dummyProducts.js'
import users from '../src/dummyUsers.js'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet';
import { sanitizeAndValidateProduct, sanitizeAndValidateUser } from './validationBackend.js';

const app = express();
const initialProducts = [...products];
const initialUsers = [...users];
const userSessions = {};

//-------------------- CORS Configuration ---------------------
const allowedOrigins = [process.env.FRONTEND_APP_URL];

app.use(cors({
  origin: allowedOrigins, // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow credentials (cookies, tokens, etc.)
}));

// Preflight handling (OPTIONS requests)
app.options('*', cors());


//-------------------- Middleware ------------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', apiLimiter);



//----------------- Content Security Policy Header
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "script-src 'self'; " +
    "img-src 'self' data: https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg; " +
    "connect-src 'self'");
  next();
});
app.use(express.json());


//------------------ Paths for serving images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR_USERS = path.join(__dirname, '../src/images/users');
const IMAGES_DIR_PRODUCTS = path.join(__dirname, '../src/images/products');
app.use('/images/users', express.static(IMAGES_DIR_USERS));
app.use('/images/products', express.static(IMAGES_DIR_PRODUCTS));
app.use(express.static(path.join(__dirname, 'build')));

//-------------------Multer setup for file upload (images)
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isUserImage = req.body.imageType === 'user';
    const destinationDir = isUserImage ? IMAGES_DIR_USERS : IMAGES_DIR_PRODUCTS;
    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
}).single('image');

//-------------------- Authentication Middleware -------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  if (!userSessions[token]) {
    userSessions[token] = {
      products: [...initialProducts],
      users: [...initialUsers]
    };
  }
  req.sessionData = userSessions[token];
  next();
};


// Authentication endpoint for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username.length >= 10 && username.length <= 20 && password.length >= 10 && password.length <= 20) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Nazwa użytkownika: min. 10, max. 20 znaków. Hasło: min. 10 max. 20 znaków.' });
  }
});

//------------------- Product endpoints
app.get('/products', authenticateToken, (req, res) => {
  res.json(req.sessionData.products);
});

app.get('/products/:id', authenticateToken, (req, res) => {
  const product = req.sessionData.products.find(p => p.id == req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.put('/products/:id', authenticateToken, (req, res) => {
  const productId = req.params.id.toString();
  const index = req.sessionData.products.findIndex(p => p.id === productId);

  //--------------- Ensure the product exists
  if (index === -1) {
    return res.status(404).send('Product not found');
  }

  const existingProduct = req.sessionData.products[index];

  try {
    //--------Exisiting product and incoming (updated) DEBUGG
    // console.log('Existing product:', existingProduct);
    // console.log('Incoming product data:', req.body);

    const updatedProductData = { ...existingProduct, ...req.body };

    const { valid, errors } = sanitizeAndValidateProduct(updatedProductData, existingProduct);
    if (!valid) {
      return res.status(400).json({ errors });
    }

    const updatedProduct = { ...existingProduct, ...updatedProductData };

    //---------------------- Log the updated product DEBUGG
    // console.log('Updated product:', updatedProduct);

    req.sessionData.products[index] = updatedProduct;
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error while updating the product:', err.message);
    res.status(500).json({ message: err.message });
  }
});



app.post('/products', authenticateToken, (req, res) => {
  try {
    const { valid, errors } = sanitizeAndValidateProduct(req.body);
    // console.log('Validation result:', { valid, errors }); // Debugging
    if (!valid) {
      return res.status(400).json({ errors });
    }

    //------------ Check incoming product data DEBUGG
    // console.log('Incoming product data:', req.body);

    if (!req.sessionData.products) {
      req.sessionData.products = [...initialProducts];
    }
    const newProduct = { ...req.body, id: Date.now().toString(), status: req.body.status || 'active' };

    // Log the final processed product DEBUGG
    // console.log('Processed new product:', newProduct);

    if (!newProduct || !newProduct.id || !newProduct.status) {
      throw new Error('Product data is incomplete');
    }
    req.sessionData.products.push(newProduct);
    console.log('New product added to session:', newProduct);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating the product:', err.stack || err.message);
    res.status(500).json({ message: 'Internal server error while creating the product' });
  }
});



//---------------------- User endpoints
app.get('/users', authenticateToken, (req, res) => {
  res.json(req.sessionData.users);
});

app.get('/users/:id', authenticateToken, (req, res) => {
  const user = req.sessionData.users.find(u => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/users/:id', authenticateToken, (req, res) => {
  const index = req.sessionData.users.findIndex(u => u.id == req.params.id);
  if (index === -1) {
    return res.status(404).send('User not found');
  }

  const existingUser = req.sessionData.users[index];

  if (req.body.status === 'usunięty') {
    req.sessionData.users[index] = { ...existingUser, status: 'usunięty' };
    return res.json(req.sessionData.users[index]);
  }

  const { valid, errors } = sanitizeAndValidateUser(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  req.sessionData.users[index] = { ...existingUser, ...req.body };
  res.json(req.sessionData.users[index]);
});



app.post('/users', authenticateToken, (req, res) => {
  try {
    const { valid, errors } = sanitizeAndValidateUser(req.body);
    if (!valid) {
      return res.status(400).json({ errors });
    }

    const newUser = { ...req.body, id: Date.now().toString(), status: req.body.status || 'nieaktywny' };

    //------------new user DEBUGG
    // console.log('New user created:', newUser);

    if (!req.sessionData.users) {
      req.sessionData.users = [];
    }
    req.sessionData.users.push(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating the user:', err.message);
    res.status(500).json({ message: 'Internal server error while creating the user' });
  }
});



//---------------------- Reset endpoint
app.post('/reset', authenticateToken, (req, res) => {
  req.sessionData.products = [...initialProducts];  // Reset the user's product data
  req.sessionData.users = [...initialUsers];  // Reset the user's user data

  res.status(200).json({ message: 'Data has been reset to initial state' });
});

//---------------------- Image upload endpoint
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (req.file) {
      const isUserImage = req.body.imageType === 'user';
      const imagePath = isUserImage ? `/images/users/${req.file.filename}` : `/images/products/${req.file.filename}`;
      res.json({ filePath: imagePath });
    } else {
      res.status(400).send('Invalid file');
    }
  });
});

// Add this above or below your other routes in server.js
app.get('/images/list', authenticateToken, (req, res) => {
  const type = req.query.type;
  const imagesDir = type === 'users' ? IMAGES_DIR_USERS : IMAGES_DIR_PRODUCTS;

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Unable to list images' });
    }

    const images = files.filter(file => ALLOWED_FORMATS.includes(`image/${file.split('.').pop()}`));

    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found' });
    }

    res.json(images);
  });
});


//---------------- Currently not used endpoint (instead of delete- there is put to change state)
app.delete('/products/:id', authenticateToken, (req, res) => {
  const index = req.sessionData.products.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    req.sessionData.products.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Product not found');
  }
});

//---------------- Currently not used endpoint (instead of delete- there is put to change state)
app.delete('/users/:id', authenticateToken, (req, res) => {
  const index = req.sessionData.users.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    req.sessionData.users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('User not found');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'An error occurred' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Automate for QA API');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(helmet());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));