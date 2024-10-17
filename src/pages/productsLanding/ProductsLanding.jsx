import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import './productsLanding.css'; 

function ProductsLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath.startsWith(path);

  return (
    <div className="products-landing-container">
      <nav>
        <List component="nav">
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/products-landing/info')}
              className={isActive('/products-landing/info') ? 'active' : ''}
            >
              <ListItemText primary="Jak testować?" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/products-landing/list')}
              className={isActive('/products-landing/list') || isActive('/product/') ? 'active' : ''}
            >
              <ListItemText primary="Lista" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/products-landing/deleted')}
              className={isActive('/products-landing/deleted') || isActive('/product/') ? 'active' : ''}
            >
              <ListItemText primary="Lista usuniętych" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/products-landing/new')}
              className={isActive('/products-landing/new') ? 'active' : ''}
            >
              <ListItemText primary="Dodaj" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default ProductsLanding;
