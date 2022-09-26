import axios from "axios"
import Cookies from 'universal-cookie';
import { notifyError } from "../utils/speccificToasts";

const httpClient = axios.create({
    baseURL: "http://localhost:5000/",
    headers: {'Content-Type': 'application/json' },
})
let cookie = new Cookies();

export const httpPost = (params) =>
  httpClient.request({
    method: "post",
    ...params,
  });

httpClient.interceptors.request.use(
    config => {   
    let token = cookie.get("access_token")
    let refresh_token = cookie.get("refresh_token")
      if (token) {
        config.headers = Object.assign(config.headers, { "Authorization": "Bearer " + token });
        return config;
      }
      else if (refresh_token) {
        config.headers = Object.assign(config.headers, { "Authorization": "Bearer " + refresh_token });
        return config;
      }
      return config
    },
    error => Promise.reject(error)
);

httpClient.interceptors.response.use(response => {
  // Edit response config
  return response;
}, error => {

  notifyError(JSON.stringify(error.response.data))

  if (parseInt(error.response?.status) === 401) {
    notifyError(error.response.data)
    cookie.remove('access_token')
    cookie.remove('refresh_token')
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
    // debouncedGetToken()
  }

  if (parseInt(error.response?.status) === 403) {
    notifyError(error.response.data)
    cookie.remove("access_token")
    window.location.href = "/login"
  }
  
  return Promise.reject(error);
});


export default httpClient;

// let debouncedGetToken =  debounce(() => RefreshLogin('Токен был исперпан, соединение восстановлено, но Ваш последний запрос не был отправлен, повторите попытку ещё раз'), 1000)
