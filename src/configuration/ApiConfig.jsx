import axios from "axios";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/backend-service";

const api = axios.create({
    baseURL: apiBaseURL,
    headers: {
        'Content-Type' : 'application/json'
    }
});

const token = localStorage.getItem('token');
if (token){
    api.defaults.headers.common['Authorization'] = `${token}`;
}

export default api;