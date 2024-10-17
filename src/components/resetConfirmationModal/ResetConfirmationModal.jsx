import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import './resetConfirmationModal.css';

const ResetConfirmationModal = ({ open, onClose, onConfirm }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modalBox">
                <Typography variant="h6" component="h2" className="modalTitle">
                    Zamierzasz przywrócić aplikację do stanu początkowego!
                </Typography>
                <Typography variant="body1" className="modalText">
                    Wszystkie wykonane zmiany zostaną utracone. Czy zresetować aplikację?
                </Typography>
                <Grid container spacing={2} className="buttonGrid">
                    <Grid item>
                        <Button variant="contained" onClick={onClose} className="cancelModalButton">
                            Anuluj
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={onConfirm} className="resetModalButton">
                            Resetuj
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default ResetConfirmationModal;
