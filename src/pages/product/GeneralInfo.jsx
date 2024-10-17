import React from 'react';
import { Select, MenuItem } from '@mui/material';
import DOMPurify from 'dompurify';

const GeneralInfo = ({ productData, handleInputChange, errors, categories, handleBlur }) => {
    return (
        <>
            <div className="newProductItem">
                <label>Nazwa</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Nazwa produktu"
                    value={DOMPurify.sanitize(productData.name || '')}  
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="newProductItem">
                <label>Kategoria</label>
                <Select
                    name="category"
                    value={DOMPurify.sanitize(productData.category || '')}  
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    displayEmpty
                    className="newProductInput"
                >
                    <MenuItem value="" disabled hidden>
                        Wybierz kategorię
                    </MenuItem>
                    {Object.keys(categories).map((cat) => (
                        <MenuItem key={cat} value={DOMPurify.sanitize(cat)}> 
                            {DOMPurify.sanitize(cat)}
                        </MenuItem>
                    ))}
                </Select>
                {errors.category && <span className="error">{errors.category}</span>}
            </div>

            {productData.category && (
                <div className="newProductItem">
                    <label>Podkategoria</label>
                    <Select
                        name="subcategory"
                        value={DOMPurify.sanitize(productData.subcategory || '')}  
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        displayEmpty
                        className="newProductInput"
                    >
                        <MenuItem value="" disabled hidden>
                            Wybierz podkategorię
                        </MenuItem>
                        {categories[productData.category]?.map((subcat) => (
                            <MenuItem key={subcat} value={DOMPurify.sanitize(subcat)}>  
                                {DOMPurify.sanitize(subcat)}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.subcategory && <span className="error">{errors.subcategory}</span>}
                </div>
            )}
        </>
    );
};

export default GeneralInfo;
