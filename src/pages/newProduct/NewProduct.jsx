import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import axios from '../../utils/axiosConfig';
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
    // console.log('Product data being sent:', productData);

    const { valid, formErrors } = validateProductForm(productData);
    setErrors(formErrors);

    if (valid) {
      const dataToSend = { ...productData, status: productData.status || '' };

      axios.post('/products', dataToSend, {
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
      <h1 className="newProductTitle" data-testid="new-product-title">Nowy produkt</h1>
      <form className="newProductForm" onSubmit={handleSubmit} data-testid="new-product-form">
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
              data-testid="mobile-phone-fields"
            />
          )}
          {productData.category === 'Akcesoria' && productData.subcategory && !productData.brand && (
            <div className="newProductItem" data-testid="accessories-brand-select">
              <label>Producent</label>
              <Select
                name="brand"
                value={productData.brand}
                onChange={handleInputChange}
                displayEmpty
                className="newProductInput"
                onBlur={handleBlur}
                data-testid="select-brand"
              >
                <MenuItem value="" disabled hidden data-testid="brand-select-placeholder">
                  Wybierz producenta
                </MenuItem>
                {['Samsung', 'Apple', 'Xiaomi', 'FOREVER'].map((brand) => (
                  <MenuItem key={brand} value={brand} data-testid={`brand-option-${brand}`}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
              {errors.brand && <span className="errorMessage" data-testid="error-brand">{errors.brand}</span>}
            </div>
          )}
          {productData.category === 'Akcesoria' && productData.brand && (
            <AccessoriesFields
              productData={productData}
              handleInputChange={handleInputChange}
              onBlur={handleBlur}
              data-testid="accessories-fields"
            />
          )}
        </div>
        <div className="newProductRight">
          <ImageUpload
            img={DOMPurify.sanitize(productData.img)}
            onClick={() => setIsModalOpen(true)}
            label="Wybierz obraz"
            data-testid="image-upload"
          />
          <div className="productInfoBottom">
            <div className="newProductItem" data-testid="price-input-wrapper">
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
                data-testid="price-input"
              />
              {errors.price && <span className="errorMessage" data-testid="error-price">{errors.price}</span>}
            </div>

            <div className="newProductItem" data-testid="inStock-select-wrapper">
              <label>Dostępny</label>
              <Select
                name="inStock"
                value={DOMPurify.sanitize(productData.inStock || 'Tak')}
                onChange={handleInputChange}
                onBlur={handleBlur}
                displayEmpty
                className="newProductInput"
                data-testid="inStock-select"
              >
                <MenuItem value={DOMPurify.sanitize('Tak')} data-testid="inStock-yes">Tak</MenuItem>
                <MenuItem value={DOMPurify.sanitize('Nie')} data-testid="inStock-no">Nie</MenuItem>
              </Select>
            </div>

            <div className="newProductItem" data-testid="promoted-switch-wrapper">
              <label>Promowany</label>
              <GreenSwitch
                checked={productData.promoted}
                onChange={handlePromotedToggle}
                data-testid="promoted-switch"
              />
            </div>
          </div>
          <button
            type="submit"
            className="submitButtonNewForm"
            data-testid="submit-button"
          >
            Dodaj
          </button>
        </div>
      </form>
      <Notification alert={alert} data-testid="notification" />
      <ImageUploadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleImageSelect}
        imageType="products"
        data-testid="image-upload-modal"
      />
    </div>
  );

};

export default NewProduct;
