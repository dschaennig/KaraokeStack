import axios from 'axios';

const api = axios.create({
    baseURL: "http://192.168.178.21:8000"
});

export default api;