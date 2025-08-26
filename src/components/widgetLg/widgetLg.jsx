import React, { useState, useEffect } from 'react';
import './widgetLg.css';
import UserAccountPreviewModal from '../userAccountPreviewModal/UserAccountPreviewModal'
import axios from '../../utils/axiosConfig';
import DOMPurify from 'dompurify';
import noImage from '../../images/noimage.jpg';

export default function WidgetLg() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    axios.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => setUsers(response.data.slice(0, 7)))
      .catch(error => console.error('Error fetching users:', error));
  }, [token]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const Button = ({ type }) => {
    const getStatusClass = (status) => {
      switch (status) {
        case 'Zatwierdzona':
          return 'Approved';
        case 'W trakcie':
          return 'Pending';
        case 'Odrzucona':
          return 'Declined';
        default:
          return '';
      }
    };
    return <button className={'widgetLgButton ' + getStatusClass(type)}>{type}</button>;
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetTitle">Ostatnie przelewy</h3>
      <table className="widgetTable">
        <tr className="widgetLgTr">
          <th className="widgetTh">Pracownik</th>
          <th className="widgetTh">Data</th>
          <th className="widgetTh">Kwota</th>
          <th className="widgetThStatus">Status transakcji</th>
        </tr>
        {users.map((user) => (
          <tr className="widgetLgTr" key={user.id}>
            <td className="widgetLgUser" onClick={() => handleOpenModal(user)}>
              <img
                src={user.avatar ? user.avatar : noImage}
                alt={DOMPurify.sanitize(user.userName)}
                className="widgetUserImg"
              />
              <div className="widgetLgUser">
                <span className="widgetUserName">{DOMPurify.sanitize(user.userName)}</span>
                <span className="widgetUserTitle">{DOMPurify.sanitize(user.title)}</span>
              </div>
            </td>
            <td className="widgetLgDate">{DOMPurify.sanitize(user.widgetLgDate)}</td>
            <td className="widgetLgAmount">{DOMPurify.sanitize(user.widgetLgAmount)}</td>
            <td className="widgetLgStatus">
              <Button type={user.widgetLgStatus} />
            </td>
          </tr>
        ))}
      </table>

      {selectedUser && (
        <UserAccountPreviewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}
    </div>
  );
}
