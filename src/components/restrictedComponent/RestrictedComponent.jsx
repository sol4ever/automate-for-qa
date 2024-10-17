import React from 'react';
import { Navigate } from 'react-router-dom';

const RestrictedComponent = ({ children, isLoggedIn }) => {
  const token = sessionStorage.getItem('authToken');

  if (token || isLoggedIn) {
    return <>{children}</>;
  }

  return <Navigate to="/" />;
};

export default RestrictedComponent;
