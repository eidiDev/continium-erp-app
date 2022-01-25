import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URI ,
  // baseURL: `${process.env.REACT_APP_DB_URL}`,
    // baseURL: `https://corsanywheremaktor.herokuapp.com/https://pneumax-api.herokuapp.com/`,
  // baseURL: `https://pneumax-api.herokuapp.com/`,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET, PUT, POST, DELETE, OPTIONS'
  }
});

api.interceptors.request.use(async (config) => {
  let token = getToken();
  token = JSON.parse(token);

  // if (token) {
  //   token = JSON.parse(token);
  // }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Para interceptar todas as requisiçoes
// api.interceptors.request.use(async config=>{
    // const token = getToken()
    // if(token) {
    //     config.headers.Authorization = `Bearer ${token}`
    // }
    // return config;
// })

export default api;
