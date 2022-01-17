import axios from 'axios';

const http = require('http');
//const httpAgent = new http.Agent({ keepAlive: true });

const api = axios.create({
  //baseURL: `http://127.0.0.1:3333/`,
  baseURL: `https://pneumax-adonis-api.herokuapp.com/`,
  //httpAgent: httpAgent,
  //baseURL: `https://corsanywheremaktor.herokuapp.com/https://pneumax-api.herokuapp.com/`,
  // baseURL: `https://pneumax-api.herokuapp.com/`,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  },
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

