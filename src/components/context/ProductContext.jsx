import React, { createContext, useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const token = sessionStorage.getItem('authToken');

    const fetchProducts = () => {
        if (!token) {
            console.warn("No authorization token found. Redirecting to login...");
            return;
        }
        axios.get('/api/products', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => setProducts(response.data))
            .catch(error => console.error("There was an error fetching the products!", error));
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const resetProducts = () => {
        console.log("Resetting products...");
        fetchProducts();
    };

    return (
        <ProductContext.Provider value={{ products, setProducts, resetProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContext;
