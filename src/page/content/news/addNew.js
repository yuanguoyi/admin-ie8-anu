import React, { Component } from 'react'
import {Form,Select,message,Row,TreeSelect,Input,Col,Button,Card} from 'antd'
import '@/style/answer.less'
import Request from "../../../tool/request";
// import secret from "@/tool/secret";
import {baseURLDev,baseURLPro} from '@/tool/api-url'
// require('wangeditor')
const FormItem = Form.Item;
let newArray = []
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class BasicInfo extends Component {
  state = { 
    step: 0,
    title: '1.基本信息',
    treeData: [],
    selsetId: '',
    rsType: [],
    item: {}, // 列表数据
    iconLoading: false,
   }
   componentDidMount() {
    var id = 'editor';
    var _this = this
    this.editor = new wangEditor(id);
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
      // value: JSON.stringify({
      //   data: secret.Encrypt(JSON.stringify(data),true),
      //   userId,
      //   fromSource:1,
      //   osType:1,
      //   versionCode:"10001",
      //   version:"1",
      //   timeStamp : time,
      //   hashCode : secret.MD5(time),
      //   appId:"B55AB05AECBC43E6B84B3240AF3E3316",
      //   deviceId:""
      // })
    };
    this.editor.config.uploadImgFileName = 'wangEditorFile'
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
    this.editor.create();
    const type = this.props.location.query.type
    const answerId = this.props.location.query.id
    if (type == 1) {
      //this.getAnswerDetail(answerId)
      const item = JSON.parse(sessionStorage.getItem('newsItem'))
      this.editor.$txt.append(item.nsHtml)
    console.log(item)
    }
   }



  //  getAnswerDetail(id) {
  //   Request.post("",{
  //     cmd:"searchAnsweringQuestionsDetails",
  //     value: {
  //       data: {
  //         qsUuid: id,  
  //       }
  //     },
  //     bool:true
  //   })
  //   .then((res)=>{
  //     if(res.code === 1000){
  //       this.setState({
  //         item: res.data,
  //         selsetId: res.data.qsDept
  //       })
  //       this.editor.$txt.append(res.data.elAnswer.asHtml)
  //     } else {
  //     } 
  //   })
  // }
   saveInfo = (e) => {
    const loginData = JSON.parse(sessionStorage.getItem("loginData"));
    const userId = loginData.userId
    if(e){
      e.preventDefault();
    }
    const type = this.props.location.query.type
    const id = this.props.location.query.id
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      let htmlContent =  this.editor.$txt.html();
      let htmlText = this.editor.$txt.formatText()
      console.log(htmlText)
      if (htmlText =='') {
        message.warning('请输入新闻内容')
        return false
      }
      let {form} = this.props
      let obj = form.getFieldsValue();
      let newObj = ''
      if (type==0) {
        newObj = {...obj,...{nsHtml:htmlContent},...{userId:userId}}
      } else {
        newObj = {...obj,...{nsHtml:htmlContent},...{nsUuid:id}}
      }
      console.log(newObj)
      this.handleSave(newObj)
    });
  }
  cancel = () =>{
    this.props.history.push('/home/news')
  }
  handleSave = (value) => {
    const type = this.props.location.query.type
    this.setState({
      iconLoading: true
    })
    Request.post('',{
      cmd: type == 0 ? "saveNews" : 'updateNews',
      value: {
        data: {
          ...value, 
        }
      },
      bool:true,
    }).then((res)=> {
      if(res.code === 1000){
        this.setState({
          iconLoading: false
        })
        this.props.history.push('/home/news')
        message.success('保存成功')
      } else {
        message.error(res.msg);
        this.setState({
          iconLoading: true
        })
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
   onChange = (value) => {
    let _this = this
    _this.setState({ selsetId: value });
  }
  render() { 
    const { getFieldProps } = this.props.form
    const item = sessionStorage.getItem('newsItem') ? JSON.parse(sessionStorage.getItem('newsItem')) : {}
    //console.log(item)
    return ( 
      <div className="answer-info contain-wrap">
        <div>
        <Form horizontal style={{padding: '20px 0px 0px 20px'}}>
          <Row >
            <Col span={6}>
              <FormItem label="新闻标题" labelCol={{span: 5}} wrapperCol={{span: 15}}>
                <Input placeholder="请输入新闻标题" maxLength={30} {...getFieldProps('nsTitle',{
                  initialValue: item.nsTitle,
                  rules: [
                    { required: true, whitespace: true, message: '请输入新闻标题' }
                  ],
                })} />
              </FormItem>
            </Col>
          </Row>
          {/* <Row>
            <Col span={6}>
              <FormItem label="记者" labelCol={{span: 5}} wrapperCol={{span: 15}}>
                <Input placeholder="请输入记者" maxLength={30} {...getFieldProps('qsTitle',{
                  initialValue: item.qsTitle,
                  rules: [
                    { required: false, whitespace: true, message: '请输入记者' }
                  ],
                })} />
              </FormItem>
            </Col>
          </Row> */}
          <p className="title">正文</p>
          <div className="answer-editor">
            <div id='editor'style={{height:'400px',maxHeight:'400px'}} contentEditable="true"></div>
          </div>
          <div className="newxStep">
            <Button style={{marginRight: '20px'}} onClick={this.cancel}>取消</Button>
            <Button type="primary" onClick={this.saveInfo} loading={this.state.iconLoading}>发布</Button>
          </div>
          </Form> 
        </div>
      </div>
     );
  }
}
BasicInfo = Form.create()(BasicInfo);
// function mapStateToProps(state) {
//   return {
//     rsType: state.filterData.rsType,
//   }
// }
export default BasicInfo;