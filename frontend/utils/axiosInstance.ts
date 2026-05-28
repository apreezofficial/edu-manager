import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backenddd-eduu.gt.tc/edu/backend',
  // you can add default headers here if needed
});

export default axiosInstance;
