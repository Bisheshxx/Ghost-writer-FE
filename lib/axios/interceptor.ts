import { api } from "./api";
import { getToken } from "@clerk/nextjs";

export const createApiClient = () => {
  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }, null);

  return api;
};
