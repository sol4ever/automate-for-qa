import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid, Select, MenuItem } from '@mui/material';
import  '../resetConfirmationModal/resetConfirmationModal.css';

const TestConfirmationModal = ({ open, onClose, onConfirm }) => {
    const [environment, setEnvironment] = useState('local'); // Default environment

    const handleEnvironmentChange = (event) => {
        setEnvironment(event.target.value);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modalBox">
                <Typography variant="h6" component="h2" className="modalTitle">
                    Zamierzasz uruchomić testy end-to-end!
                </Typography>
                <Typography variant="body1" className="modalText">
                   Testy zostaną uruchomione na środowisku lokalnym. Czy kontynuować?
                </Typography>
                <Grid container spacing={2} className="buttonGrid">
                    <Grid item>
                        <Button variant="contained" onClick={onClose} className="cancelModalButton">
                            Anuluj
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={() => onConfirm(environment)} className="resetModalButton">
                            Kontynuuj
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default TestConfirmationModal;
