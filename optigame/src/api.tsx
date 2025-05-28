import axios from 'axios';

const api = axios.create({
    baseURL: 'https://optigame-back-end.onrender.com/api'
});

export default api;