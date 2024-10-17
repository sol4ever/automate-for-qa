import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductContext from '../../components/context/ProductContext';
import Notification from '../../components/notification/Notification';
import DeleteConfirmationModal from '../../components/deleteConfirmationModal/DeleteConfirmationModal';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DOMPurify from 'dompurify';

export default function ProductList() {
  const { products, setProducts } = useContext(ProductContext);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setProducts(response.data);
    })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, [setProducts, token]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSearchChange = (event) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setSearchText(sanitizedValue);
  };

  const filteredRows = products.filter(row =>
    row.status !== 'deleted' &&
    Object.values(row).some(value =>
      DOMPurify.sanitize(value.toString()).toLowerCase().includes(DOMPurify.sanitize(searchText.toLowerCase()))
    )
  );

  const handleDelete = () => {
    const productIdAsString = selectedProductId.toString();
    console.log('Deleting product with ID:', productIdAsString);
    
    const payload = { status: 'deleted' };
    console.log('Payload:', payload);
  
    axios.put(`${process.env.REACT_APP_API_URL}/products/${productIdAsString}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      console.log('Product deleted successfully:', response.data);
      setProducts(products.map(product => product.id === productIdAsString ? { ...product, status: 'deleted' } : product));
      setAlert({ severity: 'success', message: 'Produkt został usunięty!' });
      setModalOpen(false);
    }).catch(error => {
      console.error('There was an error deleting the product!', error.response?.data || error.message);
      setAlert({ severity: 'error', message: 'Nie udało się usunąć produktu!' });
    });
  };
  
  

  const handleOpenDeleteModal = (id) => {
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, headerAlign: 'left', align: 'left' },
    {
      field: 'product', headerName: 'Produkt', flex: 1.5, headerAlign: 'left',
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
    {
      field: 'category', headerName: 'Kategoria', flex: 0.7, headerAlign: 'left', align: 'left',
      renderCell: (params) => (
        <span>{DOMPurify.sanitize(params.value)}</span>
      )
    },
    {
      field: 'brand', headerName: 'Producent', flex: 1, headerAlign: 'left', align: 'left',
      renderCell: (params) => (
        <span>{DOMPurify.sanitize(params.value)}</span>
      )
    },
    {
      field: 'price', headerName: 'Cena', flex: 0.5, headerAlign: 'left', align: 'left',
      renderCell: (params) => (
        <span>{DOMPurify.sanitize(params.value)}</span>
      )
    },
    {
      field: 'inStock', headerName: 'Dostępny', flex: 0.5, headerAlign: 'left', align: 'left',
      renderCell: (params) => (
        <span>{DOMPurify.sanitize(params.row.inStock === 'yes' ? 'Tak' : 'Nie')}</span>
      ),
    },
    {
      field: 'promoted',
      headerName: 'Promowany',
      flex: 0.5,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <span>{DOMPurify.sanitize(params.row.promoted ? 'Tak' : 'Nie')}</span>
      ),
    },
    {
      field: 'action', headerName: '', flex: 0.7, headerAlign: 'left', align: 'left',
      renderCell: (params) => (
        <div className='entityListActions'>
          <EditNoteOutlinedIcon className='entityListEdit' onClick={() => navigate(`/products-landing/edit/${params.row.id}`)}></EditNoteOutlinedIcon>
          <DeleteOutlineOutlinedIcon className='entityListDelete' onClick={() => handleOpenDeleteModal(params.row.id)}></DeleteOutlineOutlinedIcon>
        </div>
      )
    },
  ];

  return (
    <div className='entityList'>
      <div className="entityTitleContainer">
        <h1 className="entityListTitle">Lista produktów</h1>
        <button className="addButtonList" onClick={() => navigate('/products-landing/new')}>
          <AddCircleOutlineOutlinedIcon />
          Dodaj nowy
        </button>
      </div>
      {products.filter(row => row.status !== 'deleted').length === 0 ? (
        <p>Brak danych do wyświetlenia. Dodaj nowy produkt aby wyświetlić dane.</p>
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
      <Notification alert={alert} />
      <DeleteConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Zamierzasz usunąć produkt!"
        message="Czy na pewno chcesz usunąć produkt?"
      />
    </div>
  );
}
