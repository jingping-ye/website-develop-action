import axios from 'axios'
// import qs from 'qs'

let httpInstance = axios.create()

httpInstance.defaults.baseURL = 'http://localhost:8081/'
httpInstance.defaults.timeout = 5000
//  post方法、get方法：不处理，直接调用
//  application/x-www-form-urlencode格式
httpInstance.formurl = (url, data, config) => {
  return httpInstance.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    ...config
  })
};
//  multipart/formdata格式
httpInstance.formdata = (url, data, config) => {
  return httpInstance.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
};
//  多媒体图片请求方法

//  request拦截器
httpInstance.interceptors.request.use(
  config => {
    // 添加token
    // config.headers.token = cookieStorange.token
    console.log(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
//  reponse拦截器
httpInstance.interceptors.response.use(
  response => {
    //  对图片、文件、等等进行处理
    if (response.data instanceof Blob && response.data.type === 'application/json') {
      //  对图片进行操作
      return Promise.resolve(response)
    } else if (response.data instanceof Blob) {
      //  对文件进行操作
      return Promise.resolve(response)
    } else {
      return Promise.resolve(response)
    }
  },
  error => {
    //  对错误状态码进行处理
    //  500:服务器内部错误
    // 504:网关超时
    return Promise.reject(error)
  }
)
export default httpInstance
