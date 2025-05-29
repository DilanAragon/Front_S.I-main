// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL    // omitirá el proxy y usará tu .env
});

export default api;
