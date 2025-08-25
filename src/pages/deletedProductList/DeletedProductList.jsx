import React, { useContext, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from '../../utils/axiosConfig';
import ProductContext from '../../components/context/ProductContext';
import ProductDetailsPreviewModal from '../../components/productDetailsPreviewModal/ProductDetailsPreviewModal';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';

export default function DeletedProductList() {
  const { products, setProducts } = useContext(ProductContext);
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem('authToken');


  useEffect(() => {
    axios.get('/api/products', {
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
    { field: 'id', headerName: 'ID', flex: 0.3, headerAlign: 'left', align: 'left', renderCell: (params) => <span data-testid={`product-id-${params.row.id}`}>{params.value}</span> },
    {
      field: 'name',
      headerName: 'Produkt',
      flex: 1.5,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div className='entityListItem' data-testid={`product-item-${params.row.id}`}>
          <img
            className='entityListImg'
            src={params.row.img ? params.row.img : noImage}
            alt={DOMPurify.sanitize(params.row.name)}
            data-testid={`product-img-${params.row.id}`}
          />
          <span data-testid={`product-name-${params.row.id}`}>{DOMPurify.sanitize(params.row.name)}</span>
        </div>
      )
    },
    {
      field: 'category',
      headerName: 'Kategoria',
      flex: 0.7,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <span data-testid={`product-category-${params.row.id}`}>{DOMPurify.sanitize(params.value)}</span>
      )
    },
    {
      field: 'brand',
      headerName: 'Producent',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <span data-testid={`product-brand-${params.row.id}`}>{DOMPurify.sanitize(params.value)}</span>
      )
    },
    {
      field: 'price',
      headerName: 'Cena',
      flex: 0.5,
      headerAlign: 'left',
      align: 'center',
      renderCell: (params) => (
        <span data-testid={`product-price-${params.row.id}`}>{DOMPurify.sanitize(params.value)}</span>
      )
    },
    {
      field: 'action',
      headerName: '',
      flex: 0.7,
      renderCell: (params) => (
        <span
          className="entityListPreview"
          onClick={() => handleOpenModal(params.row)}
          data-testid={`product-preview-${params.row.id}`}
        >
          <RemoveRedEyeOutlinedIcon className="entityListView" />
          <span className="iconText">Podgląd</span>
        </span>
      )
    },
  ];

  return (
    <div className="entityList" data-testid="deleted-products-list">
      <div className="entityTitleContainer">
        <h1 className="entityListTitle" data-testid="list-title">Lista usuniętych produktów</h1>
      </div>

      {products.filter(product => product.status === 'deleted').length === 0 ? (
        <p data-testid="no-data-message">Brak danych do wyświetlenia.</p>
      ) : (
        <>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Szukaj..."
              value={searchText}
              onChange={handleSearchChange}
              className="searchInput"
              data-testid="search-input"
            />
          </div>
          {filteredRows.length === 0 && searchText ? (
            <p data-testid="no-search-results-message">Brak wyników wyszukiwania dla wprowadzonych danych.</p>
          ) : (
            <div className="dataGrid" data-testid="data-grid">
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
                data-testid="data-grid-content"
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
          data-testid="product-preview-modal"
        />
      )}
    </div>
  );

}
