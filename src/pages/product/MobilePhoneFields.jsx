import React, { useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import { validateProductForm } from '../../utils/validation';
import DOMPurify from 'dompurify';

const MobilePhoneFields = ({ productData, handleInputChange }) => {
    const storageOptions = ['32 GB', '64 GB', '128 GB', '256 GB'];
    const ramOptions = ['2 GB', '4 GB', '6 GB', '8 GB'];
    const batteryOptions = ['3000 mAh', '4000 mAh', '5000 mAh'];
    const screenSizeOptions = ['5.5"', '6.1"', '6.5"'];
    const colors = ['czarny', 'biały', 'niebieski', 'czerwony', 'bezbarwny'];
    const smartphones = ['Apple', 'Samsung', 'Huawei', 'Xiaomi'];
    const featurephones = ['Nokia'];

    const osOptions = {
        Samsung: ['Android 13', 'Android 14', 'Android 15'],
        Apple: ['iOS 16', 'iOS 17', 'iOS 18'],
        Xiaomi: ['Android 12', 'Android 13', 'Android 14'],
        Huawei: ['Android 12', 'Android 13', 'Android 14', 'Android 15'],
        Nokia: ['AliOS', 'Nokia Series 30+', 'inny'],
    };

    let availableBrands = [];
    if (productData.subcategory === 'Smartfony') {
        availableBrands = smartphones;
    } else if (productData.subcategory === 'Feature Phones') {
        availableBrands = featurephones;
    }

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
                <label data-testid="label-brand">Producent</label>
                <Select
                    name="brand"
                    value={DOMPurify.sanitize(productData.brand)}
                    onChange={handleInputChange}
                    displayEmpty
                    className="newProductInput"
                    onBlur={handleBlur}
                    data-testid="select-brand"
                >
                    <MenuItem value="" disabled hidden data-testid="brand-placeholder">
                        Wybierz producenta
                    </MenuItem>
                    {availableBrands.map((brand) => (
                        <MenuItem key={brand} value={DOMPurify.sanitize(brand)} data-testid={`brand-option-${brand}`}>
                            {DOMPurify.sanitize(brand)}
                        </MenuItem>
                    ))}
                </Select>
                {errors.brand && <span className="errorMessage" data-testid="error-brand">{errors.brand}</span>}
            </div>

            {productData.brand && (
                <>
                    <div className="newProductItem">
                        <label data-testid="label-os">System operacyjny</label>
                        <Select
                            name="os"
                            value={DOMPurify.sanitize(productData.os)}
                            onChange={handleInputChange}
                            displayEmpty
                            className="newProductInput"
                            onBlur={handleBlur}
                            data-testid="select-os"
                        >
                            <MenuItem value="" disabled hidden data-testid="os-placeholder">
                                Wybierz system operacyjny
                            </MenuItem>
                            {osOptions[productData.brand]?.map((os) => (
                                <MenuItem key={os} value={DOMPurify.sanitize(os)} data-testid={`os-option-${os}`}>
                                    {DOMPurify.sanitize(os)}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.os && <span className="errorMessage" data-testid="error-os">{errors.os}</span>}
                    </div>

                    <div className="newProductItem">
                        <label data-testid="label-screenSize">Rozmiar ekranu (w calach)</label>
                        <Select
                            name="screenSize"
                            value={DOMPurify.sanitize(productData.screenSize)}
                            onChange={handleInputChange}
                            displayEmpty
                            className="newProductInput"
                            onBlur={handleBlur}
                            data-testid="select-screenSize"
                        >
                            <MenuItem value="" disabled hidden data-testid="screenSize-placeholder">
                                Wybierz rozmiar ekranu
                            </MenuItem>
                            {screenSizeOptions.map((size) => (
                                <MenuItem key={size} value={DOMPurify.sanitize(size)} data-testid={`screenSize-option-${size}`}>
                                    {DOMPurify.sanitize(size)}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.screenSize && <span className="errorMessage" data-testid="error-screenSize">{errors.screenSize}</span>}
                    </div>

                    <div className="newProductItem">
                        <label data-testid="label-storage">Pamięć wbudowana</label>
                        <Select
                            name="storage"
                            value={DOMPurify.sanitize(productData.storage)}
                            onChange={handleInputChange}
                            displayEmpty
                            className="newProductInput"
                            onBlur={handleBlur}
                            data-testid="select-storage"
                        >
                            <MenuItem value="" disabled hidden data-testid="storage-placeholder">
                                Wybierz pamięć wbudowaną
                            </MenuItem>
                            {storageOptions.map((storage) => (
                                <MenuItem key={storage} value={DOMPurify.sanitize(storage)} data-testid={`storage-option-${storage}`}>
                                    {DOMPurify.sanitize(storage)}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.storage && <span className="errorMessage" data-testid="error-storage">{errors.storage}</span>}
                    </div>

                    <div className="newProductItem">
                        <label data-testid="label-ram">RAM</label>
                        <Select
                            name="ram"
                            value={DOMPurify.sanitize(productData.ram)}
                            onChange={handleInputChange}
                            displayEmpty
                            className="newProductInput"
                            onBlur={handleBlur}
                            data-testid="select-ram"
                        >
                            <MenuItem value="" disabled hidden data-testid="ram-placeholder">
                                Wybierz RAM
                            </MenuItem>
                            {ramOptions.map((ram) => (
                                <MenuItem key={ram} value={DOMPurify.sanitize(ram)} data-testid={`ram-option-${ram}`}>
                                    {DOMPurify.sanitize(ram)}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.ram && <span className="errorMessage" data-testid="error-ram">{errors.ram}</span>}
                    </div>

                    <div className="newProductItem">
                        <label data-testid="label-battery">Pojemność baterii (w mAh)</label>
                        <Select
                            name="battery"
                            value={DOMPurify.sanitize(productData.battery)}
                            onChange={handleInputChange}
                            displayEmpty
                            className="newProductInput"
                            onBlur={handleBlur}
                            data-testid="select-battery"
                        >
                            <MenuItem value="" disabled hidden data-testid="battery-placeholder">
                                Wybierz pojemność baterii
                            </MenuItem>
                            {batteryOptions.map((battery) => (
                                <MenuItem key={battery} value={DOMPurify.sanitize(battery)} data-testid={`battery-option-${battery}`}>
                                    {DOMPurify.sanitize(battery)}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.battery && <span className="errorMessage" data-testid="error-battery">{errors.battery}</span>}
                    </div>

                    <div className="newProductItem">
                        <label data-testid="label-color">Kolor</label>
                        <div className="colorOptions" data-testid="color-options">
                            {colors.map((color) => (
                                <div key={color} className="colorOption">
                                    <input
                                        type="checkbox"
                                        name="color"
                                        value={DOMPurify.sanitize(color)}
                                        checked={productData.color.includes(color)}
                                        onChange={handleCheckboxChange}
                                        data-testid={`checkbox-color-${color}`}
                                    />
                                    <label data-testid={`label-color-${color}`}>{DOMPurify.sanitize(color)}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default MobilePhoneFields;
