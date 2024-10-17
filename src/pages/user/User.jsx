import './user.css';
import { CalendarToday, LocationSearching, MailOutline, PermIdentity, PhoneAndroid } from '@mui/icons-material';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Rating from '@mui/material/Rating';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { validateUserForm } from '../../utils/validation';
import UserContext from '../../components/context/UserContext';
import ImageUploadModal from '../../components/imageUploadModal/ImageUploadModal';
import DeleteConfirmationModal from '../../components/deleteConfirmationModal/DeleteConfirmationModal';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import Notification from '../../components/notification/Notification';
import DOMPurify from 'dompurify';



const statusColors = {
  aktywny: '#185905',
  nieaktywny: '#F2811D',
  zawieszony: '#EEE0d7',
  usunięty: 'black'
};

export default function User() {
  const { users, setUsers } = useContext(UserContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem('authToken');


  useEffect(() => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setUserData(user);
      setFormData(user);
    } else {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((response) => {
          setUserData(response.data);
          setFormData(response.data);
        })
        .catch((error) => console.error('There was an error fetching the user!', error));
    }
  }, [userId, users, token]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleDateChange = (date) => {
    const dob = date ? date.format('YYYY-MM-DD') : null;
    setFormData({ ...formData, dob });
    validateField('dob', dob);
  };

  const handleStatusChange = (status) => {
    setFormData({ ...formData, status });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  const validateField = (name, value) => {
    const { errors } = validateUserForm({ ...formData, [name]: value });
    setErrors(errors);
  };

  const handleUpdate = () => {
    const { valid, errors } = validateUserForm(formData);
    setErrors(errors);
  
    if (valid) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/users/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          const updatedUser = response.data;
          setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
          setUserData(updatedUser);
          setFormData(updatedUser);
          setAlert({ severity: 'success', message: 'Dane pracownika zmienione!' });
        })
        .catch((error) => {
          if (error.response && error.response.data.errors) {
            // Get the first error from the backend response
            const firstErrorKey = Object.keys(error.response.data.errors)[0];
            const firstErrorMessage = error.response.data.errors[firstErrorKey];
            setAlert({ severity: 'error', message: firstErrorMessage });
          } else {
            setAlert({ severity: 'error', message: 'Nie udało się zmienić danych pracownika!' });
          }
        });
    } else {
      // Display the first validation error on the frontend if the form is invalid
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstErrorKey];
      setAlert({ severity: 'error', message: firstErrorMessage });
    }
  };
  
  


  const handleImageSelect = (imagePath) => {
    setFormData({ ...formData, avatar: `/images/users/${imagePath}` });
  };

  const handleDelete = () => {
    if (!selectedUserId) {
      setAlert({ severity: 'error', message: 'Nie można usunąć pracownika: brak ID użytkownika' });
      return;
    }
  
    axios.put(`${process.env.REACT_APP_API_URL}/users/${selectedUserId}`, { status: 'usunięty' }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(users.map(user => user.id === selectedUserId ? { ...user, status: 'usunięty' } : user));
        setAlert({ severity: 'success', message: 'Pracownik został usunięty!' });
  
        setTimeout(() => {
          navigate('/users-landing/deleted', { state: { refresh: true } });
        }, 2000);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessage = Object.values(errors).join(', ');
          setAlert({ severity: 'error', message: `Błąd usuwania pracownika: ${errorMessage}` });
        } else {
          setAlert({ severity: 'error', message: 'Nie udało się usunąć pracownika!' });
        }
      });
  };
  


  const handleOpenDeleteModal = () => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Szczegóły konta</h1>
        <div>
          <button className="backButton" onClick={() => navigate('/users-landing/list')}>
            &laquo; Powrót do listy
          </button>
        </div>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={userData.avatar ? `${process.env.REACT_APP_API_URL}${userData.avatar}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              {userData.status && (
                <button className="modalDeletedLabel"
                  style={{
                    backgroundColor: statusColors[userData.status] || 'gray',
                    color: userData.status === 'zawieszony' ? 'black' : 'white',
                  }}
                >{userData.status}</button>
              )}
              <span className="userShowUserName">{DOMPurify.sanitize(userData.userName)}</span>
              <span className="userShowUserTitle">{DOMPurify.sanitize(userData.title)}</span>
              <Rating
                name="read-only"
                value={DOMPurify.sanitize(userData.rating || 0)}
                readOnly
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#F2811D',
                  },
                }}
              />
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Pracownik</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">
                {DOMPurify.sanitize(userData.userName)}
              </span>
            </div>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">
                {DOMPurify.sanitize(userData.fullName)}
              </span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowInfoTitle">
                {DOMPurify.sanitize(userData.dob)}
              </span>
            </div>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">
                {DOMPurify.sanitize(userData.gender)}
              </span>
            </div>
            <span className="userShowTitle">Dane kontaktowe</span>
            <div className="userShowInfo">
              <PhoneAndroid className="userShowIcon" />
              <span className="userShowInfoTitle">
                {DOMPurify.sanitize(userData.phone)}
              </span>
            </div>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">
                {DOMPurify.sanitize(userData.email)}
              </span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">
                {DOMPurify.sanitize(userData.address)}
              </span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edytuj dane</span>
          <form className="userUpdateForm" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Nazwa pracownika</label>
                <input
                  type="text"
                  name="userName"
                  value={DOMPurify.sanitize(formData.userName || '')}
                  placeholder='Nazwa pracownika'
                  onChange={handleInputChange}
                  onBlur={() => validateField('userName', formData.userName)}
                  className="userUpdateInput"
                />
                {errors.userName && <span className="error">{errors.userName}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Pełna nazwa pracownika</label>
                <input
                  type="text"
                  name="fullName"
                  value={DOMPurify.sanitize(formData.fullName || '')}
                  placeholder='Imię Nazwisko'
                  onChange={handleInputChange}
                  onBlur={() => validateField('fullName', formData.fullName)}
                  className="userUpdateInput"
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={DOMPurify.sanitize(formData.email || '')}
                  placeholder='przykladowyemail@gmail.com'
                  onChange={handleInputChange}
                  onBlur={() => validateField('email', formData.email)}
                  className="userUpdateInput"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Telefon</label>
                <input
                  type="text"
                  name="phone"
                  value={DOMPurify.sanitize(formData.phone || '')}
                  placeholder='+48 11111111 '
                  onChange={handleInputChange}
                  onBlur={() => validateField('phone', formData.phone)}
                  className="userUpdateInput"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Adres</label>
                <input
                  type="text"
                  name="address"
                  value={DOMPurify.sanitize(formData.address || '')}
                  placeholder='Ulica, numer domu'
                  onChange={handleInputChange}
                  onBlur={() => validateField('address', formData.address)}
                  className="userUpdateInput"
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
              <div className="userUpdateItem" data-testid='dateOfBirth'>
                <label>Data urodzenia</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      value={formData.dob ? dayjs(formData.dob) : null}
                      onChange={handleDateChange}
                      renderInput={(params) => <input {...params} className="userUpdateInput DatePickerInput" />}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {errors.dob && <span className="error">{errors.dob}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Płeć</label>
                <Select
                  name="gender"
                  value={DOMPurify.sanitize(formData.gender || '')}
                  onChange={handleInputChange}
                  onBlur={() => validateField('gender', formData.gender)}
                  className="userUpdateInput"
                  displayEmpty
                >
                  <MenuItem value={DOMPurify.sanitize()} disabled hidden>
                    Wybierz
                  </MenuItem>
                  <MenuItem value="Kobieta">Kobieta</MenuItem>
                  <MenuItem value="Mężczyzna">Mężczyzna</MenuItem>
                  <MenuItem value="Inna">Inne</MenuItem>
                  <MenuItem value="Nie podano">Nie podano</MenuItem>
                </Select>
                {errors.gender && <span className="error">{errors.gender}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Stanowisko</label>
                <div className="userUpdateTitleOptions">
                  {['Software Tester', 'Frontend Developer', 'Backend Developer', 'Business Analyst', 'Chapter Lead', 'Product Owner', 'Fullstack Developer', 'UX Designer'].map((title) => (
                    <label key={title} className="radioLabel">
                      <input
                        type="radio"
                        name="title"
                        value={DOMPurify.sanitize(title)}
                        checked={formData.title === title}
                        onChange={handleInputChange}
                        className="customRadio"
                      />
                      {title}
                    </label>
                  ))}
                </div>
              </div>
              <div className="userUpdateItem">
                <label>Rating</label>
                <Rating
                  name="simple-controlled"
                  value={DOMPurify.sanitize(formData.rating || 0)}
                  onChange={handleRatingChange}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#F2811D',
                    },
                  }}
                />
              </div>
              <div className="userUpdateItem">
                <label>Status</label>
                <ButtonGroup variant="contained" aria-label="contained button group" className="statusButtonGroup">
                  <Button className="statusButton" onClick={() => handleStatusChange('aktywny')}>Aktywny</Button>
                  <Button className="statusButton" onClick={() => handleStatusChange('nieaktywny')}>Nieaktywny</Button>
                  <Button className="statusButton" onClick={() => handleStatusChange('zawieszony')}>Zawieszony</Button>
                </ButtonGroup>
              </div>
            </div>
            <div className="userRight">
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    src={formData.avatar ? `${process.env.REACT_APP_API_URL}${formData.avatar}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}
                    alt=""
                    className="userUpdateImg"
                    onClick={() => setModalOpen(true)}
                  />
                  <label className="uploadLabel" onClick={() => setModalOpen(true)}>
                    <PhotoCameraOutlinedIcon data-testid='cameraIcon' />
                    Zmień obraz
                  </label>
                </div>
                <ButtonGroup variant="contained" aria-label="contained button group" className="decisionButtonGroup">
                  <button className="deleteButtonEditForm" type='button' onClick={handleOpenDeleteModal}>Usuń</button>
                  <button type="submit" className="submitButtonEditForm">Zapisz</button>
                </ButtonGroup>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Notification alert={alert} />
      <ImageUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleImageSelect}
        imageType="users"
      />
      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Zamierzasz usunąć pracownika!"
        message="Czy na pewno chcesz usunąć pracownika?"
      />
    </div>
  );
}
