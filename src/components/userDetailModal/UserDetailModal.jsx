import React from 'react';
import { Modal, Box, Typography, Grid } from '@mui/material';
import './userDetailModal.css';
import DOMPurify from 'dompurify';

const UserDetailModal = ({ open, onClose, user }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modalBox">
                <Typography variant="h6" component="h2" className="modalTitle">
                    Szczegóły:
                </Typography>
                <Grid container spacing={2} className="userDetailGrid">
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Pracownik:</strong> {DOMPurify.sanitize(user.fullName)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Data rejestracji:</strong> {DOMPurify.sanitize(user.joinDate)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Email:</strong> {DOMPurify.sanitize(user.email)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Status:</strong> {DOMPurify.sanitize(user.status)}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default UserDetailModal;
