import React from 'react';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import './imageUpload.css';
import DOMPurify from 'dompurify';

const ImageUpload = ({ img, onClick, label }) => {
  return (
    <div className="imageUploadContainer" onClick={onClick}>
      <img
        src={img ? `${DOMPurify.sanitize(process.env.REACT_APP_API_URL)}${DOMPurify.sanitize(img)}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}
        alt=""
        className="imageUploadImg"
      />
      <label className="uploadLabel">
        <PhotoCameraOutlinedIcon data-testid="cameraIcon" />
        {DOMPurify.sanitize(label)}
      </label>
    </div>
  );
};

export default ImageUpload;
