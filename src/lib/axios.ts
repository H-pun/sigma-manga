import axios from "axios";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "@/lib/utils";
// import { getSession } from "next-auth/react";

// Inisialisasi interceptor di sini
axios.interceptors.request.use(
  async (config) => {
    config.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    config.timeout = 30000;
    // const session = await getSession();
    // if (session && session.user) {
    //   config.headers["Authorization"] = `Bearer ${session.user.appToken}`;
    // }
    if (config.data) config.data = convertKeysToSnakeCase(config.data);
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => {
    if (response.data) response.data = convertKeysToCamelCase(response.data);
    return response;
  },
  (error) => Promise.reject(error),
);

export default axios;
