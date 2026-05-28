import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backenddd-eduu.gt.tc',
  // you can add default headers here if needed
});

export default axiosInstance;
