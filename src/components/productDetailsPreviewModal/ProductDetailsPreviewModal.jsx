import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import './productDetailsPreviewModal.css';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';

const ProductDetailsPreviewModal = ({ open, onClose, product }) => {
  const renderProductInfoItem = (label, value) => (
    <div className="modalProductInfoItem" key={label}>
      <span className="modalProductInfoKey">{DOMPurify.sanitize(label)}:</span>
      <span className="modalProductInfoValue">{DOMPurify.sanitize(value)}</span>
    </div>
  );

  const renderCategoryFields = () => {
    const { subcategory } = product;

    switch (subcategory) {
      case 'Smartfony':
      case 'Feature Phones':
        return (
          <>
            {renderProductInfoItem('Producent', DOMPurify.sanitize(product.brand) || 'Brak danych')}
            {renderProductInfoItem('System operacyjny', DOMPurify.sanitize(product.os) || 'Brak danych')}
            {renderProductInfoItem('Rozmiar ekranu', DOMPurify.sanitize(product.screenSize) || 'Brak danych')}
            {renderProductInfoItem('Pamięć wbudowana', DOMPurify.sanitize(product.storage) || 'Brak danych')}
            {renderProductInfoItem('RAM', DOMPurify.sanitize(product.ram) || 'Brak danych')}
            {renderProductInfoItem('Pojemność baterii', DOMPurify.sanitize(product.battery) || 'Brak danych')}
            {renderProductInfoItem('Kolor', product.color ? DOMPurify.sanitize(product.color.join(', ')) : 'Brak danych')}
          </>
        );
      case 'Etui':
        return (
          <>
            {renderProductInfoItem('Producent', DOMPurify.sanitize(product.brand) || 'Brak danych')}
            {renderProductInfoItem('Dedykowane do modelu', DOMPurify.sanitize(product.applicableModel) || 'Brak danych')}
            {renderProductInfoItem('Tworzywo', DOMPurify.sanitize(product.material) || 'Brak danych')}
            {renderProductInfoItem('Kolor', product.color ? DOMPurify.sanitize(product.color.join(', ')) : 'Brak danych')}
          </>
        );
      case 'Ładowarki':
        return (
          <>
            {renderProductInfoItem('Producent', DOMPurify.sanitize(product.brand) || 'Brak danych')}
            {renderProductInfoItem('Dedykowane do modelu', DOMPurify.sanitize(product.applicableModel) || 'Brak danych')}
            {renderProductInfoItem('Typ wejścia', DOMPurify.sanitize(product.chargerType) || 'Brak danych')}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="entityModal">
      <Box className="modalBox">
        <Typography
          variant="h6"
          component="h2"
          className="modalTitle"
          style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}
        >
          Produkt
        </Typography>
        <div className="entityShowTop">
          <div className="entityShowImgContainer">
            <img
              src={product.img ? `${process.env.REACT_APP_API_URL}${DOMPurify.sanitize(product.img)}` : noImage}
              alt=""
              className="modalProductInfoImgLarge"
            />
            <button className="modalDeletedProductLabel">Usunięty</button>
            <div className="entityShowTopTitle">
              <div className="entityShowName">
                {DOMPurify.sanitize(product.name)}
              </div>
              <div className="modalProductDetailsGrid">
                {renderProductInfoItem('ID', DOMPurify.sanitize(product.id))}
                {renderCategoryFields()}
                {renderProductInfoItem('Cena', `${DOMPurify.sanitize(product.price)} PLN`)}
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ProductDetailsPreviewModal;
