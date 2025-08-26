import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import ProductContext from '../../components/context/ProductContext';
import Notification from '../../components/notification/Notification';
import DeleteConfirmationModal from '../../components/deleteConfirmationModal/DeleteConfirmationModal';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';

export default function ProductList() {
  const { products, setProducts } = useContext(ProductContext);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    axios.get('/products', {
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
    // console.log('Deleting product with ID:', productIdAsString);

    const payload = { status: 'deleted' };
    // console.log('Payload:', payload);

    axios.put(`/products/${productIdAsString}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      // console.log('Product deleted successfully:', response.data);
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
      field: 'product',
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
      align: 'left',
      renderCell: (params) => (
        <span data-testid={`product-price-${params.row.id}`}>{DOMPurify.sanitize(params.value)}</span>
      )
    },
    {
      field: 'inStock',
      headerName: 'Dostępny',
      flex: 0.5,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <span data-testid={`product-inStock-${params.row.id}`}>{DOMPurify.sanitize(params.row.inStock === 'yes' ? 'Tak' : 'Nie')}</span>
      ),
    },
    {
      field: 'promoted',
      headerName: 'Promowany',
      flex: 0.5,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <span data-testid={`product-promoted-${params.row.id}`}>{DOMPurify.sanitize(params.row.promoted ? 'Tak' : 'Nie')}</span>
      ),
    },
    {
      field: 'action',
      headerName: '',
      flex: 0.7,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div className='entityListActions' data-testid={`product-actions-${params.row.id}`}>
          <EditNoteOutlinedIcon
            className='entityListEdit'
            onClick={() => navigate(`/products-landing/edit/${params.row.id}`)}
            data-testid={`edit-button-${params.row.id}`}
          />
          <DeleteOutlineOutlinedIcon
            className='entityListDelete'
            onClick={() => handleOpenDeleteModal(params.row.id)}
            data-testid={`delete-button-${params.row.id}`}
          />
        </div>
      )
    },
  ];


  return (
    <div className='entityList'>
      <div className="entityTitleContainer">
        <h1 className="entityListTitle" data-testid="entity-list-title">Lista produktów</h1>
        <button
          className="addButtonList"
          onClick={() => navigate('/products-landing/new')}
          data-testid="add-new-button"
        >
          <AddCircleOutlineOutlinedIcon />
          Dodaj nowy
        </button>
      </div>
      {products.filter(row => row.status !== 'deleted').length === 0 ? (
        <p data-testid="no-data-message">Brak danych do wyświetlenia. Dodaj nowy produkt aby wyświetlić dane.</p>
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
                data-testid="product-data-grid"
              />
            </div>
          )}
        </>
      )}
      <Notification alert={alert} data-testid="notification" />
      <DeleteConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Zamierzasz usunąć produkt!"
        message="Czy na pewno chcesz usunąć produkt?"
        data-testid="delete-confirmation-modal"
      />
    </div>
  );

}
