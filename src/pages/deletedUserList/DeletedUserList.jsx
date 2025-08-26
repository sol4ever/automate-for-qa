import './deletedUserList.css';
import React, { useContext, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import UserContext from '../../components/context/UserContext';
import UserAccountPreviewModal from '../../components/userAccountPreviewModal/UserAccountPreviewModal';
import { useLocation } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';

export default function DeletedUserList() {
  const { users, setUsers } = useContext(UserContext);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    if (location.state?.refresh) {
      axios.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => setUsers(response.data))
        .catch(error => console.error('Error fetching users:', error));
    }
  }, [location, setUsers, token]);


  const filteredRows = users.filter(user =>
    user.status === 'usunięty' &&
    Object.values(user).some(value =>
      DOMPurify.sanitize(value.toString()).toLowerCase().includes(DOMPurify.sanitize(searchText.toLowerCase()))
    )
  );

  const handleSearchChange = (event) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setSearchText(sanitizedValue);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      field: 'user',
      headerName: 'Pracownik',
      flex: 1,
      renderCell: (params) => (
        <div className='entityListItem' data-testid={`user-item-${params.row.id}`}>
          <img
            className='entityListImg'
            src={params.row.avatar ? params.row.avatar : noImage}
            alt={DOMPurify.sanitize(params.row.userName)}
            data-testid={`user-avatar-${params.row.id}`}
          />
          <span data-testid={`user-name-${params.row.id}`}>{DOMPurify.sanitize(params.row.userName)}</span>
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
        <span className="wrappedText" data-testid={`user-email-${params.row.id}`}>
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'phone',
      headerName: 'Telefon',
      flex: 1,
      renderCell: (params) => (
        <span className="wrappedText" data-testid={`user-phone-${params.row.id}`}>
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      renderCell: (params) => (
        <span className="wrappedText" data-testid={`user-status-${params.row.id}`}>
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'title',
      headerName: 'Stanowisko',
      flex: 0.7,
      renderCell: (params) => (
        <span className="wrappedText" data-testid={`user-title-${params.row.id}`}>
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'action',
      headerName: '',
      width: 180,
      renderCell: (params) => (
        <span
          className="entityListPreview"
          onClick={() => handleOpenModal(params.row)}
          data-testid={`user-preview-${params.row.id}`}
        >
          <RemoveRedEyeOutlinedIcon className="entityListView" />
          <span className="iconText">Podgląd</span>
        </span>
      )
    },
  ];


  return (
    <div className='entityList' data-testid="deleted-users-list">
      <div className="entityTitleContainer">
        <h1 className="entityListTitle" data-testid="list-title">Lista usuniętych pracowników</h1>
      </div>
      {users.filter(user => user.status === 'usunięty').length === 0 ? (
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
            <div className='dataGrid' data-testid="data-grid">
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
      {selectedUser && (
        <UserAccountPreviewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
          data-testid="user-preview-modal"
        />
      )}
    </div>
  );
}
