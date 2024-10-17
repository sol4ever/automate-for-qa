import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import GeneralInfo from '../product/GeneralInfo';
import MobilePhoneFields from '../product/MobilePhoneFields';
import AccessoriesFields from '../product/AccessoriesFields';
import ProductContext from '../../components/context/ProductContext';
import { validateProductForm } from '../../utils/validation';
import Notification from '../../components/notification/Notification';
import ImageUpload from '../../components/imageUpload/ImageUpload';
import ImageUploadModal from '../../components/imageUploadModal/ImageUploadModal';
import { Select, MenuItem } from '@mui/material';
import './newProduct.css';
import DOMPurify from 'dompurify';

const categories = {
  'Telefony komórkowe': ['Smartfony', 'Feature Phones'],
  'Akcesoria': ['Etui', 'Szkła ochronne', 'Ładowarki', 'Słuchawki', 'Powerbanki'],
};

const initialState = {
  name: '',
  category: '',
  subcategory: '',
  brand: '',
  price: '',
  inStock: 'Tak',
  promoted: false,
  os: '',
  screenSize: '',
  storage: '',
  ram: '',
  battery: '',
  material: '',
  color: [],
  chargerType: '',
  applicableModel: '',
  type: '',
  img: '',
};

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#F29727',
    '&:hover': {
      backgroundColor: alpha('#F29727', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#F29727',
  },
}));

const NewProduct = () => {
  const navigate = useNavigate();
  const { products, setProducts } = useContext(ProductContext);
  const [productData, setProductData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProductData((prevState) => {
      const sanitizedValue = DOMPurify.sanitize(value);

      if (name === 'category') {
        return {
          ...prevState,  // Keep the current state
          category: sanitizedValue,  // Update only the category
          subcategory: '',  // Reset subcategory and other related fields
          brand: '',
          os: '',
          screenSize: '',
          storage: '',
          ram: '',
          battery: '',
          material: '',
          color: [],
          chargerType: '',
          applicableModel: '',
          type: '',
        };
      }
      if (name === 'subcategory') {
        return {
          ...prevState,
          subcategory: sanitizedValue,
          brand: '',  // Reset brand and related fields when subcategory changes
          os: '',
          screenSize: '',
          storage: '',
          ram: '',
          battery: '',
          material: '',
          color: [],
          chargerType: '',
          applicableModel: '',
          type: '',
        };
      }
      if (name === 'brand') {
        return {
          ...prevState,
          brand: sanitizedValue,  // Update the brand and reset related fields
          os: '',
          screenSize: '',
          storage: '',
          ram: '',
          battery: '',
          material: '',
          color: [],
          chargerType: '',
          applicableModel: '',
          type: '',
        };
      }

      return {
        ...prevState,
        [name]: sanitizedValue,  // Update the field based on the name
      };
    });
  };


  const validateField = (name, value) => {
    const updatedProductData = { ...productData, [name]: value };
    const { formErrors } = validateProductForm(updatedProductData);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name],
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handlePromotedToggle = () => {
    setProductData((prevState) => ({
      ...prevState,
      promoted: !prevState.promoted,
    }));
  };

  const handleImageSelect = (imagePath) => {
    setProductData((prevState) => ({
      ...prevState,
      img: `/images/products/${imagePath}`,
    }));
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product data being sent:', productData);
  
    const { valid, formErrors } = validateProductForm(productData);
    setErrors(formErrors);
  
    if (valid) {
      const dataToSend = { ...productData, status: productData.status || '' }; 
  
      axios.post(`${process.env.REACT_APP_API_URL}/products`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts([...products, response.data]);
        setAlert({ severity: 'success', message: 'Produkt został dodany!' });
        setTimeout(() => {
          navigate('/products-landing/list');
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          // Get the first validation error from the backend response
          const firstErrorKey = Object.keys(error.response.data.errors)[0];
          const firstErrorMessage = error.response.data.errors[firstErrorKey];
          setAlert({ severity: 'error', message: firstErrorMessage });
        } else {
          setAlert({ severity: 'error', message: 'Nie udało się dodać produktu!' });
        }
      });
    } else {
      // If frontend validation fails, show the first validation error
      const firstErrorKey = Object.keys(formErrors)[0];
      const firstErrorMessage = formErrors[firstErrorKey];
      setAlert({
        severity: 'error',
        message: firstErrorMessage || 'Niektóre dane są nieprawidłowe. Popraw dane aby dodać produkt.',
      });
    }
  };
  

  

  return (
    <div className="newProduct">
      <h1 className="newProductTitle">Nowy produkt</h1>
      <form className="newProductForm" onSubmit={handleSubmit}>
        <div className="newProductLeft">
          <GeneralInfo
            productData={productData}
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            errors={errors}
            categories={categories}
          />
          {productData.category === 'Telefony komórkowe' && productData.subcategory && (
            <MobilePhoneFields
              productData={productData}
              handleInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          )}
          {productData.category === 'Akcesoria' && productData.subcategory && !productData.brand && (
            <div className="newProductItem">
              <label>Producent</label>
              <Select
                name="brand"
                value={productData.brand}
                onChange={handleInputChange}
                displayEmpty
                className="newProductInput"
                onBlur={handleBlur}
              >
                <MenuItem value="" disabled hidden>
                  Wybierz producenta
                  </MenuItem>
                {['Samsung', 'Apple', 'Xiaomi', 'FOREVER'].map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
              {errors.brand && <span className="errorMessage">{errors.brand}</span>}
            </div>
          )}
          {productData.category === 'Akcesoria' && productData.brand && (
            <AccessoriesFields
              productData={productData}
              handleInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          )}
        </div>
        <div className="newProductRight">
          <ImageUpload
            img={DOMPurify.sanitize(productData.img)}
            onClick={() => setIsModalOpen(true)}
            label="Wybierz obraz"
          />
          <div className="productInfoBottom">
            <div className="newProductItem">
              <label>Cena</label>
              <input
                type="text"
                name="price"
                placeholder="123 PLN"
                value={DOMPurify.sanitize(productData.price || '')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                onBlur={handleBlur}
              />
              {errors.price && <span className="errorMessage">{errors.price}</span>}
            </div>

            <div className="newProductItem">
              <label>Dostępny</label>
              <Select
                name="inStock"
                value={DOMPurify.sanitize(productData.inStock || 'Tak')}
                onChange={handleInputChange}
                onBlur={handleBlur}
                displayEmpty
                className="newProductInput"
              >
                <MenuItem value={DOMPurify.sanitize('Tak')}>Tak</MenuItem>
                <MenuItem value={DOMPurify.sanitize('Nie')}>Nie</MenuItem>
              </Select>
            </div>
            <div className="newProductItem">
              <label>Promowany</label>
              <GreenSwitch checked={productData.promoted} onChange={handlePromotedToggle} />
            </div>
          </div>
          <button type="submit" className="submitButtonNewForm">
            Dodaj
          </button>
        </div>
      </form>
      <Notification alert={alert} />
      <ImageUploadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleImageSelect}
        imageType="products"
      />
    </div>
  );
};

export default NewProduct;
