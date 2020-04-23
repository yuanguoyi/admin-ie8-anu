import React, { Component } from 'react';
import {Form,Select,message,Row,TreeSelect,Input,Col,Button,Card} from 'antd'
import '@/style/answer.less'
import { timeFormat } from '@/tool/util'
// import secret from "@/tool/secret";
import {baseURLDev,baseURLPro} from '@/tool/api-url'
// require('wangeditor')
import Request from "@/tool/request";
class addQuestion extends Component {
  state = { 
    item: ''
   }
  componentDidMount() {
      let _this = this
      var id = 'editor';
      this.editor = new window.wangEditor(id);
      this.editor.config.uploadImgUrl = process.env.NODE_ENV === 'development' ?  window.global_config.BASE_DEV_URL :  window.global_config.BASE_PRO_URL;
      // 配置自定义参数（举例）
      const loginData = sessionStorage.getItem("loginData");
      let userId = ''
      // let userId = "ac4bc34fcac311e9a7e294de8009f9be";
      if(loginData) userId = JSON.parse(loginData).userId;
      const time=new Date().getTime();
      let data = {
        value:'1'
      }
      this.editor.config.uploadParams = {
        cmd: 'importFile',
        value: JSON.stringify({
          data: secret.Encrypt(JSON.stringify(data),true),
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
      };
      this.editor.config.uploadImgFileName = 'wangEditorFile'
      // 自定义load事件
      this.editor.config.uploadImgFns.onload = function (resultText, xhr) {
        // resultText 服务器端返回的text
        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
        
        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
        var originalName = _this.editor.uploadImgOriginalName || '';  
        var imgUrl = JSON.parse(resultText)
        // 如果 resultText 是图片的url地址，可以这样插入图片：
        var url = imgUrl.data.url
        _this.editor.command(null, 'insertHtml', '<img src="' + url + '" alt="' + originalName + '" style="max-width:100%;"/>');
        // 如果不想要 img 的 max-width 样式，也可以这样插入：
        // editor.command(null, 'InsertImage', resultText);
      }
      this.editor.config.menus =  [
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        '|',
        'img',
        '|',
        'undo',
        'redo',
        'fullscreen'
    ];
    this.editor.create();
    let questionItem =JSON.parse(sessionStorage.getItem('questionItem'))
    this.setState({
      item:questionItem
    })
  }
  cancel = () =>{
    this.props.history.push('/home/question')
  }
  saveInfo = () => {
    let content = this.editor.$txt.formatText()
    let id = this.state.item.qsUuid
    let text = this.editor.$txt.text();
    if (text == '') {
      message.error('请输入回答内容')
      return 
    } else {
      Request.post("",{
        cmd:"saveAnswer",
        value: {
          data:{
            qsUuid: id,
            asHtml: content
          }
        },
        bool:true,
      })
      .then((res)=>{
        if(res.code === 1000){
          message.success('操作成功');
          this.props.history.push('/home/question')
        } else {
          message.error(res.msg);
        } 
      })
      .catch((msg)=>{
        message.error(msg);
      })
    }
  }
  render() { 
    const {item} = this.state
    return ( 
      <div className="contain-wrap answer-info question">
        <div>
          <p className="title">问题</p>
          <Row className="item">
            <Col span={6}>类型：{item.qsTypeName}</Col>
            <Col span={6}>提问用户：发生的反对</Col>
          </Row>
          <Row className="item">
            <Col span={6}>部门岗位：{item.qsDeptName}</Col>
            <Col span={6}>提问时间：{timeFormat(item.qsCdate)}</Col>
          </Row>
          <Row className="item">
            <Col span={12}>问题：{item.qsTitle}</Col>
          </Row>
          <Row className="item">
            <Col span={24} className="account">
              <p className="tit" style={{width:'70px'}}>问题描述：</p>
              <p>
                {item.qsHtml}
              </p>
            </Col>
          </Row>
          <p className="title">回答</p>
          <div className="answer-editor">
            <div id='editor'style={{height:'300px',maxHeight:'300px'}} contentEditable="true"></div>
          </div>
          <div className="newxStep">
            <Button style={{marginRight: '20px'}} onClick={this.cancel}>取消</Button>
            <Button type="primary" onClick={this.saveInfo}>保存</Button>
          </div>
        </div>
      </div>
     );
  }
}
 
export default addQuestion;