import React, { Component } from 'react'
import {Form,Select,message,Row,TreeSelect,Input,Col,Button,Card,Radio,Cascader } from 'antd'
import Upload from '@/components/Upload/Upload'
// import VideoUpload from '@/components/Upload/appUpload'
import VideoUpload from '@/components/Upload/videoUpload'
import '@/style/resources.less'
import Request from "@/tool/request";
import Document from './document'
import {extname} from '@/tool/util'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let newArray = []
let selectNewId = []
let editResourceId = ''
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class BasicInfo extends Component {
  state = { 
    step: 0,
    title: '1.基本信息',
    treeData: [],
    selsetId: [],
    rsType: [],
    resourcesId: '', // 资源id
    resourcesList: '', // 资源列表
    value: '2', // 范围
    uploadImg: '',// 上传图片
    editUp: false,
    time: 0,
    rsImg: [],
    isDisabled: false,
    iconLoading: false,
    resourceTypeValue: '1',
    uploadVideo: '',
    uploadFile:[],
    editType: '0',
    rsTypeTwo: [], // 二级分类
    options:[],
    defaultValue: [],
    rsOneType: '', // 一级分类
   }
   componentDidMount(){
    const rsItem = sessionStorage.getItem('rsItem')
    const item = rsItem ? JSON.parse(rsItem) : {}
    const {...basicProps} = this.props
    const type = basicProps.type
    const rsRealType = item.rsRealType
    if (item.rsImg && rsRealType == 1) {
      this.setState({
        uploadImg:item.rsImg,
        rsImg: [{
          uid: Math.random(),
          status: 'done',
          url: item.rsImg,
        }],
        resourceTypeValue: '1'
      })
    } else if (item.rsPath && rsRealType == 2) {
      this.setState({
        uploadVideo: item.rsPath,
        uploadFile: [{
          uid: Math.random(),
          name:item.rsPath,
          status: 'done',
          url: item.rsPath,
        }],
        resourceTypeValue: '2'
      })
    } else {
      this.setState({
        rsImg: [],
        uploadVideo:''
      })
    }
    if (item.urReleasetype){
      this.setState({
        value:item.urReleasetype 
      })
    }
    let resTypeValue = []
    if (item.rsType) {
      resTypeValue.push(item.rsType)
      if(item.rsSubType){
        resTypeValue.push(item.rsSubType)
      }
      this.setState({
        defaultValue: resTypeValue
      })
    }
    let parms ={
      codeCharCode:'/TypeState/resType',
      nextLevel:'1'
    }
    this.getResType(parms)
   }
  //  componentWillReceiveProps (nextProps) {
  //   const {...basicProps} = this.props
  //   const id = basicProps.id
  //    if (id!==nextProps.id){
  //      alert()
  //    }
  //   console.log(nextProps)
  //  }
   // 获取一级类型
   getResType = (parms) => {
    Request.post("",{
      cmd:"getDictComBoboxByCode",
      value: {
        data:{
          ...parms
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code === 1000){
          this.tree(rest.data)
          this.setState({
            options: newArray,
          })
        }
      })
      .catch((msg)=>{
      })
  };
   //树处理
   tree = (array) =>{
    array.map((item, index) => {
      item['label'] = item.codeName;
      item['value'] = item.codeUuid;
      delete item['codeName'];
      delete item['codeUuid'];
      if (item.children) {
        this.tree(item.children);
      }
    })
    newArray = [...array]
  }
   // 获取范围
   saveInfo = (e) => {
    if(e){
      e.preventDefault();
    }
    const {...basicProps} = this.props
    const type = basicProps.type
    const resourceTypeValue = this.state.resourceTypeValue
    const uploadVideo = this.state.uploadVideo
    const rsItem = sessionStorage.getItem('rsItem')
    const item = rsItem ? JSON.parse(rsItem) : {}
    editResourceId = item.rsUuid
    console.log(editResourceId)
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      let {form} = this.props
      let obj = form.getFieldsValue();
      let urReleasetype = this.state.value
      let newObj = ''
      let uploadImg = this.state.uploadImg
      let rsImg = this.state.rsImg
      let rsType
      let rsSubType
      let fileName = extname(uploadImg)
      let isBase64
      // if(rsImg== '' && resourceTypeValue=='1'){
      //   message.error('请上传图片')
      //   return 
      // }
      if (resourceTypeValue=='1' && type == 1 ) {
        if (fileName == 'jpg' || fileName == 'png' || fileName == 'jpeg' || fileName == 'JPG' ) {
          isBase64 = 1
        } else {
          isBase64 = 2
        }
      }
      if(uploadVideo == '' && resourceTypeValue=='2'){
        message.error('请上传视频')
        return 
      }
      if(obj.rsType && obj.rsType.length<=0){
        message.error('请选择分类')
        return 
      }
      if (obj.rsType && obj.rsType.length>0){
        rsType = obj.rsType[0]
        rsSubType =  obj.rsType[1]
      }
      if (resourceTypeValue == '1') {
        if (isBase64 == 1) {
          newObj = {...obj,...{urReleasetype:urReleasetype},...{rsUuid: item.rsUuid},...{rsRealType:'1'},...{rsType:rsType},...{rsSubType:rsSubType}}
        } else{
          newObj = {...obj,...{urReleasetype:urReleasetype},...{rsUuid: item.rsUuid},...{rsImg: uploadImg},...{rsRealType:'1'},...{rsType:rsType},...{rsSubType:rsSubType}}
        }
      } else {
        newObj = {...obj,...{urReleasetype:urReleasetype},...{rsUuid: item.rsUuid},...{rsPath: uploadVideo},...{rsRealType:'2'},...{rsType:rsType},...{rsSubType:rsSubType}}
      }
      this.handleSave(newObj)
    });
  }
  
  changeStep = () => {
    const rsItem = sessionStorage.getItem('rsItem')
    const item = rsItem ? JSON.parse(rsItem) : {}
    let  resTypeValue = []
    if (item.rsType) {
      resTypeValue.push(item.rsType)
      if(item.rsSubType){
        resTypeValue.push(item.rsSubType)
      }
      this.setState({
        defaultValue: resTypeValue
      })
    }
    this.setState({
      step: 0,
      title: '1.基本信息',
      editUp: true,
      isDisabled: false,
    })
  }
  cancel = () =>{
    let {cancelAdd} = this.props
    cancelAdd()
  }
  handleSave = (value) => {
    console.log(value)
    let editUp = this.state.editUp
    const resourceTypeValue = this.state.resourceTypeValue
    let {...basicProps} = this.props
    let addType = basicProps.type
    let resourceType = addType == 0 && !editUp ? 'addResource' : 'updResource' 
    this.setState({
      isDisabled: true,
      iconLoading: true
    })
    Request.post('',{
      cmd: resourceType,
      value: {
        data: {
          ...value, 
        }
      },
      bool:true,
    }).then((res)=> {
      if(res.code === 1000){
        if(resourceTypeValue == '2'){
          let {cancelAdd} = this.props
          cancelAdd()
        } else {
          this.setState({
            step: 1,
            title: '2.文档内容',
            resourcesId: addType == 0 && !editUp ? res.data : editResourceId,
            isDisabled: false,
            iconLoading: false
          })
        }
        if (addType == 0 && !editUp ) {
          this.getResourceCatlog(res.data)
          let newValue = {...value,...{rsUuid:res.data}}
          sessionStorage.setItem('rsItem',JSON.stringify(newValue))
        } else {
          this.getResourceCatlog(editResourceId)
          sessionStorage.setItem('rsItem',JSON.stringify(value))
        }
        
      } else {
        message.error(res.msg);
        this.setState({
          isDisabled: false
        })
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  // 获取资源目录
   getResourceCatlog(id) {
     console.log(id)
    Request.post('',{
      cmd:"getResourceDirect",
      value: {
        data: {
          rslsReluuid: id
        }
      },
      bool:true,
    }).then((res)=> {
      if(res.code === 1000){
        let resourcesList = res.data
        if (resourcesList.length > 0) {
          resourcesList.forEach((v,index) => {
            v['showOneBtn'] =  false
            v['isEdit'] = false
            if(!v.children) {
              v['children'] = []
            } else {
              v.children.forEach((k,i)=> {
                k['showTwoBtn'] = false
                k['isEdit'] = false
              })
            } 
            
          })
        }
        this.setState({
          resourcesList: resourcesList
        })
      } else {
        message.error(msg);
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
  selectOneRes = (value) => {
    //alert()
   let rsType = this.state.rsType
   rsType.forEach((v,i)=>{
    if(v.codeUuid == value ){
      this.getTwoResType(v.codeCharCode)
    }
   })
    console.log(value)
    //getTwoResType()
  }
  handChangeType = (e) => {
    this.setState({
      resourceTypeValue: e.target.value,
    });
  }
  onselect = (value) => {
    this.setState({
      rsOneType: value[0],
      rsTypeTwo: value[1],
    })
  } 
  render() {
    const { getFieldProps } = this.props.form
    let {...basicProps} = this.props
    let type = basicProps.type
    const { step,title,treeData,resourcesId,resourcesList,rsImg,isDisabled,resourceTypeValue,uploadVideo,editType,options,defaultValue,value} = this.state
    let _this = this
    const rsItem = sessionStorage.getItem('rsItem')
    const item = rsItem ? JSON.parse(rsItem) : {}
    const fileData = {
      uploadNum: 1,
      rsImg: rsImg,
      onRemove() {
        _this.setState({
          rsImg: [],
          uploadImg:''
        })
      },
      uploadImg(img){
        _this.setState({
          uploadImg: img
        })
      }
    }
    const videoData = {
      uploadVideo: uploadVideo,
      createType: type,
      editType: editType,
      onRemoveVideo() {
        _this.setState({
          uploadFile: [],
          uploadVideo:'',
          editType: 1
        })
      },
      upload (video) {
        _this.setState({
          uploadVideo: video
        })
      }
    }
    return ( 
      <div className="basic-info">
        
        <Card title={title} style={{width:'100%',minHeight:'800px',border:'none'}}>
        {
          step === 0 ? <Form horizontal >
            
          <Row>
            <Col span={18}>
              <FormItem label="资源类型" labelCol={{span: 2}} wrapperCol={{span: 18}} className="restype" >
                <RadioGroup onChange={this.handChangeType} value={this.state.resourceTypeValue}>
                  <Radio key="1" value={'1'}>图文资源</Radio>
                  <Radio key="2" value={'2'}>视频资源</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            {resourceTypeValue == 1 ?
            <Col span={18}>
              <FormItem label="封面" labelCol={{span: 2}} wrapperCol={{span: 15}}>
                <Upload {...fileData}/>
              </FormItem>
            </Col>
            :
            <Col span={18}>
              <FormItem label="视频" labelCol={{span: 2}} wrapperCol={{span: 15}}>
                {/* <Upload {...fileData}/> */}
                {/* <VideoUpload {...UploadData} /> */}
                <VideoUpload {...videoData} />
              </FormItem>
            </Col>
            }
          </Row>
          <Row>
          <Col span={18}>
            <FormItem label="标题" labelCol={{span: 2}} wrapperCol={{span: 22}}>
              <Input placeholder="请输入标题" {...getFieldProps('rsTitle',{
                initialValue: item.rsTitle,
                rules: [
                  { required: true, whitespace: true, message: '请输入标题' }
                ],
              })} />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="资源分类" labelCol={{span: 6}} wrapperCol={{span: 18}} className="restype">
              <Cascader options={options} onChange={this.onselect} placeholder="请选择资源分类" 
              {...getFieldProps('rsType', {
                initialValue: defaultValue,
              })}
              />
              </FormItem>
            </Col>
          </Row>
          <Row>
           <Col span={18}>
              <FormItem label="可见范围" labelCol={{span: 2}} wrapperCol={{span: 18}}>
                <RadioGroup onChange={this.handChange} value={this.state.value}>
                  {
                    window.global_config.IS_PROVIN && <Radio key="1" value={'1'}>省局</Radio>
                  }
                  <Radio key="2" value={'2'}>本单位</Radio>
                  {/* <Radio key="3" value={'3'}>其他单位</Radio> */}
                </RadioGroup>
              </FormItem>
           </Col>
          </Row>
          
          <Row>
            <Col span={18}>
              <FormItem label="简介" labelCol={{span: 2}} wrapperCol={{span: 22}}>
                <Input type="textarea" maxLength={300} rows={4} placeholder="请输入简介300字以内" {...getFieldProps('rsMemo',{
                    initialValue: item.rsMemo,
                  })} />
              </FormItem>
            </Col>
          </Row>
          <Row style={{textAlign:'right',margin:'10px 10px 0px 0px'}}> 
            <Button style={{marginRight: '20px'}} onClick={this.cancel}>取消</Button>
            { resourceTypeValue=='1'?
              <Button type="primary" onClick={this.saveInfo}  loading={this.state.iconLoading} disabled={isDisabled}>下一步</Button>
              : 
              <Button type="primary" onClick={this.saveInfo}  loading={this.state.iconLoading} disabled={isDisabled}>完成</Button>
            }
            
          </Row>
          {/* <div className="newxStep">
            <Button style={{marginRight: '20px'}} onClick={this.cancel}>取消</Button>
            <Button type="primary" onClick={this.saveInfo} disabled={isDisabled}>下一步</Button>
          </div> */}
        </Form> 
        : <Document changeStep={this.changeStep} cancel={this.cancel} resourcesId={resourcesId} resourcesList={resourcesList} range={value}/>
        }
        </Card>
      </div>
     );
  }
}
BasicInfo = Form.create()(BasicInfo);
export default BasicInfo;