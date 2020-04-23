/**
 |--------------------------------------------------
 | 封装的异步请求函数
 |--------------------------------------------------
 */
import axios from 'axios';
import qs from 'qs'
import secret from "./secret";
import { message, Modal } from "antd";
import {baseURLDev,baseURLPro} from './api-url'
message.config({ top: "30%", duration: 2});

const AJAX_TIMEOUT = 'ECONNABORTED';       // 远程主机拒绝网络连接
window.global_config = {
  BASE_PRO_URL: "http://config.zfbd.zjsjy.gov/zfbd_if/service.do",
  BASE_DEV_URL: "http://10.250.199.15:8088/zfbd_if/service.do"
};
// // 打包地址:
const baseURL = process.env.NODE_ENV === 'development' ?  window.global_config.BASE_DEV_URL :  window.global_config.BASE_PRO_URL;
// const baseURL = 'api'
let tokenBool = true;     // token 过期处理
//请求拦截
axios.interceptors.request.use(function (config) {
  // console.log(config);
  return config;
}, function (error) {
  return Promise.reject(error);
});

const newRequest = (url, params, method, onError) =>
  new Promise((resolve, reject) => {
    axios({
      baseURL,
      url,
      method,
      timeout: 5000,
      ...params,
    })
      .then(({ data }) => {
        const {code} = data;
        // if (code === 1003 && tokenBool) {
        //     //   token过期或未取到token
        //     tokenBool =false;
        //     Modal.warning({
        //       title: '提示',
        //       content: '登录过期，请重新登录！',
        //       onOk:() => {
        //         sessionStorage.clear();
        //         response.push('/');
        //         tokenBool =true;
        //       }
        //     });
        // }
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });

const request = ({ url = '', param = {}, method = 'get', onError }) => {
  const time=new Date().getTime();
  const loginData = sessionStorage.getItem("loginData");
  //const loginData = {}
  let userId = ''
  if(loginData) userId = JSON.parse(loginData).userId;
  if(param.userId) userId = param.userId;
  console.log('接口cmd'+param.cmd,'参数'+JSON.stringify(param.value.data))
  const newParam={
    cmd:param.cmd,
    value:JSON.stringify({
      data:secret.Encrypt(JSON.stringify(param.value.data),param.bool),
      userId,
      fromSource:1,
      osType:1,
      versionCode:"10001",
      version:"1",
      timeStamp : time,
      hashCode : secret.MD5(time),
      appId:"B55AB05AECBC43E6B84B3240AF3E3316",
      deviceId:""
    })
    // value:JSON.stringify({
    //   data:JSON.stringify(param.value.data),
    //   userId,
    //   fromSource:1,
    //   osType:1,
    //   versionCode:"10001",
    //   version:"1",
    //   timeStamp : time,
    //   hashCode : time,
    //   appId:"B55AB05AECBC43E6B84B3240AF3E3316",
    //   deviceId:""
    // })
  };
  const Method = method.toLowerCase();
  if (Method === 'post') {
    return newRequest(url, { data: qs.stringify(newParam)}, 'post', onError);
  }
  if (Method === 'put') {
    return newRequest(url, { data: newParam }, 'put', onError);
  }
  if (Method === 'delete') {
    return newRequest(url, { params: newParam }, 'delete', onError);
  }
  return newRequest(url, { params: newParam }, 'get', onError);
};

request.get = (url, param, onError) => request({ method: 'get', url, param, onError });

request.post = (url, param, onError) => request({ method: 'post', url, param, onError });

request.put = (url, param, onError) => request({ method: 'put', url, param, onError });

request.delete = (url, param, onError) => request({ method: 'delete', url, param, onError });

export default request;
