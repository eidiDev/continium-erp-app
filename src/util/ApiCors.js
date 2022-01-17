import axios from 'axios';

const apiCors = axios.create({
	baseURL: `http://192.168.15.117:8080/http://192.168.15.117:3333/`,
  //baseURL: `http://localhost:1337/`,
  // baseURL: `http://192.168.0.3:1337/`,
   //https://cors-anywhere.herokuapp.com
  //  baseURL: `https://corsanywheremaktor.herokuapp.com/https://pneumax-api.herokuapp.com/`,
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

export default apiCors;
