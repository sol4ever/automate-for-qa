import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { validateProductForm } from '../../utils/validation';
import DOMPurify from 'dompurify';

const AccessoriesFields = ({ productData, handleInputChange }) => {
    const brands = ['Samsung', 'Apple', 'Xiaomi', 'FOREVER'];
    const screenSizeOptions = ['5.5"', '6.1"', '6.5"'];
    const materials = ['guma', 'plastik', 'drewno', 'metal', 'silikon', 'skóra', 'szkło'];
    const colors = ['czarny', 'biały', 'niebieski', 'czerwony', 'bezbarwny'];
    const chargerTypes = ['USB-C', 'USB-Micro'];
    const types = ['douszne', 'nauszne'];
    const batteryOptions = ['3000 mAh', '4000 mAh', '5000 mAh'];

    const applicableModels = {
        Samsung: ['Galaxy A40', 'Galaxy A70', 'Galaxy S10'],
        Apple: ['Iphone 10', 'Iphone 11'],
        Xiaomi: ['Redmi 14', 'Redmi 18'],
        FOREVER: ['Galaxy A40', 'Galaxy A70', 'Galaxy S10', 'Iphone 10', 'Iphone 11', 'Redmi 14', 'Redmi 15'],
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedColors;

        if (checked) {
            updatedColors = [...productData.color, value];
        } else {
            updatedColors = productData.color.filter((color) => color !== value);
        }

        handleInputChange({ target: { name: 'color', value: updatedColors } });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const updatedProductData = { ...productData, [name]: value };
        const { formErrors } = validateProductForm(updatedProductData);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: formErrors[name],
        }));
    };

    const [errors, setErrors] = useState({});

    return (
        <>
            <div className="newProductItem">
                <label>Producent</label>
                <Select
                    name="brand"
                    value={DOMPurify.sanitize(productData.brand || '')}  
                    onChange={handleInputChange}
                    displayEmpty
                    className="newProductInput"
                    onBlur={handleBlur}
                >
                    <MenuItem value="" disabled hidden>
                        Wybierz producenta
                    </MenuItem>
                    {brands.map((brand) => (
                        <MenuItem key={brand} value={DOMPurify.sanitize(brand)}>
                            {DOMPurify.sanitize(brand)}
                        </MenuItem>
                    ))}
                </Select>
                {errors.brand && <span className="errorMessage">{errors.brand}</span>}
            </div>

            {['Etui', 'Szkła ochronne', 'Ładowarki', 'Słuchawki', 'Powerbanki'].includes(productData.subcategory) && (
                <div className="newProductItem">
                    <label>Dedykowane do modelu</label>
                    <Select
                        name="applicableModel"
                        value={DOMPurify.sanitize(productData.applicableModel || '')}  
                        onChange={handleInputChange}
                        displayEmpty
                        className="newProductInput"
                        onBlur={handleBlur}
                    >
                        <MenuItem value="" disabled hidden>
                            Wybierz model
                        </MenuItem>
                        {applicableModels[productData.brand]?.map((model) => (
                            <MenuItem key={model} value={DOMPurify.sanitize(model)}>
                                {DOMPurify.sanitize(model)}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.applicableModel && <span className="errorMessage">{errors.applicableModel}</span>}
                </div>
            )}

            {productData.subcategory === 'Etui' && (
                <>
                    <div className="newProductItem">
                        <label>Tworzywo</label>
                        <Select
                            name="material"
                            value={DOMPurify.sanitize(productData.material || '')}  
                            onChange={handleInputChange}
                            displayEmpty
                            className="newProductInput"
                            onBlur={handleBlur}
                        >
                            <MenuItem value="" disabled hidden>
                                Wybierz tworzywo
                            </MenuItem>
                            {materials.map((material) => (
                                <MenuItem key={material} value={DOMPurify.sanitize(material)}>
                                    {DOMPurify.sanitize(material)}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.material && <span className="errorMessage">{errors.material}</span>}
                    </div>
                    <div className="newProductItem">
                        <label>Kolor</label>
                        <div className="colorOptions">
                            {colors.map((color) => (
                                <div key={color} className="colorOption">
                                    <input
                                        type="checkbox"
                                        name="color"
                                        value={DOMPurify.sanitize(color)}
                                        checked={productData.color.includes(color)}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label>{DOMPurify.sanitize(color)}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {productData.subcategory === 'Szkła ochronne' && (
                <div className="newProductItem">
                    <label>Rozmiar ekranu (w calach)</label>
                    <Select
                        name="screenSize"
                        value={DOMPurify.sanitize(productData.screenSize || '')} 
                        onChange={handleInputChange}
                        displayEmpty
                        className="newProductInput"
                        onBlur={handleBlur}
                    >
                        <MenuItem value="" disabled hidden>
                            Wybierz rozmiar ekranu
                        </MenuItem>
                        {screenSizeOptions.map((size) => (
                            <MenuItem key={size} value={DOMPurify.sanitize(size)}>
                                {DOMPurify.sanitize(size)}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.screenSize && <span className="errorMessage">{errors.screenSize}</span>}
                </div>
            )}

            {productData.subcategory === 'Ładowarki' && (
                <div className="newProductItem">
                    <label>Typ wejścia</label>
                    <Select
                        name="chargerType"
                        value={DOMPurify.sanitize(productData.chargerType || '')}  
                        onChange={handleInputChange}
                        displayEmpty
                        className="newProductInput"
                        onBlur={handleBlur}
                    >
                        <MenuItem value="" disabled hidden>
                            Wybierz typ wejścia
                        </MenuItem>
                        {chargerTypes.map((type) => (
                            <MenuItem key={type} value={DOMPurify.sanitize(type)}>
                                {DOMPurify.sanitize(type)}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.chargerType && <span className="errorMessage">{errors.chargerType}</span>}
                </div>
            )}

            {productData.subcategory === 'Słuchawki' && (
                <>
                    <div className="newProductItem">
                        <label>Typ słuchawek</label>
                        <div className="radioOptions">
                            {types.map((type) => (
                                <div key={type} className="radioOption">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={DOMPurify.sanitize(type)}  
                                        checked={productData.type === type}
                                        onChange={handleInputChange}
                                    />
                                    <label>{DOMPurify.sanitize(type)}</label>
                                </div>
                            ))}
                        </div>
                        {errors && !productData.type && <span className="errorMessage">Typ słuchawek jest wymagany</span>}
                    </div>
                    <div className="newProductItem">
                        <label>Kolor</label>
                        <div className="colorOptions">
                            {colors.map((color) => (
                                <div key={color} className="colorOption">
                                    <input
                                        type="checkbox"
                                        name="color"
                                        value={DOMPurify.sanitize(color)} 
                                        checked={productData.color.includes(color)}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label>{DOMPurify.sanitize(color)}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {productData.subcategory === 'Powerbanki' && (
                <div className="newProductItem">
                    <label>Pojemność (w mAh)</label>
                    <Select
                        name="battery"
                        value={DOMPurify.sanitize(productData.battery || '')} 
                        onChange={handleInputChange}
                        displayEmpty
                        className="newProductInput"
                        onBlur={handleBlur}
                    >
                        <MenuItem value="" disabled hidden>
                            Wybierz pojemność
                        </MenuItem>
                        {batteryOptions.map((battery) => (
                            <MenuItem key={battery} value={DOMPurify.sanitize(battery)}>
                                {DOMPurify.sanitize(battery)}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.battery && <span className="errorMessage">{errors.battery}</span>}
                </div>
            )}
        </>
    );
};

export default AccessoriesFields;
