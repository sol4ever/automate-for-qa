import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { PermIdentity, MailOutline, PhoneAndroid, CalendarToday, LocationSearching } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import './userAccountPreviewModal.css';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';


const UserAccountPreviewModal = ({ open, onClose, user }) => {
    const statusColors = {
        aktywny: '#185905',
        nieaktywny: '#F2811D',
        zawieszony: '#EEE0d7',
        usunięty: 'black'
    };

    return (
        <Modal open={open} onClose={onClose} className="entityModal">
            <Box className="modalBox">
                <Typography
                    variant="h6"
                    component="h2"
                    className="modalTitle"
                    style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}
                >
                    Pracownik

                </Typography>

                <div className="entityShow">

                    <div className="entityShowTop">

                        <div className="entityShowImgContainer">
                            <img
                                src={user.avatar ? user.avatar : noImage}
                                alt="User Avatar"
                                className="entityShowImg"
                            />
                        </div>
                        <div className="entityShowTopTitle">
                            {user.status && (
                                <button className="modalDeletedLabel"
                                    style={{
                                        backgroundColor: statusColors[user.status] || 'gray',
                                        color: user.status === 'zawieszony' ? 'black' : 'white',
                                    }}
                                >{user.status}</button>
                            )}
                            <div className="entityShowName">{DOMPurify.sanitize(user.userName)}
                            </div>
                            <span className="entityShowTitle">{DOMPurify.sanitize(user.title)}</span>
                            <Rating
                                name="read-only"
                                value={DOMPurify.sanitize(user.rating || 0)}
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
                        <div className="userShowInfo">
                            <PermIdentity className="userShowIcon" />
                            <span className="userShowInfoTitle">{DOMPurify.sanitize(user.fullName) || 'Brak danych'}</span>
                        </div>
                        <div className="userShowInfo">
                            <MailOutline className="userShowIcon" />
                            <span className="userShowInfoTitle">{DOMPurify.sanitize(user.email) || 'Brak danych'}</span>
                        </div>
                        <div className="userShowInfo">
                            <PhoneAndroid className="userShowIcon" />
                            <span className="userShowInfoTitle">{DOMPurify.sanitize(user.phone) || 'Brak danych'}</span>
                        </div>
                        <div className="userShowInfo">
                            <LocationSearching className="userShowIcon" />
                            <span className="userShowInfoTitle">{DOMPurify.sanitize(user.address) || 'Brak danych'}</span>
                        </div>
                        <div className="userShowInfo">
                            <CalendarToday className="userShowIcon" />
                            <span className="userShowInfoTitle">{DOMPurify.sanitize(user.dob) || 'Brak danych'}</span>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal >
    );
};

export default UserAccountPreviewModal;
