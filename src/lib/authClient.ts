import axios from 'axios';

export const authClient = axios.create({
    baseURL: `/api/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export default authClient;