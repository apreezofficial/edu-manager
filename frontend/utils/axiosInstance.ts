import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backendforoureduu.iceiy.com',
  // you can add default headers here if needed
});

export default axiosInstance;
