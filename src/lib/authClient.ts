import axios from "axios";

export const authClient = axios.create({
  baseURL: `/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default authClient;
