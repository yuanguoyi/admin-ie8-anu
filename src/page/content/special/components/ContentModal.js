import React, { Component } from 'react'
import {Modal,Table,Row,Col,Form,Select,DatePicker,Input,Button,message,TreeSelect} from 'antd'
import Request from "@/tool/request"
import { timeFormat } from '@/tool/util'

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let newTreeData = []
class ContentModal extends Component {
  state = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    selectedRowKeys: [],
    resourceData: [],
    rsType: [],
    fiterValue: '',
    treeData: []
  }
  componentDidMount () {
    const {pageSize} = this.state;
    this.getDataList({currentPage:1, pageSize})
    this.getResType()
  }
  //树处理
  tree = (array) =>{
    array.map((item, index) => {
      item['label'] = item.codeName;
      item['value'] = item.codeUuid;
      delete item['title'];
      if (item.children) {
        this.tree(item.children);
      }
    })
    newTreeData = [...array]
  }
   // 获取类型
   getResType = (codeCharCode) => {
    const that = this;
    Request.post("",{
      cmd:"searchSubjectType",
      value: {
        data:{
          
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code === 1000){
          this.tree(rest.data)
          this.setState({
            treeData: newTreeData
          })
        }
      })
      .catch((msg)=>{
      })
  };
  getDataList = (value) => {
    this.setState({ loading: true });
    Request.post("",{
      cmd: "searchSubjectAll",
      value: {
        data: {
          ...value, 
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        this.setState({
          resourceData: res.data.data,
          total: res.data.totalCount,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      } 
    })
    .catch((msg)=>{
      
    })
  }
  addResource = () => {
    const {...modalProps} = this.props;
    const selectedKeys = modalProps.selectedKeys
    let  selectedRowKeys = this.state.selectedRowKeys
    let newArray = []
    selectedRowKeys.forEach((e,i)=>{
      if (selectedKeys.indexOf(e) == -1){
         newArray.push(e)
      }
    })
    const stringKey = newArray && newArray.join(',')
    const {specialId} = modalProps
    if (newArray.length == 0) {  
      message.error('请选择内容')
      return false
    }
    Request.post("",{
      cmd: "addSubjectSubList",
      value: {
        data: {
          resUuid: stringKey,
          subUuid: specialId,
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        const {...modalProps} = this.props
        const {onOk} =modalProps
        onOk()
        message.success('添加成功')
      } else {
        this.setState({
          loading: false
        })
      } 
    })
    .catch((msg)=>{

    })
  }
  handleOk = () => {
    this.addResource()
   }
   handleCancel = () => {
    const {onCancel} = this.props
    onCancel()
   }
   clickSearch = (e) => {
    if(e){
      e.preventDefault();
    }
    const {pageSize} = this.state;
    let {form} = this.props;
    let obj = form.getFieldsValue();
    const {rangeTime} = obj
    if(rangeTime){
      obj.ssParm1 = timeFormat(new Date(rangeTime[0]).getTime());
    }
    if(rangeTime){
      obj.ssParm2 = timeFormat(new Date(rangeTime[1]).getTime());
    }
    delete(obj[rangeTime])
    this.setState({
      fiterValue: obj
    })
    console.log('收到表单值：', obj);
    this.getDataList({currentPage:1, pageSize,...obj})
   }
   // 点击清除
  clickCancel = ()=> {
    const {resetFields} = this.props.form;
    resetFields();
    this.setState({
      currentPage:1
    })
    this.clickSearch();
  };
  render() { 
    const {...modalProps} = this.props;
    const selectedKeys = Array.from(new Set(modalProps.selectedKeys))
    const { getFieldProps } = this.props.form;
    const {treeData} = this.state
    let _this = this
    const columns = [
      {
        title: '序号',
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '类型',
        dataIndex: 'srRestypeName',
        align: 'center',
      },
      {
        title: '标题',
        dataIndex: 'ssTitle',
        align: 'center',
      },
      {
        title: '上传时间',
        dataIndex: 'ssCdate',
        align: 'center',
      },
      {
        title: '发布状态',
        dataIndex: 'ssState',
        align: 'center',
        render:(text,record) => {
          if(text == 0) {
            return '未发布'
          } else if(text == 1){
            return '已发布'
          }
        }
      }
    ]
    let pagination = {
      // showSizeChanger: true,
      showQuickJumper: true,
      current: this.state.currentPage,
      total: this.state.total,
      pageSize: this.state.pageSize,
    }
    let {selectedRowKeys,resourceData,fiterValue} = this.state
    console.log(selectedKeys)
    const rowSelection = {
      selectedRowKeys,
      onChange(selectedRowKeys){
        _this.setState({ selectedRowKeys });
      },
      getCheckboxProps: record => ({
        disabled:(selectedKeys.indexOf(record.srResuuid)>-1 ? true:false),
      })
    };
    const listProps = {
      rowSelection,
      dataSource: resourceData,
      pagination,
      // loading: this.state.loading,
      onChange(page) {
        _this.setState({
          currentPage: page.current,
          size: page.pageSize,
        })
        _this.getDataList({
          currentPage: page.current,
          size: page.pageSize,
          ...fiterValue
        })
      },
    }
    return ( 
      <Modal {...modalProps} onOk={this.handleOk} onCancel={this.handleCancel} width={850} wrapClassName="special-content-modal">
        <Row>
          <Form horizontal className="top-search-form" onSubmit={this.clickSearch}>
            <Col span={5}>
             <FormItem label='类型' labelCol={{span: 6}} wrapperCol={{span: 15}}>
              <TreeSelect
               placeholder="请选择类型"
               {...getFieldProps('rsType')} 
                dropdownStyle={{maxHeight: 400,maxWidth:140, overflow: 'auto'}}
                treeData={treeData} 
              />
             </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label='上传时间' labelCol={{span: 7}} wrapperCol={{span: 17}}>
                <RangePicker {...getFieldProps('rangeTime')} style={{ width: 184 }}  />
              </FormItem>
            </Col>
            <Col span={6} style={{marginLeft:'45px'}}>
              <FormItem label='标题' labelCol={{span: 6}} wrapperCol={{span: 15}}>
                <Input placeholder="请输入标题" {...getFieldProps('ssTitle')}/>
              </FormItem>
            </Col>
            <Col span={4}>
              <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>搜索</Button>
              <Button onClick={this.clickCancel.bind(this)}>清除</Button>
            </Col>
          </Form>
        </Row>
        <Table
          {...listProps}
          pagination={{
            ...listProps.pagination,
            showTotal: total => `总共 ${total} 项`,
          }}
          columns={columns}
          rowKey={record => record.srResuuid}
        />
      </Modal>
     );
  }
}
ContentModal = Form.create()(ContentModal);
export default ContentModal;