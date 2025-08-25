import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const event = new Event('sessionExpired');
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default instance;
