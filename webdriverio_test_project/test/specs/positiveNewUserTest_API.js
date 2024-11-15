import { currentDateAndTime } from '../utilities/helpers.timeGenerators';
import axios from 'axios';

describe('API Test: Update User Status', () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    let token;
    let newUser;

    describe('API Test: Login, Create User, Update Status, and Verify', () => {
        it('should log in with valid credentials and return a token', async () => {
            const loginCredentials = {
                username: currentDateAndTime(), 
                password: currentDateAndTime() 
            };

            try {
                const response = await axios.post(`${apiUrl}/login`, loginCredentials);
                expect(response.status).toBe(200);
                expect(response.data).toHaveProperty('token');

                token = response.data.token;
                // console.log('Login Token:', token); //Debug
            } catch (error) {
                console.error('Login failed:', error.response?.data || error.message);
                throw error;
            }
        });

        it('should create a dummy user via API', async () => {
            newUser = {
                userName: 'Jane Doe',
                address: 'Kings Landing',
                avatar: '/images/users/Jane_Doe.jpg',
                email: 'jane.doe@example.com',
                status: 'aktywny',
                title: 'Software Developer',
                fullName: 'Jane Doe Targaryen',
                dob: '1992-05-14',
                widgetLgDate: '2.08.2024',
                widgetLgAmount: '9100.00 PLN',
                widgetLgStatus: 'Zatwierdzona',
                joinDate: '12.12.2023',
                phone: '+48555555555',
                currentMainProject: 'Dragon App'
            };

            try {
                const response = await axios.post(`${apiUrl}/users`, newUser, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                expect(response.status).toBe(201);
                expect(response.data).toMatchObject({
                    userName: newUser.userName,
                    email: newUser.email
                });

                newUser.id = response.data.id;
                // console.log('New User Created:', response.data); //Debug
            } catch (error) {
                console.error('Error creating user:', error.response?.data || error.message);
                throw error;
            }
        });

        it('should update the user status to "usunięty"', async () => {
            try {
                const updatedData = { status: 'usunięty' };

                const response = await axios.put(`${apiUrl}/users/${newUser.id}`, updatedData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                expect(response.status).toBe(200);
                expect(response.data).toMatchObject({
                    id: newUser.id,
                    status: 'usunięty'
                });

                // console.log('Updated User Status:', response.data); //Debug
            } catch (error) {
                console.error('Error updating user status:', error.response?.data || error.message);
                throw error;
            }
        });

        it('should verify the updated status using the GET endpoint', async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/${newUser.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                expect(response.status).toBe(200);
                expect(response.data).toMatchObject({
                    id: newUser.id,
                    status: 'usunięty'
                });

                // console.log('Verified User Status:', response.data); Debug
            } catch (error) {
                console.error('Error verifying user status:', error.response?.data || error.message);
                throw error;
            }
        });
    });
});
