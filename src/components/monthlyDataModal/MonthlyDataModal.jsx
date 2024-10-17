import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './monthlyDataModal.css';
import DOMPurify from 'dompurify';

const MonthlyDataModal = ({ open, onClose, header, data }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modalBox">
                <Typography variant="h6" component="h2" className="modalTitle">
                    {header}
                </Typography>
                <TableContainer component={Paper} className="customTableContainer">
                    <Table className="customTable">
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index} className="customTableRow">
                                    <TableCell component="th" scope="row" className="customTableCell">
                                        {DOMPurify.sanitize(row.month)}
                                    </TableCell>
                                    <TableCell align="right" className="customTableCell">
                                        {DOMPurify.sanitize(row.value.toString())}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    );
};

export default MonthlyDataModal;
