import React, { Component } from 'react'
import {Form,Select,message,Row,TreeSelect,Input,Col,Button,Card,Radio} from 'antd'
import Upload from '@/components/Upload/Upload'
import '@/style/resources.less'
import Request from "@/tool/request";
import Content from './components/specialContent'
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
    title: '1.专题信息',
    treeData: [],
    selsetId: '',
    rsType: [],
    specialId: '', // 专题id
    resourcesList: '', // 资源列表
    value: '', // 范围
    uploadImg: '',// 上传图片
    editUp: false,
    radioValue:'1',
    time: 0,
    rsImg: [],
    iconLoading: false,
   }
   componentDidMount(){
    const specialItem = sessionStorage.getItem('specialItem')
    const item = specialItem ? JSON.parse(specialItem) : {}
    console.log(item)
    if (item.subImg) {
      this.setState({
        uploadImg:item.subImg,
        rsImg: [{
          uid: Math.random(),
          status: 'done',
          url: item.subImg,
        }]
      })
    } else {
      this.setState({
        rsImg: []
      })
    }
    if (item.subState){
      this.setState({
        radioValue:item.subState
      })
    }
    editResourceId = item.subUuid
    const type = this.props.location.query.type
    const id = type == 1 ? this.props.location.query.id : ''
    this.setState({
      selsetId: item.subDept
    })
    this.getViewObj(id,type)
   }
   changeRadio = (e) => {
    this.setState({
      radioValue: e.target.value,
    });
  }
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
          resourceType: '3'
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
   saveInfo = (e) => {
    if(e){
      e.preventDefault();
    }
    const specialItem = sessionStorage.getItem('specialItem')
    const item = specialItem ? JSON.parse(specialItem) : {}
    const radioValue = this.state.radioValue
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      let {form} = this.props
      let obj = form.getFieldsValue();
      let newObj = ''
      let uploadImg = this.state.uploadImg
      let fileName = extname(uploadImg)
      let isBase64
      const type = this.props.location.query.type
      if(uploadImg== ''){
        message.error('请上传图片')
        return 
      }
      if (type==1) {
        if (fileName == 'jpg' || fileName == 'png' || fileName == 'jpeg' || fileName == 'JPG' ) {
          isBase64 = 1
        } else {
          isBase64 = 2
        }
      }
      if (isBase64==1){
        newObj = {...obj,...{subUuid: item.subUuid},...{subState:radioValue}}
      } else {
        newObj = {...obj,...{subUuid: item.subUuid},...{subImg: uploadImg},...{subState:radioValue}}
      }
      console.log(newObj)
      this.handleSave(newObj)
    });
  }
  
  changeStep = () => {
    this.setState({
      step: 0,
      title: '1.专题信息',
      editUp: true
    })
  }
  backList =() => {
    this.props.history.push('/home/special')
  }
  cancel = () =>{
    this.props.history.push('/home/special')
  }
  handleSave = (value) => {
    let editUp = this.state.editUp
    let addType = this.props.location.query.type 
    let resourceType = addType == 0 && !editUp ? 'saveSubject' : 'updateSubject' 
    this.setState({
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
        this.setState({
          step: 1,
          title: '2.专题内容',
          specialId: addType == 0 && !editUp ? res.data : editResourceId,
          iconLoading: false
        })
        if (addType == 0 && !editUp ) {
          let newValue = {...value,...{subUuid:res.data}}
          sessionStorage.setItem('specialItem',JSON.stringify(newValue))
        } else {
          sessionStorage.setItem('specialItem',JSON.stringify(value))
        }
        
      } else {
        message.error(msg);
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
    const _this = this
    const { getFieldProps } = this.props.form
    const { step,title,treeData,rsImg,specialId} = this.state
    const specialItem = sessionStorage.getItem('specialItem')
    const item = specialItem ? JSON.parse(specialItem) : {}
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
    const tProps = {
      value: this.state.selsetId,
      treeData,
      multiple: true,
      treeCheckable: true,
      onChange: this.onChange,
      showCheckedStrategy: SHOW_PARENT,
    };
    const modal = {
      specialId: specialId,
      changUp(){
        _this.changeStep()
      },
      backList () {
        _this.backList()
      }
    }
    return ( 
     <div className="resources contain-wrap">
      <div className="basic-info">
        <Card title={title} style={{width:'100%',minHeight:'800px',border:'none'}}>
        {
          step === 0 ?
          <Form horizontal >
              <Row>
                <Col span={6}>
                  <FormItem label="专题名称" labelCol={{span: 6}} wrapperCol={{span: 15}}>
                    <Input placeholder="请输入专题" {...getFieldProps('subTitle',{
                      initialValue: item.subTitle,
                      rules: [
                        { required: true, whitespace: true, message: '请输入专题' }
                      ],
                    })} />
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
                  <FormItem label="是否发布" labelCol={{span: 2}} wrapperCol={{span: 22}}>
                    <RadioGroup onChange={this.changeRadio} value={this.state.radioValue}>
                      <Radio key="1" value={'1'}>是</Radio>
                      <Radio key="0" value={'0'}>否</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row>
              </Row>
              {/* <Row>
                <FormItem label="单位" labelCol={{span: 6}} wrapperCol={{span: 15}}>
                  <Input placeholder="请输入单位" {...getFieldProps('company',{
                      initialValue: '',
                    })} />
                </FormItem>
              </Row> */}
              <Row>
                <Col span={18}>
                  <FormItem label="专题封面" labelCol={{span: 2}} wrapperCol={{span: 15}} className="specialImg">
                    <Upload {...fileData}/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={18}>
                  <FormItem label="专题简介" labelCol={{span: 2}} wrapperCol={{span: 22}}>
                    <Input type="textarea" maxLength={300} rows={4} placeholder="请输入简介300字以内" {...getFieldProps('subDescribe',{
                        initialValue: item.subDescribe,
                      })} />
                  </FormItem>
                </Col>
              </Row>
              <Row style={{textAlign:'right',margin:'10px 10px 0px 0px'}}>
                <Button style={{marginRight: '20px'}} onClick={this.cancel}>取消</Button>
                <Button type="primary" onClick={this.saveInfo} loading={this.state.iconLoading}>下一步</Button>
              </Row>
            </Form> 
            : <Content {...modal}/>
           }
        </Card>
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