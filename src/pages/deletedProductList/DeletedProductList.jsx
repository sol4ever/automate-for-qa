import React, { useContext, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import ProductContext from '../../components/context/ProductContext';
import ProductDetailsPreviewModal from '../../components/productDetailsPreviewModal/ProductDetailsPreviewModal';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DOMPurify from 'dompurify';

export default function DeletedProductList() {
  const { products, setProducts } = useContext(ProductContext);
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem('authToken');


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, [setProducts, token]);

  const handleSearchChange = (event) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setSearchText(sanitizedValue);
  };

  const filteredRows = products.filter(product =>
    product.status === 'deleted' &&
    Object.values(product).some(value =>
      DOMPurify.sanitize(value.toString()).toLowerCase().includes(DOMPurify.sanitize(searchText.toLowerCase()))
    )
  );

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, headerAlign: 'left', align: 'left' },
    {
      field: 'name', headerName: 'Produkt', flex: 1.5,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div className='entityListItem'>
          <img
            className='entityListImg'
            src={DOMPurify.sanitize(params.row.img ? `${process.env.REACT_APP_API_URL}${params.row.img}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg')}
            alt={DOMPurify.sanitize(params.row.name)}
          />
          {DOMPurify.sanitize(params.row.name)}
        </div>
      )
    },
    { field: 'category', headerName: 'Kategoria', flex: 0.7, headerAlign: 'left', align: 'left', renderCell: (params) => <span>{DOMPurify.sanitize(params.value)}</span> },
    { field: 'brand', headerName: 'Producent', flex: 1, headerAlign: 'left', align: 'left', renderCell: (params) => <span>{DOMPurify.sanitize(params.value)}</span> },
    { field: 'price', headerName: 'Cena', flex: 0.5, headerAlign: 'left', align: 'centre', renderCell: (params) => <span>{DOMPurify.sanitize(params.value)}</span> },
    {
      field: 'action',
      headerName: '',
      flex: 0.7,
      renderCell: (params) => (
        <span className="entityListPreview" onClick={() => handleOpenModal(params.row)}>
          <RemoveRedEyeOutlinedIcon className="entityListView" />
          <span className="iconText">Podgląd</span>
        </span>
      )
    },
  ];

  return (
    <div className="entityList">
      <div className="entityTitleContainer">
        <h1 className="entityListTitle">Lista usuniętych produktów</h1>
      </div>

      {products.filter(product => product.status === 'deleted').length === 0 ? (
        <p>Brak danych do wyświetlenia.</p>
      ) : (
        <>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Szukaj..."
              value={searchText}
              onChange={handleSearchChange}
              className="searchInput"
            />
          </div>
          {filteredRows.length === 0 && searchText ? (
            <p>Brak wyników wyszukiwania dla wprowadzonych danych.</p>
          ) : (
            <div className="dataGrid">
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={5}
                autoHeight
                getRowHeight={() => 'auto'}
                sx={{
                  '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '10px' },
                  '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '20px' },
                  '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '10px' },
                }}
                disableSelectionOnClick
                disableDensitySelector
                columnBuffer={2}
                columnThreshold={3}
                components={{
                  Pagination: () => null,
                }}
              />
            </div>
          )}
        </>
      )}
      {selectedProduct && (
        <ProductDetailsPreviewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
