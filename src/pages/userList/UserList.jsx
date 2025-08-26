import './userList.css';
import React, { useContext, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../components/context/UserContext';
import axios from '../../utils/axiosConfig';
import DeleteConfirmationModal from '../../components/deleteConfirmationModal/DeleteConfirmationModal';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Notification from '../../components/notification/Notification';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';

export default function UserList() {

  const { users, setUsers } = useContext(UserContext);
  const [searchText, setSearchText] = useState('');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    axios.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error("There was an error fetching the users!", error));
  }, [setUsers, token]);

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

  const filteredRows = users.filter(user =>
    user.status !== 'usunięty' &&
    Object.values(user).some(value =>
      DOMPurify.sanitize(value.toString()).toLowerCase().includes(DOMPurify.sanitize(searchText.toLowerCase()))
    )
  );

  const handleDelete = () => {
    axios.put(`/users/${selectedUserId}`, { status: 'usunięty' }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(users.map(user => user.id === selectedUserId ? { ...user, status: 'usunięty' } : user));
        setAlert({ severity: 'success', message: 'Pracownik został usunięty!' });
        setModalOpen(false);
      })
      .catch(error => {
        console.error("There was an error deleting the user!", error);
        setAlert({ severity: 'error', message: 'Nie udało się usunąć pracownika!' });
      });
  };


  const handleOpenDeleteModal = (id) => {
    setSelectedUserId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const columns = [
    {
      field: 'user',
      headerName: 'Pracownik',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div className='entityListItem' data-testid={`entityListItem-${params.row.id}`}>
          <img
            className='entityListImg'
            src={params.row.avatar ? params.row.avatar : noImage}
            alt={DOMPurify.sanitize(params.row.userName)}
          />
          {DOMPurify.sanitize(params.row.userName)}
        </div>
      )
    },
    {
      field: 'email', 
      headerName: 'Email',
      flex: 1,
      headerAlign: 'left', 
      align: 'left',
      renderCell: (params) => (
        <span className="wrappedText" data-testid={`email-${params.row.id}`}>
          {params.value.length > 100 ? `${DOMPurify.sanitize(params.value.slice(0, 100))}...` : DOMPurify.sanitize(params.value)}
        </span>
      )
    },
    {
      field: 'phone', 
      headerName: 'Telefon',
      flex: 1,
      headerAlign: 'left', 
      align: 'left',
      renderCell: (params) => (
        <span className="wrappedText" data-testid={`phone-${params.row.id}`}>
          {params.value.length > 100 ? `${DOMPurify.sanitize(params.value.slice(0, 100))}...` : DOMPurify.sanitize(params.value)}
        </span>
      )
    },
    {
      field: 'status', 
      headerName: 'Status',
      flex: 0.5,
      headerAlign: 'left', 
      align: 'left',
      renderCell: (params) => (
        <span className="wrappedText" data-testid={`status-${params.row.id}`}>
          {params.value.length > 100 ? `${DOMPurify.sanitize(params.value.slice(0, 100))}...` : DOMPurify.sanitize(params.value)}
        </span>
      )
    },
    {
      field: 'title', 
      headerName: 'Stanowisko',
      flex: 0.7,
      headerAlign: 'left', 
      align: 'left',
      renderCell: (params) => (
        <span className="wrappedText" data-testid={`title-${params.row.id}`}>
          {params.value.length > 100 ? `${DOMPurify.sanitize(params.value.slice(0, 100))}...` : DOMPurify.sanitize(params.value)}
        </span>
      )
    },
    {
      field: 'action',
      headerName: '',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className='entityListActions'>
          <EditNoteOutlinedIcon className='entityListEdit' data-testid={`editUser-${params.row.id}`} onClick={() => navigate(`/users-landing/edit/${params.row.id}`)}></EditNoteOutlinedIcon>
          <DeleteOutlineOutlinedIcon className='entityListDelete' data-testid={`deleteUser-${params.row.id}`} onClick={() => handleOpenDeleteModal(params.row.id)}></DeleteOutlineOutlinedIcon>
        </div>
      )
    },
  ];

  return (
    <div className='entityList'>
      <div className="entityTitleContainer">
        <h1 className="entityListTitle">Lista pracowników</h1>
        <button className="addButtonList" data-testid="addNewUserButton" onClick={() => navigate('/users-landing/new')}>
          <PersonAddAlt1Icon />
          Dodaj nowego
        </button>
      </div>
      {users.filter(user => user.status !== 'usunięty').length === 0 ? (
        <p data-testid="noDataMessage">Brak danych do wyświetlenia. Dodaj nowego pracownika aby wyświetlić dane.</p>
      ) : (
        <>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Szukaj..."
              value={searchText}
              onChange={handleSearchChange}
              className="searchInput"
              data-testid="searchInput"
            />
          </div>

          {filteredRows.length === 0 && searchText ? (
            <p data-testid="noSearchResultsMessage">Brak wyników wyszukiwania dla wprowadzonych danych.</p>
          ) : (
            <div className='dataGrid'>
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
                data-testid="dataGrid"
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
        title="Zamierzasz usunąć pracownika!"
        message="Czy na pewno chcesz usunąć pracownika?"
        data-testid="deleteConfirmationModal"
      />
    </div>
  );

}
