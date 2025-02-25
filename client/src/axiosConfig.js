import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
});

instance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      config.headers['Authorization'] = `Basic ${auth}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;