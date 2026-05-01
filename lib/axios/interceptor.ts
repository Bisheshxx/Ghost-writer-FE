import { api } from "./api";
import { getToken } from "@clerk/nextjs";

export const createApiClient = () => {
  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    console.log("**************************");
    console.log(token, "this is the token");
    console.log("**************************");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }, null);

  return api;
};
