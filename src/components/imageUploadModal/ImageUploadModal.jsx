import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Grid } from '@mui/material';
import axios from 'axios';
import './imageUploadModal.css';
import DOMPurify from 'dompurify';

const ImageUploadModal = ({ open, onClose, onSelect, imageType }) => {
  const [images, setImages] = useState([]);
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/images/list?type=${imageType}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images', error);
      }
    };
    fetchImages();
  }, [imageType, token]);

  const handleImageClick = (image) => {
    onSelect(image);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modalBox">
        <Typography
          variant="h6"
          component="h2"
          className="modalTitle"
          style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'bold', fontSize: '24px', marginTop: '20px' }}
        >
          Wybierz obraz
        </Typography>
        <Grid container spacing={1} className="imageUploadModal">
          {images.map((image) => (
            <Grid item xs={2} key={image}
              className="imageContainer">
              <div onClick={() => handleImageClick(image)}>
                <img
                  src={`${DOMPurify.sanitize(process.env.REACT_APP_API_URL)}/images/${DOMPurify.sanitize(imageType)}/${DOMPurify.sanitize(image)}`}
                  alt={DOMPurify.sanitize(image)}
                  className="modalImage"
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ImageUploadModal;
