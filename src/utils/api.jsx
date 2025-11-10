import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('📡 Request:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
