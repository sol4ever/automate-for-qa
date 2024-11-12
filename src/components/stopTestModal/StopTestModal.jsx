// src/components/stopTestModal/StopTestModal.js

import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';

const StopTestModal = ({ open, onClose, onConfirm }) => (
  <Modal open={open} onClose={onClose}>
    <Box className="modalBox">
      <Typography variant="h6" component="h2" className="modalTitle">
        Zamierzasz przerwać wykonywane testy end-to-end!
      </Typography>
      <Grid container spacing={2} className="buttonGrid">
        <Grid item>
          <Button variant="contained" onClick={onClose} className="cancelModalButton">
            Anuluj
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={onConfirm} className="stopModalButton">
            Przerwij
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Modal>
);

export default StopTestModal;
