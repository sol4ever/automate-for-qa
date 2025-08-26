import './widgetSm.css';
import UserDetailModal from '../../components/userDetailModal/UserDetailModal';
import React, { useState, useEffect } from 'react';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import UserAccountPreviewModal from '../userAccountPreviewModal/UserAccountPreviewModal'
import axios from '../../utils/axiosConfig';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';


export default function WidgetSm() {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSetOpen, setIsModalToOpen] = useState(false);
    const token = sessionStorage.getItem('authToken');

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleOpenAccountModal = (user) => {
        setSelectedUser(user);
        setIsModalToOpen(true);
    };

    const handleCloseAccountModal = () => {
        setIsModalToOpen(false);
        setSelectedUser(null);
    };


    useEffect(() => {
        axios.get('/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, [token]);

    return (
        <div className='widgetSm'>
            <h3 className="widgetTitle">Nowi pracownicy</h3>
            <table className="widgetTable">
                <tr className="widgetSmTr">
                    <th className="widgetTh">Pracownik</th>
                    <th className="widgetTh">Kontakt</th>
                    <th className="widgetTh">Projekt</th>
                    <th className="widgetThDetails">Szczegóły</th>
                </tr>
                {users.slice(3, 10).map(user => (
                    <tr className="widgetSmTr" key={user.id}>
                        <td className="widgetSmUser" onClick={() => handleOpenAccountModal(user)}>
                            <img
                                src={user.avatar ? user.avatar : noImage}
                                alt={DOMPurify.sanitize(user.userName)}
                                className="widgetUserImg"
                            />
                            <div className="widgetSmUser">
                                <span className="widgetUserName">{DOMPurify.sanitize(user.userName)}</span>
                                <span className="widgetUserTitle">{DOMPurify.sanitize(user.title)}</span>
                            </div>
                        </td>
                        <td className="widgetSmPhone">{DOMPurify.sanitize(user.phone) || 'Brak danych'}</td>
                        <td className="widgetSmProject">{DOMPurify.sanitize(user.currentMainProject) || 'Brak danych'}</td>
                        <td className="widgetSmStatus">
                            <span className="widgetSmButton" onClick={() => handleOpenModal(user)}>
                                <RemoveRedEyeOutlinedIcon className="widgetSmButtonIcon" />
                                <span className="iconText">Podgląd</span>
                            </span>
                        </td>
                    </tr>
                ))}
            </table>
            {selectedUser && (
                <UserDetailModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    user={selectedUser}
                />
            )}
            {selectedUser && (
                <UserAccountPreviewModal
                    open={isModalSetOpen}
                    onClose={handleCloseAccountModal}
                    user={selectedUser}
                />
            )}
        </div>
    )
}
