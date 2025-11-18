import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1/sistema/apis_restaurantes/api_e_commerce/api1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
