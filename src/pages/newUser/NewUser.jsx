import './newUser.css';
import Switch from '@mui/material/Switch';
import { useState, useContext, useEffect } from 'react';
import { alpha, styled } from '@mui/material/styles';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../components/context/UserContext';
import { validateUserForm } from '../../utils/validation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import ImageUploadModal from '../../components/imageUploadModal/ImageUploadModal';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import ButtonGroup from '@mui/material/ButtonGroup';
import Notification from '../../components/notification/Notification';
import DOMPurify from 'dompurify';


const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#F29727',
        '&:hover': {
            backgroundColor: alpha('#F29727', theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#F29727',
    },
}));

export default function NewUser() {
    const navigate = useNavigate();
    const { users, setUsers } = useContext(UserContext);
    const [isActive, setIsActive] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
        title: '',
        status: 'nieaktywny',
        avatar: '',
    });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = sessionStorage.getItem('authToken');

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const handleToggle = () => {
        const newStatus = !isActive ? 'aktywny' : 'nieaktywny';
        setIsActive(!isActive);
        setFormData({ ...formData, status: newStatus });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleDateChange = (date) => {
        const dob = date ? date.format('YYYY-MM-DD') : null;
        setFormData({ ...formData, dob });
        validateField('dob', dob);
    };

    const validateField = (name, value) => {
        const { errors } = validateUserForm({ ...formData, [name]: value });
        setErrors(errors);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const { valid, errors } = validateUserForm(formData);
        setErrors(errors);
    
        if (valid) {
            axios.post(`${process.env.REACT_APP_API_URL}/users`, { ...formData, id: Date.now().toString() }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                setUsers([...users, response.data]);
                setAlert({ severity: 'success', message: 'Pracownik dodany!' });
                setTimeout(() => {
                    navigate('/users-landing/list');
                }, 2000);
            })
            .catch(error => {
                if (error.response && error.response.data.errors) {
                    const firstErrorKey = Object.keys(error.response.data.errors)[0];
                    const firstErrorMessage = error.response.data.errors[firstErrorKey];
                    setAlert({ severity: 'error', message: firstErrorMessage });
                } else {
                    console.error("There was an error creating the user!", error);
                    setAlert({ severity: 'error', message: 'Nie udało się dodać pracownika!' });
                }
            });
        } else {
            const firstErrorKey = Object.keys(errors)[0];
            const firstErrorMessage = errors[firstErrorKey];
            setAlert({ severity: 'error', message: firstErrorMessage });
        }
    };
    

    const handleImageSelect = (image) => {
        setFormData({ ...formData, avatar: `/images/users/${image}` });
    };

    return (
        <div className='newUser'>
            <div className="formContainer">
                <h1 className="newUserTitle">Nowy pracownik</h1>
                <form className="newUserForm" onSubmit={handleSubmit}>
                    <div className="newUserLeft">
                        <div className="newUserItem">
                            <label>Nazwa pracownika</label>
                            <input type='text'
                                placeholder='Nazwa'
                                name="userName"
                                value={DOMPurify.sanitize(formData.userName)}
                                onChange={handleChange}
                                onBlur={() => validateField('userName', formData.userName)}
                                data-testid="inputUserName"
                            />
                            {errors.userName && <span className="errorMessage">{errors.userName}</span>}
                        </div>
                        <div className="newUserItem">
                            <label>Pełna nazwa pracownika</label>
                            <input type='text'
                                placeholder='Imię Nazwisko'
                                name="fullName"
                                value={DOMPurify.sanitize(formData.fullName)}
                                onChange={handleChange}
                                onBlur={() => validateField('fullName', formData.fullName)}
                                data-testid="inputFullName"
                            />
                            {errors.fullName && <span className="errorMessage">{errors.fullName}</span>}
                        </div>
                        <div className="newUserItem">
                            <label>Email</label>
                            <input type='email'
                                placeholder='przykladowyemail@gmail.com'
                                name="email"
                                value={DOMPurify.sanitize(formData.email)}
                                onChange={handleChange}
                                onBlur={() => validateField('email', formData.email)}
                                data-testid="inputEmail"
                            />
                            {errors.email && <span className="errorMessage">{errors.email}</span>}
                        </div>
                        <div className="newUserItem">
                            <label>Telefon</label>
                            <input type='text'
                                placeholder='+48 11111111'
                                name="phone"
                                value={DOMPurify.sanitize(formData.phone)}
                                onChange={handleChange}
                                onBlur={() => validateField('phone', formData.phone)}
                                data-testid="inputPhone"
                            />
                            {errors.phone && <span className="errorMessage">{errors.phone}</span>}
                        </div>
                        <div className="newUserItem">
                            <label>Adres</label>
                            <input type='text'
                                placeholder='Ulica, numer domu'
                                name="address"
                                value={DOMPurify.sanitize(formData.address)}
                                onChange={handleChange}
                                onBlur={() => validateField('address', formData.address)}
                                data-testid="inputAddress"
                            />
                            {errors.address && <span className="errorMessage">{errors.address}</span>}
                        </div>
                        <div className="newUserItem">
                            <label>Data urodzenia</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        value={formData.dob ? dayjs(formData.dob) : null}
                                        onChange={handleDateChange}
                                        renderInput={(params) => <input {...params} className="DatePickerInput" data-testid="inputDob" />}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            {errors.dob && <span className="errorMessage">{errors.dob}</span>}
                        </div>
                        <div className="newUserItem">
                            <label>Płeć</label>
                            <Select
                                name="gender"
                                value={DOMPurify.sanitize(formData.gender)}
                                onChange={handleChange}
                                onBlur={() => validateField('gender', formData.gender)}
                                className="newUserInput"
                                displayEmpty
                                data-testid="selectGender"
                            >
                                <MenuItem value={DOMPurify.sanitize()} disabled hidden>
                                    Wybierz
                                </MenuItem>
                                <MenuItem value={DOMPurify.sanitize("Kobieta")}>Kobieta</MenuItem>
                                <MenuItem value={DOMPurify.sanitize("Mężczyzna")}>Mężczyzna</MenuItem>
                                <MenuItem value={DOMPurify.sanitize("Inna")}>Inna</MenuItem>
                                <MenuItem value={DOMPurify.sanitize("Nie podano")}>Nie podano</MenuItem>
                            </Select>
                            {errors.gender && <span className="errorMessage">{errors.gender}</span>}
                        </div>
                        <div className="newUserItem">
                            <label>Stanowisko</label>
                            <div className="newUserTitleOptions" data-testid="inputTitle">
                                {['Software Tester', 'Frontend Developer', 'Backend Developer', 'Business Analyst', 'Chapter Lead', 'Product Owner', 'Fullstack Developer', 'UX Designer'].map((title) => (
                                    <label key={title} className="titleOption">
                                        <input
                                            type="radio"
                                            name="title"
                                            value={DOMPurify.sanitize(title)}
                                            checked={formData.title === title}
                                            onChange={handleChange}
                                            data-testid={`radioTitle-${title}`}
                                        />
                                        {DOMPurify.sanitize(title)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="newUserRight">
                        <div className="userUpdateRight">
                            <div className="userUpdateUpload">
                                <img
                                    src={DOMPurify.sanitize(formData.avatar ? `${process.env.REACT_APP_API_URL}${formData.avatar}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg')}
                                    alt=""
                                    className="userUpdateImg"
                                    onClick={() => setIsModalOpen(true)}
                                    data-testid="userAvatar"
                                />
                                <label className="uploadLabel" onClick={() => setIsModalOpen(true)} data-testid="labelSelectImage">
                                    <PhotoCameraOutlinedIcon data-testid='cameraIcon' />
                                    Wybierz obraz
                                </label>
                            </div>
                            <ButtonGroup variant="contained" aria-label="contained button group" className="decisionButtonGroup">
                                <label>Aktywuj</label>
                                <GreenSwitch checked={isActive} onChange={handleToggle} data-testid="toggleActive" />
                                <button type="submit" className="submitButtonNewForm" data-testid="submitButton">
                                    Dodaj
                                </button>
                            </ButtonGroup>
                        </div>
                    </div>
                </form>
                <Notification alert={alert} data-testid="notification" />
                <ImageUploadModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleImageSelect}
                    imageType="users"
                    data-testid="imageUploadModal"
                />
            </div>
        </div>
    );    
}
