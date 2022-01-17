import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:1337/`,
  // baseURL: `${process.env.REACT_APP_DB_URL}`,
    // baseURL: `https://corsanywheremaktor.herokuapp.com/https://pneumax-api.herokuapp.com/`,
  // baseURL: `https://pneumax-api.herokuapp.com/`,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET, PUT, POST, DELETE, OPTIONS'
  }
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
