import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateInputs = () => {
        if (username.length < 10 || username.length > 20 || password.length < 10 || password.length > 20) {
            setError('Nazwa użytkownika musi mieć min. 10, max. 20 znaków. Hasło musi mieć min. 10, max. 20 znaków.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateInputs()) return;
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password },
                {
                    withCredentials: true
                }
            );

            sessionStorage.setItem('authToken', response.data.token);
            onLoginSuccess();
            setError('');
        } catch (err) {
            setError('Logowanie nie powiodło się. Proszę spróbować ponownie.');
            navigate('/home');
        }
    };

    useEffect(() => {
        if (open) {
            setUsername('');
            setPassword('');
            setError('');
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} className="entityModal" data-testid="login-modal">
            <Box className="modalBox">
                <Typography
                    variant="h6"
                    component="h2"
                    className="modalTitle"
                    style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '24px' }}
                    data-testid="login-modal-title"
                >
                    Login
                </Typography>
                <TextField
                    fullWidth
                    label="Nazwa użytkownika (10-20 dowolnych znaków)"
                    variant="outlined"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    inputProps={{ 'data-testid': 'username-input' }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#F2561D',
                            },
                            '&:hover fieldset': {
                                borderColor: '#F2561D',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#F2561D',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#F2561D',
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Hasło (10-20 dowolnych znaków)"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{ 'data-testid': 'password-input' }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#F2561D',
                            },
                            '&:hover fieldset': {
                                borderColor: '#F2561D',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#F2561D',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#F2561D',
                        },
                    }}
                />
                {error && (
                    <Typography color="error" style={{ textAlign: 'center', marginBottom: '15px', color: '#F2561D' }} data-testid="login-error">
                        {error.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    style={{ width: '100%', marginBottom: '10px', backgroundColor: '#b44809' }}
                    data-testid="login-button"
                >
                    Login
                </Button>
            </Box>
        </Modal>
    );
};

export default LoginModal;
