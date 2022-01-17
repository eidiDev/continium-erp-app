import axios from "axios"

const api = axios.create({
    baseURL: "http://192.168.0.12:1337"
});

// api.interceptors.request.use(async config=>{
//     // const token = getToken()
//     // if(token) {
//     //     config.headers.Authorization = `Bearer ${token}`
//     // }
//     // return config;
// })

export default api;