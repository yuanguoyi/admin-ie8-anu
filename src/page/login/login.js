/*
*   登录
* */

import React, { Component } from 'react';
import { Form, Input,message } from 'antd';
import {navigate,Link} from 'router'
import './Login.less';
import Request from "../../tool/request";
import Cookies from 'js-cookie';
class Login extends Component {
  constructor(props,context) {
    super(props,context);
    this.state= {
      loading: false,
    };

  }

  componentDidMount() {
    // document.addEventListener("keydown",this.handleKeyDown);
  }
  componentWillUnmount(){
    // document.removeEventListener("keydown",this.handleKeyDown); 
  }
  // 点击登录
  handleSubmit(e) {
    // e.preventDefault();
    this.props.history.push("/home/loading")
    let valueObject=this.props.form.getFieldsValue();
    let {userName, password, agreement} = valueObject;
    if(!userName){
      message.warning('请输入用户名');
    } else if (!password) {
      message.warning('请输入密码');
    }else {

      this.setState({ loading: true });
      // this.goToHash("/home", {msg:"登录成功！"});
      // this.policeLogin(userName,password);
    }
    
  };
  handleKeyDown = (e) =>{         
    if(e.keyCode === 13) {
      // e.preventDefault();
    let valueObject=this.props.form.getFieldsValue();
      let {userName, password, agreement} = valueObject;
      if(!userName){
        message.warning('请输入用户名');
      } else if (!password) {
        message.warning('请输入密码');
      }else {
        this.setState({ loading: true });
        // this.goToHash("/home", {msg:"登录成功！"});
        this.policeLogin(userName,password);
      }
    }
  }
  //  2.1.登录
  policeLogin = (no, pwd) => {
    const that = this;
    Request.post("",{
      cmd:"policeLoginWeb",
      value: {
        data:{
          no,    // 账号
          pwd
        }
      },
      userId:no,
      bool:false
    })
      .then((rest)=>{
        if(rest.code===1000){
          sessionStorage.setItem("loginData", JSON.stringify(rest.data));
          this.setState({ loading: false });
          //message.success('登录成功！');
          this.props.history.push({
            pathname: "/home/loading",
            query:{
              userUid: no
            }
          })
          // that.goToHash("/home/loading", {msg:"登录成功！"});
        }else{
          this.setState({ loading: false });
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{
        this.setState({ loading: false });
        message.warning('登录请求超时，请重新登录');
        console.log(err);
      })
  };

  // 路由跳转
  goToHash = (pathname, state) => {
    // this.context.router.push({
    //   pathname,
    //   state,              // 页面刷新清空(获取：this.props.location.state)
    //   query:{msg:123}     // 页面刷新还在(字段会出现在地址栏)
    // });
    // this.context.router.goBack();
  };

  render() {
    const { getFieldProps } = this.props.form;
    const { loading } = this.state; 
    return (
      <div className="login" style={{backgroundImage:'url(img/login_bg_item.png)'}}>
        <div className="login-bg" style={{backgroundImage: 'url(img/logo_bg.png)'}}>

          {/* <div className="login-header">
            <img src="/imgs/jh@2x.png" alt=""/>
            <span style={{linHeight:ZOOM*124+"px",fontSize:ZOOM*40+"px"}}>执法宝典管理系统</span>
          </div> */}
          <div className="login-logo">
            <p className="logo"><img src='img/jh@2x.png' /></p>
            <p className="logo-name">执法宝典</p>
            <p className="logon-en">Law enforcement treasure</p>
          </div>
          <div className="login-form">
            {/* <div className="title" style={{fontSize:ZOOM*38+"px"}}>
              <div></div>
              登录
            </div> */}
            <div className="login-name">用户登录</div>
              <div className="input">
                <div className="icon-wrap">
                  <img src="img/logo_userName.png" alt=""/>
                </div>
                <Input style={{fontSize:18+"px"}} placeholder="请输入用户名" {...getFieldProps('userName',{initialValue: ""})} />
              </div>

              <div className="input">
                <div className="icon-wrap">
                  <img src='img/logo_password.png' alt=""/>
                </div>
                <Input style={{fontSize:18+"px"}} type="password" placeholder="请输入密码" {...getFieldProps('password',{initialValue: ""})}/>
              </div>

              {/* <div className="check-box">
                <Checkbox {...getFieldProps('agreement')}>记住密码</Checkbox>
              </div> */}

              <div className="button">
                <div className="login_btn"  type="primary" htmlType="submit" loading={loading} onClick={this.handleSubmit.bind(this)}>
                  登录
                </div>
              </div>
          </div>

        </div>
      </div>
    );
  }
}

//添加router至this.context
// Login.contextTypes = {
//   router: Object
// };

export default Form.create()(Login);
