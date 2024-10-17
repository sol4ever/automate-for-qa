import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import NavTabs from './components/navTabs/NavTabs.jsx';
import Home from './pages/home/Home.jsx';
import Analytics from './pages/analytics/Analytics.jsx';
import User from './pages/user/User.jsx';
import NewUser from './pages/newUser/NewUser.jsx';
import ProductList from './pages/productList/ProductList.jsx';
import Product from './pages/product/Product.jsx';
import NewProduct from './pages/newProduct/NewProduct.jsx';
import UserList from './pages/userList/UserList.jsx';
import Docs from './pages/docs/Docs.jsx';
import ProductsLanding from './pages/productsLanding/ProductsLanding.jsx';
import UsersLanding from './pages/usersLanding/UsersLanding.jsx';
import UserTestsInfo from './pages/usersLanding/UserTestsInfo.jsx';
import DeletedUserList from './pages/deletedUserList/DeletedUserList.jsx';
import DeletedProductList from './pages/deletedProductList/DeletedProductList.jsx';
import ProductTestsInfo from './pages/productsLanding/ProductTestsInfo.jsx';
import RestrictedComponent from './components/restrictedComponent/RestrictedComponent.jsx';
import LoginModal from './components/loginModal/LoginModal.jsx';
import './app.css';

function AppContent() {
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const restrictedPaths = [
      '/analytics',
      '/products-landing',
      '/products-landing/info',
      '/products-landing/list',
      '/products-landing/deleted',
      '/products-landing/new',
      '/products-landing/edit',
      '/users-landing',
      '/users-landing/info',
      '/users-landing/list',
      '/users-landing/deleted',
      '/users-landing/new',
      '/users-landing/edit',
    ];

    const token = sessionStorage.getItem('authToken');
    const isRestricted = restrictedPaths.some((path) => location.pathname.startsWith(path));

    if (isRestricted && !token) {
      setIsLoginModalOpen(true);
    }
  }, [location.pathname]);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsLoggedIn(true); 
  };

  return (
    <>
      <NavTabs />
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <div className="container">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/analytics" element={<RestrictedComponent isLoggedIn={isLoggedIn}><Analytics /></RestrictedComponent>} />
          <Route path="/products-landing" element={<RestrictedComponent isLoggedIn={isLoggedIn}><ProductsLanding /></RestrictedComponent>}>
            <Route path="info" element={<ProductTestsInfo />} />
            <Route path="list" element={<ProductList />} />
            <Route path="deleted" element={<DeletedProductList />} />
            <Route path="new" element={<NewProduct />} />
            <Route path="edit/:productId" element={<Product />} />
          </Route>
          <Route path="/users-landing" element={<RestrictedComponent isLoggedIn={isLoggedIn}><UsersLanding /></RestrictedComponent>}>
            <Route path="info" element={<UserTestsInfo />} />
            <Route path="list" element={<UserList />} />
            <Route path="deleted" element={<DeletedUserList />} />
            <Route path="new" element={<NewUser />} />
            <Route path="edit/:userId" element={<User />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default AppContent;
