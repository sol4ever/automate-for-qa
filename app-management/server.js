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
import jwt from 'jsonwebtoken';
import { exec } from 'child_process';

const app = express();
const initialProducts = [...products];
const initialUsers = [...users];
const userSessions = {};

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

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
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
}).single('image');

//-------------------- Authentication Middleware -------------------

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour


//-------------------- Authentication endpoint for login

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Use test credentials in CI pipeline
  if (process.env.CI === 'true') {
    const testUsername = process.env.TEST_USERNAME;
    const testPassword = process.env.TEST_PASSWORD;

    console.log(testUsername, ' This is testUsername')
    console.log(testPassword, ' This is testPassword')

    if (username === testUsername && password === testPassword) {
      const token = jwt.sign(
        { username, createdAt: Date.now() },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Initialize session for CI tests
      userSessions[token] = {
        products: [...initialProducts],
        users: [...initialUsers],
        createdAt: Date.now(),
      };

      return res.json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid test credentials' });
    }
  }

  // Regular authentication logic for local and production
  if (username.length >= 10 && username.length <= 20 && password.length >= 10 && password.length <= 20) {
    const token = jwt.sign(
      { username, createdAt: Date.now() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    userSessions[token] = {
      products: [...initialProducts],
      users: [...initialUsers],
      createdAt: Date.now(),
    };

    return res.json({ token });
  } else {
    return res.status(400).json({
      error: 'Nazwa użytkownika: min. 10, max. 20 znaków. Hasło: min. 10, max. 20 znaków.',
    });
  }
});


// Middleware to authenticate token and check for session expiry
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || !userSessions[token]) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  // Verify JWT token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      delete userSessions[token]; // Remove invalid or expired session
      return res.status(401).json({ error: 'Session expired or invalid token' });
    }

    // Attach session data to request if valid
    req.sessionData = userSessions[token];
    next();
  });
};

// Periodic cleanup of expired sessions
setInterval(() => {
  const now = Date.now();
  for (const token in userSessions) {
    if (now - userSessions[token].createdAt > SESSION_EXPIRY_MS) {
      delete userSessions[token];
    }
  }
}, 15 * 60 * 1000); // Run every 15 minutes


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

    //---------------DEBUGG
    // console.log('New product added to session:', newProduct);

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


//--------------------- Test endpoints
let isTestRunning = false;
let testProcess = null;

app.post('/run-tests', authenticateToken, (req, res) => {
  const environment = process.env.NODE_ENV || 'production';
  
  if (environment !== 'local') {
    return res.status(403).json({ message: 'Tests can only be run in the local environment.' });
  }

  const command = `npx cross-env USE_LOCAL=1 wdio run wdio.conf.js --suite e2e`;
  isTestRunning = true; // Set running flag
  testProcess = exec(command, { cwd: path.resolve(__dirname, '../webdriverio_test_project'), shell: true }, (error, stdout, stderr) => {
    isTestRunning = false; // Reset running flag when tests complete
    if (error) {
      console.error(`Error executing tests: ${stderr || error.message}`);
      return res.status(500).json({ message: 'Error running tests', details: stderr || error.message });
    }
    console.log(`Test results: ${stdout}`);
  });
  
  res.status(200).json({ message: 'Tests started successfully' });
});

app.get('/check-tests', authenticateToken, (req, res) => {
  res.status(200).json({ isTestRunning });
});


//---------------------- Image upload endpoint currently not used
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

//---------------------- Images 
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
  res.send('Welcome to the Automate 4 QA API');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(helmet());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));