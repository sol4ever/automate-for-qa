import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem('authToken');

  const fetchUsers = () => {
    if (!token) {
      console.warn("No authorization token found. Redirecting to login...");
      return;
    }
    axios.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error("There was an error fetching the users!", error));
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);


  const resetUsers = () => {
    console.log("Resetting users...");
    fetchUsers();
  };

  return (
    <UserContext.Provider value={{ users, setUsers, resetUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
