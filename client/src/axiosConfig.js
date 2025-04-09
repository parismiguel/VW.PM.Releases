import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth"); // Retrieve Basic Auth credentials
    if (auth) {
      config.headers["Authorization"] = `Basic ${auth}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response interceptor error:", error);
    return Promise.reject(error);
  }
);

export default instance;