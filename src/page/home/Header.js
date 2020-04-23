/*
*   头部
* */

import React, { Component } from 'react';
import { Input, Menu,Icon ,Modal,Form,Row,message,Dropdown} from 'antd';
import './style/Header.less';
import Request from "../../tool/request";
import Cookies from 'js-cookie'
const loginData =  JSON.parse(sessionStorage.getItem("loginData"));
// const loginData = {}
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const FormItem = Form.Item;
class Header extends Component {
  constructor(props,context) {
    super(props,context);
    this.state={
      accountName: "",
      passWordModal: false,
      visible:false
    };
  }

  // 路由跳转
  goToHash = (pathname, state) => {
    this.context.router.push({
      pathname,
      state
    });
    // this.context.router.goBack();
  };

  // 点击用户选项
  clickUser(e) {
    const that = this;
    console.log(e.key);
    if(e.key==="user:1"){
      Modal.confirm({
        title: '提示',
        content: '您是否确认要退出登录',
        onOk() {
          sessionStorage.removeItem("loginData");
          that.goToHash('/');
        }
      });
    } else {
      this.setState({
        passWordModal: true,
      })
    }
  };
  // 取消修改密码
  setPassWordVisible(passWordModal){
    const {resetFields} = this.props.form;
    resetFields()
    this.setState({ passWordModal });
  }
  // 确认密码
  setPassWordOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log(values);
      if (values.newPassword !== values.confirmPassword ) {
        message.warning('新密码输入不一样，请重新输入')
        return
      }
      this.changePassword(values)
    });
  }
  changePassword = (values) => {
    let params = {
      userId: loginData.jfpAccount.acUuid,
      originalPwd: values.oldPassword,
      newPwd: values.newPassword
    }
    Request.post("",{
      cmd:"updPwd",
      value: {
        data:{
          ...params
        }
      },
      bool:true
    })
    .then((rest)=>{
      if(rest.code===1000){
        message.success('修改成功！');
        const {resetFields} = this.props.form;
        resetFields()
        this.setState({ passWordModal: false });
      }else{
        message.warning(rest.msg);
      }
    })
    .catch((err)=>{
      message.warning(err.msg);
    })
  }
  // 点击主题选项
  clickTheme(e) {
    console.log(e.key);
  };
  handleVisibleChange(flag) {
    this.setState({ visible: flag });
  };
  componentDidMount() {
    //console.log(this.props);
    // const loginData = JSON.parse(sessionStorage.getItem("loginData"));
    console.log(loginData)
    // const loginData = {}
    // this.setState({
    //   accountName: loginData.jfpAccount.acName
    // });
  }

  render() {
    const { getFieldProps } = this.props.form;
    const menu = (<Menu onClick={this.clickUser.bind(this)}>
                  <Menu.Item key="user:1">退出登录</Menu.Item>
                  <Menu.Item key="user:2">修改密码</Menu.Item>
                </Menu> 
                )
    return (
      <div className="header">

        <div className="header-left">
          <div className="div-1">
            <img src='img/jh@2x.png' alt=""/>
          </div>
          <div className="div-2">
            <p className="p1">执法百事通管理后台</p>
            {/* <p className="p2">Intelligent Decision-making System for Criminal Situation Analy</p> */}
          </div>
        </div>

        <div className="header-right">
          <div className="user-div">
            <Dropdown overlay={menu}>
              <div className="img-wrap">
                <img src='img/avatr.png' alt=""/>
                <span className="autor">{this.state.accountName}</span>
              </div>
            </Dropdown>
            {/* <Menu
              onClick={this.clickUser.bind(this)}
              mode="horizontal"
            >
              <SubMenu title={<div className="submenu-title-div">
                <img src='img/avatr.png' alt=""/>
                <span style={{marginLeft: '15px'}}>{this.state.accountName}</span>
              </div>}
              >
                <Menu.Item key="user:1">退出登录</Menu.Item>
                <Menu.Item key="user:2">修改密码</Menu.Item>
              </SubMenu>
            </Menu> */}
          </div>
        </div>
        <Modal
          title="修改密码"
          width='400'
          wrapClassName="vertical-center-modal"
          visible={this.state.passWordModal}
          onOk={this.setPassWordOk}
          onCancel={() => this.setPassWordVisible(false)}
        >
          <Form horizontal>
            <Row> 
              <FormItem label={"原密码"} labelCol={{span: 6}} wrapperCol={{span: 12}} >
                <Input type="password" placeholder={"请输入原密码"} {...getFieldProps("oldPassword",{
                  initialValue: '',
                  rules: [
                    { required: true, whitespace: true,message: '请输入原密码'},

                  ],
                })}/>
              </FormItem>
            </Row>
            <Row> 
              <FormItem label={"新密码"} labelCol={{span: 6}} wrapperCol={{span: 12}} >
                <Input type="password" placeholder={"请输入新密码"} {...getFieldProps("newPassword",{
                  initialValue: '',
                  rules: [
                    { required: true, whitespace: true,min:6, message: '请输入6位以上新密码' }
                  ],
                })}/>
              </FormItem>
            </Row>
            <Row> 
              <FormItem label={"确认新密码"} labelCol={{span: 6}} wrapperCol={{span: 12}} >
                <Input type="password" placeholder={"请输入确认新密码"} {...getFieldProps("confirmPassword",{
                  initialValue: '',
                  rules: [
                    { required: true, whitespace: true, message: '请输入确认新密码' }
                  ],
                })}/>
              </FormItem>
            </Row>
          </Form>
        </Modal>

      </div>
    );
  }
}

//添加router至this.context
Header.contextTypes = {
  router: Object
};
Header = Form.create()(Header)
export default Header;