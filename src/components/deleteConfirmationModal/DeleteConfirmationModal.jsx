import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import './deleteConfirmationModal.css';
import DOMPurify from 'dompurify';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modalBox">
                <Typography variant="h6" component="h2" className="modalTitle">
                    {DOMPurify.sanitize(title)}
                </Typography>
                <Typography variant="body1" className="modalText">
                    {DOMPurify.sanitize(message)}
                </Typography>
                <Grid container spacing={2} className="buttonGrid">
                    <Grid item>
                        <Button variant="contained" onClick={onClose} className="cancelModalButton">
                            Anuluj
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={onConfirm} className="deleteModalButton">
                            Usuń
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default DeleteConfirmationModal;
