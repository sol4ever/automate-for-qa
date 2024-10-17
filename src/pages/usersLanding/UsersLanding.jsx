import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import './usersLanding.css';

function UsersLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath.startsWith(path);

  return (
    <div className="users-landing-container">
    <nav>
      <List component="nav">
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/users-landing/info')}
            className={isActive('/users-landing/info') ? 'active' : ''}
            data-testid="navInfo"
          >
            <ListItemText primary="Jak testować?" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/users-landing/list')}
            className={isActive('/users-landing/list') || isActive('/user/') ? 'active' : ''}
            data-testid="navList"
          >
            <ListItemText primary="Lista" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/users-landing/deleted')}
            className={isActive('/users-landing/deleted') ? 'active' : ''}
            data-testid="navDeleted"
          >
            <ListItemText primary="Lista usuniętych" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/users-landing/new')}
            className={isActive('/users-landing/new') ? 'active' : ''}
            data-testid="navNew"
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

export default UsersLanding;
