import React, { Component } from 'react'
import {Form,Select,message,Row,TreeSelect,Input,Col,Button,Card,Radio} from 'antd'
import '@/style/answer.less'
import Request from "../../../tool/request";
// import secret from "@/tool/secret";
import {baseURLDev,baseURLPro} from '@/tool/api-url'
// require('wangeditor')
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let newArray = []
let selectNewId = []
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class BasicInfo extends Component {
  state = { 
    step: 0,
    title: '1.基本信息',
    treeData: [],
    selsetId: '',
    rsType: [],
    value: '2',
    item: {}, // 列表数据
    iconLoading: false
   }
   componentDidMount() {
    const codeCharCode = "/TypeState/queType";
    var _this = this
    this.getResType(codeCharCode)
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
  const answerId = type == 1 ? this.props.location.query.id : ''
    if (type == 1) {
      this.getAnswerDetail(answerId)
    }
    //this.getViewObj(answerId,type)
   }
   getAnswerDetail(id) {
    Request.post("",{
      cmd:"searchAnsweringQuestionsDetails",
      value: {
        data: {
          qsUuid: id,  
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        let urReleasetype = this.props.location.query.urReleasetype
        this.setState({
          item: res.data,
          selsetId: res.data.qsDept,
          value: urReleasetype
        })
        this.editor.$txt.append(res.data.elAnswer.asHtml)
      } else {
      } 
    })
  }
   // 获取答疑类型
   getResType = (codeCharCode) => {
    const that = this;
    Request.post("",{
      cmd:"getDictComBoboxByCode",
      value: {
        data:{
          codeCharCode
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code === 1000){
          this.setState({
            rsType: rest.data
          })
        }
      })
      .catch((msg)=>{
      })
  };
   //树处理
   tree = (array) =>{
    array.map((item, index) => {
      item['label'] = item.title;
      item['value'] = item.key;
      if(item['checked']){
        selectNewId.push(item.key)
      }
      delete item['title'];
      delete item['key'];
      if (item.children) {
        this.tree(item.children);
      }
    })
    newArray = [...array]
  }
   // 获取范围
   getViewObj(id,type){
    console.log(id,type)
    Request.post("",{
      cmd:"getViewObj",
      value: {
        data:{
          rsUuid: id,       //  currentPage:1,size:10
          resourceType: '2'
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        this.tree(res.data)
        if (type == 0) {
          this.setState({
            treeData: newArray,
            selsetId: []
          })
        } else {
          this.setState({
            treeData: newArray,
            selsetId: selectNewId
          })
        }
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
   }
   handChange = (e) => {
    this.setState({
      value: e.target.value,
    });
   }
   saveInfo = (e) => {
    if(e){
      e.preventDefault();
    }
    
    const type = this.props.location.query.type
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      let htmlContent =  this.editor.$txt.html()
     let htmlText = this.editor.$txt.formatText()
     console.log(htmlContent)
      let {form} = this.props
      let obj = form.getFieldsValue();
      let urReleasetype = this.state.value
      if (htmlText =='') {
        message.warning('请输入回答内容')
        return false
      }
      let item = this.state.item
      let newObj = ''
      if (type == 1) {
        newObj = {...obj,...{urReleasetype:urReleasetype},...{qsUuid: item.qsUuid},...{asHtml:htmlContent}}
      } else {
        newObj = {...obj,...{urReleasetype:urReleasetype},...{asHtml:htmlContent}}
      }
      console.log(newObj)
      this.handleSave(newObj)
    });
  }
  cancel = () =>{
    this.props.history.push('/home/answer')
  }
  handleSave = (value) => {
    const type = this.props.location.query.type
    this.setState({
      iconLoading: true
    })
    Request.post('',{
      cmd: type == 0 ? "savaQuestionAndanswer" : 'updateQuestionAndanswer',
      value: {
        data: {
          ...value, 
        }
      },
      bool:true,
    }).then((res)=> {
      if(res.code === 1000){
        this.props.history.push('/home/answer')
        this.setState({
          iconLoading: false
        })
        message.success('保存成功')
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  //  onChange = (value) => {
  //   let _this = this
  //   _this.setState({ selsetId: value });
  // }
  render() { 
    const typeList = []
    const fileData = {
      uploadNum: 2
    }
    const { getFieldProps } = this.props.form
    const {treeData,rsType,item} = this.state
    const tProps = {
      treeData,
      value: this.state.selsetId,
      multiple: true,
      treeCheckable: true,
      onChange: this.onChange,
      showCheckedStrategy: SHOW_PARENT,
    };
    return ( 
      <div className="answer-info contain-wrap">
        <div>
        <p className="title">问题</p>
        <Form horizontal >
          <Row>
            <Col span={6}>
              <FormItem label="类型" labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <Select placeholder='请选择类型' {...getFieldProps('qsType',{
                  initialValue: item.qsType,
                  rules: [
                    { required: true, whitespace: true, message: '请选择类型' }
                  ],
                })}>
                  {rsType.map((v, i) => <Select.Option value={v.codeUuid} key={i}>{v.codeName}</Select.Option>)}
                </Select>
              </FormItem>
            </Col>
            {/* <Col span={6}>
              <FormItem label="范围" labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <TreeSelect
                  {...tProps}
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                />
              </FormItem>
            </Col> */}
          </Row>
          
          <Row>
            <Col span={18}>
              <FormItem label="问题" labelCol={{span: 2}} wrapperCol={{span: 22}}>
                <Input placeholder="请输入问题" {...getFieldProps('qsTitle',{
                  initialValue: item.qsTitle,
                  rules: [
                    { required: true, whitespace: true, message: '请输入问题' }
                  ],
                })} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="可见范围" labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <RadioGroup onChange={this.handChange} value={this.state.value}>
                  <Radio key="1" value={'1'}>省局</Radio>
                  <Radio key="2" value={'2'}>本单位</Radio>
                  {/* <Radio key="3" value={'3'}>其他单位</Radio> */}
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <FormItem label="问题描述" labelCol={{span: 2}} wrapperCol={{span: 22}}>
                <Input type="textarea" maxLength={300} rows={4} placeholder="请输入问题描述300字以内" {...getFieldProps('qsHtml',{
                    initialValue: item.qsHtml,
                  })} />
              </FormItem>
            </Col>
          </Row>
          <p className="title">回答</p>
          <div className="answer-editor">
            <div id='editor'style={{height:'400px',maxHeight:'400px'}} contentEditable="true"></div>
          </div>
          <div className="newxStep">
            <Button style={{marginRight: '20px'}} onClick={this.cancel}>取消</Button>
            <Button type="primary" loading={this.state.iconLoading} onClick={this.saveInfo}>保存</Button>
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