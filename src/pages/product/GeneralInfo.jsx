import React from 'react';
import { Select, MenuItem } from '@mui/material';
import DOMPurify from 'dompurify';

const GeneralInfo = ({ productData, handleInputChange, errors, categories, handleBlur }) => {
    return (
        <>
            <div className="newProductItem">
                <label data-testid="label-name">Nazwa</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Nazwa produktu"
                    value={DOMPurify.sanitize(productData.name || '')}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    data-testid="input-name"
                />
                {errors.name && <span className="error" data-testid="error-name">{errors.name}</span>}
            </div>

            <div className="newProductItem">
                <label data-testid="label-category">Kategoria</label>
                <Select
                    name="category"
                    value={DOMPurify.sanitize(productData.category || '')}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    displayEmpty
                    className="newProductInput"
                    data-testid="select-category"
                >
                    <MenuItem value="" disabled hidden data-testid="category-placeholder">
                        Wybierz kategorię
                    </MenuItem>
                    {Object.keys(categories).map((cat) => (
                        <MenuItem key={cat} value={DOMPurify.sanitize(cat)} data-testid={`category-option-${cat}`}>
                            {DOMPurify.sanitize(cat)}
                        </MenuItem>
                    ))}
                </Select>
                {errors.category && <span className="error" data-testid="error-category">{errors.category}</span>}
            </div>

            {productData.category && (
                <div className="newProductItem">
                    <label data-testid="label-subcategory">Podkategoria</label>
                    <Select
                        name="subcategory"
                        value={DOMPurify.sanitize(productData.subcategory || '')}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        displayEmpty
                        className="newProductInput"
                        data-testid="select-subcategory"
                    >
                        <MenuItem value="" disabled hidden data-testid="subcategory-placeholder">
                            Wybierz podkategorię
                        </MenuItem>
                        {categories[productData.category]?.map((subcat) => (
                            <MenuItem key={subcat} value={DOMPurify.sanitize(subcat)} data-testid={`subcategory-option-${subcat}`}>
                                {DOMPurify.sanitize(subcat)}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.subcategory && <span className="error" data-testid="error-subcategory">{errors.subcategory}</span>}
                </div>
            )}
        </>
    );
};

export default GeneralInfo;
