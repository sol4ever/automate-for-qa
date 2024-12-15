import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import './sessionExpiredModal.css';

const SessionExpiredModal = ({ open, onReload }) => {
  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      onClose={() => {}}
      aria-labelledby="session-expired-title"
      aria-describedby="session-expired-description"
    >
      <Box className="modalBox">
        <Typography
          id="session-expired-title"
          variant="h6"
          component="h2"
          className="modalTitle"
        >
          Sesja wygasła!
        </Typography>
        <Typography
          id="session-expired-description"
          variant="body1"
          className="modalText"
        >
          Przeładuj aplikację i zaloguj się ponownie, aby wrócić do pracy.
        </Typography>
        <Grid container spacing={2} className="buttonGrid">
          <Grid item>
            <Button
              variant="contained"
              onClick={onReload}
              className="reloadModalButton"
            >
              Przeładuj
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SessionExpiredModal;
