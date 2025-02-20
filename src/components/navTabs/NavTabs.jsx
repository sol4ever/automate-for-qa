import React, { useState, useContext, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import './navTabs.css';
import automateLogo from '../../images/logo autoMate.png';
import UserContext from '../../components/context/UserContext';
import ProductContext from '../../components/context/ProductContext';
import axios from '../../utils/axiosConfig';
import ResetConfirmationModal from '../../components/resetConfirmationModal/ResetConfirmationModal';
import Notification from '../../components/notification/Notification';
import LoginModal from '../../components/loginModal/LoginModal';
import TestConfirmationModal from '../../components/testConfirmationModal/TestConfirmationModal'


function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export default function NavTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const { setUsers } = useContext(UserContext);
  const { setProducts } = useContext(ProductContext);

  const [openResetModal, setOpenResetModal] = useState(false);
  const [openTestModal, setOpenTestModal] = useState(false);
  const token = sessionStorage.getItem('authToken');
  const [alert, setAlert] = useState(null);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState('');
  const [testInProgress, setTestInProgress] = useState(false);


  const tabToPath = {
    0: '/home',
    1: '/docs',
    2: '/analytics',
    3: '/users-landing/info',
    4: '/products-landing/info',
    5: '/selectors',
    6: '/about',
  };

  const pathToTab = {
    '/home': 0,
    '/docs': 1,
    '/analytics': 2,
    '/users-landing/info': 3,
    '/products-landing/info': 4,
    '/selectors': 5,
    '/about': 6,
  };

  const handleChange = (event, newValue) => {
    const selectedPath = tabToPath[newValue];
    //----------------- If user is not logged in and clicks on a restricted route, show login modal
    if (!token && (selectedPath === '/analytics' || selectedPath.includes('/users-landing') || selectedPath.includes('/products-landing'))) {
      setPendingRoute(selectedPath);
      setOpenLoginModal(true);
    } else {
      setValue(newValue);
      navigate(selectedPath);
    }
  };

  const handleLoginSuccess = () => {
    setOpenLoginModal(false);
    if (pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute('');
    }
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
    navigate('/home');
  };

  useEffect(() => {
    setValue(pathToTab[path] || 0);
  }, [path]);

  const [value, setValue] = useState(pathToTab[path] || 0);

  const handleLogoClick = (event) => {
    event.preventDefault();
    navigate('/home');
  };

  const handleReset = () => {
    // console.log('Resetting users and products...');

    axios.post(`${process.env.REACT_APP_API_URL}/reset`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      // console.log('Reset successful:', response.data);
      axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => setUsers(res.data));
      axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => setProducts(res.data));
      if (path === '/analytics') {
        window.location.reload();
      } else {
        navigate(path);
      }
      setAlert({ severity: 'success', message: 'Reset zakończony sukcesem' });
      setOpenResetModal(false);
    })
      .catch(error => {
        console.error('Error resetting data:', error);
        setAlert({ severity: 'error', message: 'Reset nie powiódł się' });
        setOpenResetModal(false);
      });
  };

  const openResetConfirmation = () => {
    setOpenResetModal(true);
  };

  const closeResetModal = () => {
    setOpenResetModal(false);
  };

  const openTestConfirmation = () => {
    setOpenTestModal(true); 
  };

  const closeTestModal = () => {
    setOpenTestModal(false);
  };

  const isLocalhost = window.location.hostname === 'localhost';


  const handleTest = () => {
    setTestInProgress(true);
    setAlert({ severity: 'success', message: 'Testy zostały uruchomione.' });
    setTimeout(() => {
      setAlert({ severity: 'info', message: "Testy wykonują się. Nie wyłączaj localhost'a", persistent: true });
    }, 3000);

    axios.post(`${process.env.REACT_APP_API_URL}/run-tests`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      closeTestModal();
    }).catch(error => {
      console.error("Error running tests:", error);
      setAlert({ severity: 'error', message: 'Wystąpił problem podczas uruchamiania testów.' });
      setTestInProgress(false);
    });
  };

  useEffect(() => {
    let intervalId;
    if (testInProgress) {
      intervalId = setInterval(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/check-tests`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
          if (!response.data.isTestRunning) {
            setTestInProgress(false);
            setAlert({ severity: 'success', message: 'Testy zostały zakończone.', persistent: false });
          }
        }).catch(error => {
          console.error("Error checking test status:", error);
        });
      }, 5000);
    }

    return () => clearInterval(intervalId);
  }, [testInProgress]);

  useEffect(() => {
    if (alert && !alert.persistent) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="nav-tabs">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="nav tabs example"
        role="navigation"
        className="tabs-container"
      >
        <LinkTab
          data-testid="nav-home"
          label={
            <img
              src={automateLogo}
              alt="AutoMate Logo"
              className="logo-tab"
            />
          }
          className="qa-path-tab"
          onClick={handleLogoClick}
        />
        <LinkTab data-testid="nav-docs" label="Dokumentacja" />
        <LinkTab
          data-testid="nav-analytics"
          label="Analityczne"
        />
        <LinkTab
          data-testid="nav-users"
          label="Pracownicy"
        />
        <LinkTab
          data-testid="nav-products"
          label="Produkty"
        />
      </Tabs>
      <div className="right-side-container">
        {token && (
          <>
            {isLocalhost && (
              <button
                className={`test-button ${testInProgress ? 'test-button-disabled' : ''}`}
                onClick={openTestConfirmation}
                disabled={testInProgress}
                data-testid="test-button"
              >
                Test
              </button>
            )}
            <button className="reset-button" onClick={openResetConfirmation} data-testid="reset-button">
              Reset
            </button>
          </>
        )}
      </div>
      <ResetConfirmationModal
        open={openResetModal}
        onClose={closeResetModal}
        onConfirm={handleReset}
      />
      <TestConfirmationModal
        open={openTestModal}
        onClose={closeTestModal}
        onConfirm={handleTest}
      />
      <Notification alert={alert} />
      <LoginModal
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
