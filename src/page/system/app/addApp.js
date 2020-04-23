import React, { Component } from 'react'
import {Form,Row,Col,Input,Select,Button,message} from 'antd'
import Upload from '@/components/Upload/appUpload'
import '@/style/answer.less'
import Request from "../../../tool/request";
const FormItem = Form.Item;
class Addapp extends Component {
  state = { 
    uploadApk: [],
   }
  cancel = () => {
    this.props.history.push('/home/app')
  }
  save = () => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      let {form} = this.props
      let apk = this.state.uploadApk
      if(apk=='') {
        message.error('请上传文件')
        return false
      }
      let obj = form.getFieldsValue();
      let newObj = {...obj,...{avUrl:apk},...{avState:1}}
      this.handleSave(newObj)
    })
  }
  handleSave = (value) => {
    console.log(value)
    Request.post('',{
      cmd: 'saveElAppversion',
      value: {
        data: {
          ...value, 
        }
      },
      bool:true,
    }).then((res)=> {
      if(res.code === 1000){
        message.success('发布成功')
        this.props.history.push('/home/app')
      }
    })
    .catch((msg)=>{
      message.error(msg);
    })   
  }
  render() { 
    const { getFieldProps } = this.props.form
    const uploadApk = this.state.uploadApk
    let _this = this
    let rsImg = ''
    const updateType = [
      {codeUuid:'0',codeName:'非强制更新'},
      {codeUuid:'1',codeName:'强制更新'}
    ]
    const UploadData = {
      uploadNum: 1,
      uploadFile: uploadApk,
      onRemoveVideo() {
        // _this.setState({
        //   uploadFile: []
        // })
      },
      uploadImg(apk){
        _this.setState({
          uploadApk: apk
        })
      },
      uploadType:'apk'
    }
    // const UploadData = {
    //   uploadNum: 1,
    //   uploadImg(apk){
    //     _this.setState({
    //       uploadApk: apk
    //     })
    //   },
    //   uploadType:'apk'
    // }
    return ( 
      <div className="answer-info contain-wrap">
        <div> 
          <p className="title" style={{marginBottom:'10px'}}>新版本发布</p>
          <Form horizontal>
            <Row>
              <Col span={6}>
                <FormItem label="版本号" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                  <Input placeholder="请输入版本号" {...getFieldProps('avName',{
                    initialValue: '',
                    rules: [
                      { required: true, whitespace: true, message: '请输入版本号' }
                    ],
                  })} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="上传文件" labelCol={{span: 6}} wrapperCol={{span: 18}} className="uploadApp">
                  <Upload {...UploadData}/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="更新方式" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                    <Select placeholder='请选择更新方式' {...getFieldProps('avFlag',{
                      initialValue: '',
                      rules: [
                        { required: true, whitespace: true, message: '请选择更新方式' }
                      ],
                    })}>
                      {updateType.map((v, i) => <Select.Option value={v.codeUuid} key={i}>{v.codeName}</Select.Option>)}
                    </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="更新说明" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                  <Input type="textarea" rows={4} placeholder="请输入更新说明" {...getFieldProps('avConent',{
                    initialValue: '',
                    rules: [
                      { required: false, whitespace: true, message: '请输入更新说明' }
                    ],
                  })} />
                </FormItem>
              </Col>
            </Row>
            <Row style={{marginLeft:'40px'}}>
              <Button onClick={this.cancel} >取消</Button>
              <Button type="primary" onClick={this.save} style={{marginLeft:'20px'}}>保存</Button>
            </Row>
          </Form>
        </div>
      </div>
     );
  }
}
 Addapp = Form.create()(Addapp)
export default Addapp;
