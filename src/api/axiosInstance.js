import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,     ///allow cookie,
  headers: { "Content-Type": "application/json" },
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("inst" , error);
    
    if (error.response.status === 401 || error.response.status === 403) {
      console.error("Unauthorized! Redirecting to login...");
      localStorage.clear(); 
      window.location.href ="/"; 
      alert("Session expired! Please log in again.");

    }
    return Promise.reject(error);
  }
);

export default axiosInstance