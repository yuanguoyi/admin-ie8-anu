import React, { Component } from 'react'
import { Spin,message} from 'antd';
import {getCode} from '@/tool/util'
import Request from "../../tool/request";
class Loading extends Component {
  state = { 

   }
  componentDidMount(){
    let userUid = getCode('userUid')
    this.props.history.push('/home')
    //this.policeLogin(userUid);
  }
  //  2.1.登录
  policeLogin = (no) => {
    Request.post("",{
      cmd:"policeLoginWeb",
      value: {
        data:{
          no    // 账号
        }
      },
      userId:no,
      bool:false
    })
      .then((rest)=>{
        if(rest.code===1000){
          //sessionStorage.setItem("loginData", JSON.stringify(rest.data));
          this.props.history.push('/home')
        }else{
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{
        message.warning('登录请求超时，请重新登录');
      })
  };
  render() { 
    return ( 
      <div className="loading-wrap">
        <Spin size="small" />
        <Spin />
        <Spin size="large" />
        <div className="loading-text">正在登录中</div>
      </div>
     );
  }
}
 
export default Loading;