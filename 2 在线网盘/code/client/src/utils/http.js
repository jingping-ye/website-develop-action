import axios from 'axios'

let httpInstance = axios.create()


let protocol = window.location.protocol; //协议
let host = window.location.host; //主机

httpInstance.defaults.baseURL = `${protocol}//${host}/`
httpInstance.defaults.timeout = 1000*60*20

httpInstance.formurl = (url, data, config) => {
  return httpInstance.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    ...config
  })
};

//  request拦截器
httpInstance.interceptors.request.use(
  config => {
    // console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
//  reponse拦截器
httpInstance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    }
  },
  error => {
    return Promise.reject(error)
  }
)
export default httpInstance
