
import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND
});

export const shortUrlBase = new URL(api.defaults.baseURL).origin

export default api;