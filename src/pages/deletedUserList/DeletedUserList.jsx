import './deletedUserList.css';
import React, { useContext, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import UserContext from '../../components/context/UserContext';
import UserAccountPreviewModal from '../../components/userAccountPreviewModal/UserAccountPreviewModal';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DOMPurify from 'dompurify';

export default function DeletedUserList() {
  const { users, setUsers } = useContext(UserContext);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    if (location.state?.refresh) {
      axios.get(`${process.env.REACT_APP_API_URL}/users`, {
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
        <div className='entityListItem'>
          <img
            className='entityListImg'
            src={DOMPurify.sanitize(params.row.avatar ? `${process.env.REACT_APP_API_URL}${params.row.avatar}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg')}
            alt={DOMPurify.sanitize(params.row.userName)}
          />
          {DOMPurify.sanitize(params.row.userName)}
        </div>
      )
    },
    {
      field: 'email', headerName: 'Email',
      flex: 1,
      headerAlign: 'left', align: 'left',
      renderCell: (params) => (
        <span className="wrappedText">
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'phone', headerName: 'Telefon', flex: 1,
      renderCell: (params) => (
        <span className="wrappedText">
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'status', headerName: 'Status', flex: 0.5, renderCell: (params) => (
        <span className="wrappedText">
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'title', headerName: 'Stanowisko', flex: 0.7, renderCell: (params) => (
        <span className="wrappedText">
          {DOMPurify.sanitize(params.value.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)}
        </span>
      )
    },
    {
      field: 'action',
      headerName: '',
      width: 180,
      renderCell: (params) => (
        <span className="entityListPreview" onClick={() => handleOpenModal(params.row)}>
          <RemoveRedEyeOutlinedIcon className="entityListView" />
          <span className="iconText">Podgląd</span>
        </span>
      )
    },
  ];

  return (
    <div className='entityList'>
      <div className="entityTitleContainer">
        <h1 className="entityListTitle">Lista usuniętych pracowników</h1>
      </div>
      {users.filter(user => user.status === 'usunięty').length === 0 ? (
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
            <div className='dataGrid'>
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
      {selectedUser && (
        <UserAccountPreviewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
    </div>
  );
}
