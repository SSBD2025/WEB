import axios from 'axios';

export const authClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default authClient;