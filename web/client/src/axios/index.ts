import axios from "axios";

const axiosInstace = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstace.interceptors.request.use((config) => {
  if (typeof window !== undefined) {
    const data = localStorage.getItem("auth");

    if (data) {
      const auth = JSON.parse(data);

      if (auth && auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    }
  }

  return config;
});

export default axiosInstace;
