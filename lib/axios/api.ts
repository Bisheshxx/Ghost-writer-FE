import axios from "axios";
import { createApiClient } from "./interceptor";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

// Register interceptors on api instance
createApiClient();
