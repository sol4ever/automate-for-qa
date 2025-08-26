import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import GeneralInfo from './GeneralInfo';
import MobilePhoneFields from './MobilePhoneFields';
import AccessoriesFields from './AccessoriesFields';
import ImageUpload from '../../components/imageUpload/ImageUpload';
import ImageUploadModal from '../../components/imageUploadModal/ImageUploadModal';
import Notification from '../../components/notification/Notification';
import DeleteConfirmationModal from '../../components/deleteConfirmationModal/DeleteConfirmationModal';
import { validateProductForm } from '../../utils/validation';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { Select, MenuItem } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import './product.css';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';

const categories = {
  'Telefony komórkowe': ['Smartfony', 'Feature Phones'],
  'Akcesoria': ['Etui', 'Szkła ochronne', 'Ładowarki', 'Słuchawki', 'Powerbanki'],
};

const OrangeSwitch = styled(Switch)(({ theme }) => ({
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

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const token = sessionStorage.getItem('authToken');

  const [productData, setProductData] = useState({
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
  });

  const [updatedProductData, setUpdatedProductData] = useState(productData);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(productId);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    axios.get(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      const data = response.data;
      data.color = Array.isArray(data.color) ? data.color : [];
      data.inStock = data.inStock === 'yes' ? 'Tak' : 'Nie';
      setProductData(data);

      const updatedData = {
        ...data,
        os: data.os || '',
        screenSize: data.screenSize || '',
        storage: data.storage || '',
        ram: data.ram || '',
        battery: data.battery || '',
      };
      setUpdatedProductData(updatedData);
    })
      .catch(error => {
        console.error("There was an error fetching the product!", error);
        setAlert({ severity: 'error', message: 'Error fetching product data.' });
      });
  }, [productId, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedProductData((prevState) => {
      if (name === 'category') {
        return {
          ...prevState,
          category: value,
          subcategory: '',
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
          subcategory: value,
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
      if (name === 'brand') {
        return {
          ...prevState,
          brand: value,
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
        [name]: value,
      };
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const { formErrors } = validateProductForm({ ...updatedProductData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name],
    }));
  };

  const handlePromotedToggle = () => {
    setUpdatedProductData((prevState) => ({
      ...prevState,
      promoted: !prevState.promoted,
    }));
  };

  const handleImageSelect = (imagePath) => {
    setUpdatedProductData((prevState) => ({
      ...prevState,
      img: `/images/products/${imagePath}`,
    }));
    setIsModalOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();


    const updatedDataToSubmit = {
      ...updatedProductData,
      inStock: updatedProductData.inStock === 'Tak' ? 'yes' : 'no',
      status: updatedProductData.status || 'active'
    };

    const { valid, formErrors } = validateProductForm(updatedProductData);
    if (valid) {
      axios.put(`/products/${productId}`, updatedDataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          setProductData(updatedProductData);
          setIsUpdated(true);
          setAlert({ severity: 'success', message: 'Produkt został zaktualizowany!' });
        })
        .catch((error) => {
          if (error.response && error.response.data.errors) {
            // Get the first validation error from the backend response
            const firstErrorKey = Object.keys(error.response.data.errors)[0];
            const firstErrorMessage = error.response.data.errors[firstErrorKey];
            setAlert({ severity: 'error', message: firstErrorMessage });
          } else {
            setAlert({ severity: 'error', message: 'Błąd podczas aktualizacji produktu.' });
          }
        });
    } else {
      // If frontend validation fails, show the first validation error
      const firstErrorKey = Object.keys(formErrors)[0];
      const firstErrorMessage = formErrors[firstErrorKey];
      setErrors(formErrors);
      setAlert({ severity: 'error', message: firstErrorMessage });
    }
  };


  const handleDelete = () => {
    axios.put(`/products/${selectedProductId}`,
      { status: 'deleted' },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setProducts(products.map(product => product.id === selectedProductId ? { ...product, status: 'deleted' } : product));
        setAlert({ severity: 'success', message: 'Produkt zostanie usunięty!' });
        setModalOpen(false);
        setTimeout(() => {
          navigate('/products-landing/deleted', { state: { refresh: true } });
        }, 2000);
      })
      .catch(error => {
        console.error("There was an error deleting the product!", error);
        setAlert({ severity: 'error', message: 'Nie udało się usunąć produktu!' });
      });
  };

  const handleOpenDeleteModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const renderProductInfoItem = (label, value) => (
    <div className="productInfoItem" key={label} data-testid={`product-info-item-${label}`}>
      <span className="productInfoKey" data-testid={`product-info-key-${label}`}>{label}:</span>
      <span className="productInfoValue" data-testid={`product-info-value-${label}`}>
        {label === 'Dostępny' ? (value === 'Tak' ? 'Tak' : 'Nie') : DOMPurify.sanitize(value)}
      </span>
    </div>
  );
  

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const renderCategoryFields = () => {
    const { subcategory } = productData;

    switch (subcategory) {
      case 'Smartfony':
      case 'Feature Phones':
        return (
          <>
            {renderProductInfoItem('Producent', productData.brand || 'Wybierz producenta')}
            {renderProductInfoItem('System operacyjny', productData.os || 'Wybierz system operacyjny')}
            {renderProductInfoItem('Rozmiar ekranu', productData.screenSize || 'Wybierz rozmiar ekranu')}
            {renderProductInfoItem('Pamięć wbudowana', productData.storage || 'Wybierz pamięć wbudowaną')}
            {renderProductInfoItem('RAM', productData.ram || 'Wybierz RAM')}
            {renderProductInfoItem('Pojemność baterii', productData.battery || 'Wybierz pojemność baterii')}
            {renderProductInfoItem('Kolor', productData.color.join(', ') || 'Wybierz kolor')}
          </>
        );
      case 'Etui':
        return (
          <>
            {renderProductInfoItem('Producent', productData.brand || 'Wybierz producenta')}
            {renderProductInfoItem('Dedykowane do modelu', productData.applicableModel || 'Wybierz model')}
            {renderProductInfoItem('Tworzywo', productData.material || 'Wybierz tworzywo')}
            {renderProductInfoItem('Kolor', productData.color.join(', ') || 'Wybierz kolor')}
          </>
        );
      case 'Szkła ochronne':
        return (
          <>
            {renderProductInfoItem('Producent', productData.brand || 'Wybierz producenta')}
            {renderProductInfoItem('Dedykowane do modelu', productData.applicableModel || 'Wybierz model')}
            {renderProductInfoItem('Rozmiar ekranu', productData.screenSize || 'Wybierz rozmiar ekranu')}
          </>
        );
      case 'Ładowarki':
        return (
          <>
            {renderProductInfoItem('Producent', productData.brand || 'Wybierz producenta')}
            {renderProductInfoItem('Dedykowane do modelu', productData.applicableModel || 'Wybierz model')}
            {renderProductInfoItem('Typ wejścia', productData.chargerType || 'Wybierz typ wejścia')}
          </>
        );
      case 'Słuchawki':
        return (
          <>
            {renderProductInfoItem('Producent', productData.brand || 'Wybierz producenta')}
            {renderProductInfoItem('Dedykowane do modelu', productData.applicableModel || 'Wybierz model')}
            {renderProductInfoItem('Typ', productData.type || 'Wybierz typ')}
            {renderProductInfoItem('Kolor', productData.color.join(', ') || 'Wybierz kolor')}
          </>
        );
      case 'Powerbanki':
        return (
          <>
            {renderProductInfoItem('Producent', productData.brand || 'Wybierz producenta')}
            {renderProductInfoItem('Dedykowane do modelu', productData.applicableModel || 'Wybierz model')}
            {renderProductInfoItem('Pojemność baterii', productData.battery || 'Wybierz pojemność baterii')}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='product'>
      <div className="productTopActions">
        <h1 className="productTitle" data-testid="product-title">Produkt</h1>
        <button
          className="backButton"
          onClick={() => navigate('/products-landing/list')}
          data-testid="back-button"
        >
          &laquo; Powrót do listy
        </button>
      </div>
      <div className="productOverviewContainer">
        <h2 className="productOverview" data-testid="product-overview">Szczegóły produktu</h2>
        <div className="productTopContent">
          <img
            src={productData.img ? productData.img : noImage}
            alt=""
            className="productInfoImgLarge"
            data-testid="product-image"
          />
          <div className="productDetails">
            <div className="productCategory" data-testid="product-category">
              {productData.subcategory}
            </div>
            <div className="productName" data-testid="product-name">
              {productData.name}
            </div>
            <div className="productDetailsGrid" data-testid="product-details-grid">
              {renderProductInfoItem('ID', productData.id)}
              {renderProductInfoItem('Cena', `${productData.price} PLN`)}
              {renderProductInfoItem('Promowany', productData.promoted ? 'Tak' : 'Nie')}
              {renderProductInfoItem('Dostępny', productData.inStock)}
              {renderCategoryFields()}
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={handleUpdate} data-testid="product-form">
          <div className="productFormLeft">
            <GeneralInfo
              productData={updatedProductData}
              handleInputChange={handleInputChange}
              handleBlur={handleBlur}
              errors={errors}
              categories={categories}
              data-testid="general-info"
            />

            {updatedProductData.category === 'Akcesoria' && updatedProductData.subcategory && !updatedProductData.brand && (
              <div className="newProductItem" data-testid="brand-select-wrapper">
                <label>Producent</label>
                <Select
                  name="brand"
                  value={updatedProductData.brand}
                  onChange={handleInputChange}
                  displayEmpty
                  className="newProductInput"
                  onBlur={handleBlur}
                  data-testid="brand-select"
                >
                  <MenuItem value="" disabled hidden data-testid="brand-placeholder">
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

            {updatedProductData.category === 'Akcesoria' && updatedProductData.brand && (
              <AccessoriesFields
                productData={updatedProductData}
                handleInputChange={handleInputChange}
                onBlur={handleBlur}
                data-testid="accessories-fields"
              />
            )}

            {updatedProductData.category === 'Telefony komórkowe' && updatedProductData.subcategory && (
              <MobilePhoneFields
                productData={updatedProductData}
                handleInputChange={handleInputChange}
                onBlur={handleBlur}
                data-testid="mobile-phone-fields"
              />
            )}
          </div>

          <div className="productFormRight">
            <ImageUpload
              img={updatedProductData.img}
              onClick={() => setIsModalOpen(true)}
              label="Zmień obraz"
              data-testid="image-upload"
            />
            <div className="productInfoBottom">
              <div className="newProductItem" data-testid="price-input-wrapper">
                <label>Cena</label>
                <input
                  type="text"
                  name="price"
                  placeholder="123 PLN"
                  value={DOMPurify.sanitize(updatedProductData.price)}
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
                  value={DOMPurify.sanitize(updatedProductData.inStock)}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  displayEmpty
                  className="newProductInput"
                  data-testid="inStock-select"
                >
                  <MenuItem value="Tak" data-testid="inStock-yes">Tak</MenuItem>
                  <MenuItem value="Nie" data-testid="inStock-no">Nie</MenuItem>
                </Select>
              </div>
              <div className="newProductItem" data-testid="promoted-switch-wrapper">
                <label>Promowany</label>
                <OrangeSwitch
                  checked={updatedProductData.promoted}
                  onChange={handlePromotedToggle}
                  data-testid="promoted-switch"
                />
              </div>
              <ButtonGroup
                variant="contained"
                aria-label="contained button group"
                className="decisionButtonGroup"
                data-testid="button-group"
              >
                <button
                  className="deleteButtonEditForm"
                  type='button'
                  onClick={handleOpenDeleteModal}
                  data-testid="delete-button"
                >
                  Usuń
                </button>
                <button
                  type="submit"
                  className="submitButtonEditForm"
                  data-testid="submit-button"
                >
                  Zapisz
                </button>
              </ButtonGroup>
            </div>
          </div>
        </form>
        {isUpdated}
      </div>
      <Notification alert={alert} data-testid="notification" />
      <ImageUploadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleImageSelect}
        imageType="products"
        data-testid="image-upload-modal"
      />
      <DeleteConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Zamierzasz usunąć produkt!"
        message="Czy na pewno chcesz usunąć produkt?"
        data-testid="delete-confirmation-modal"
      />
    </div>
  );

};

export default Product;
