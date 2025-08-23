import React from 'react';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import './imageUpload.css';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg'

const ImageUpload = ({ img, onClick, label }) => {
  return (
    <div className="imageUploadContainer" onClick={onClick}>
      <img
        src={img ? `${DOMPurify.sanitize(process.env.REACT_APP_API_URL)}${DOMPurify.sanitize(img)}` : noImage}
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
