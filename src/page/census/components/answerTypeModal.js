import React, { Component } from 'react'
import {Modal,Table,Row,Col,Form,Select,DatePicker,Input,Button,message,TreeSelect} from 'antd'
import Request from "@/tool/request"
import { timeFormat } from '@/tool/util'
import Filter from '../../../components/searchFilter/filter'
import {connect} from 'react-redux'
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
    qsTypeId: '' // 类型Id
  }
  componentDidMount () {
    
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.qsTypeId){
      const {pageSize} = this.state;
      const rsType = nextProps.qsTypeId
      this.getDataList({currentPage:1, pageSize,qsType:rsType,qsIsAs: 1})
      this.setState({
        qsTypeId:nextProps.qsTypeId
      })
    }
  }
  getDataList = (value) => {
    this.setState({ loading: true });
    Request.post("",{
      cmd: "getQuestionList",
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
  handleOk = () => {
    const {onCancel} = this.props
    onCancel()
   }
   handleCancel = () => {
    const {onCancel} = this.props
    onCancel()
   }
   // 点击高级搜索（过滤后表单值）
  clickSearchHandler = (value) => {
    const {pageSize} = this.state;
    this.setState({
      fiterValue: value,
      currentPage: 1
    })
    this.getResourceList({currentPage:1, pageSize,...value,qsIsAs: 1});
  };
  render() { 
    const {...modalProps } = this.props;
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
        dataIndex: 'qsTypeName',
        align: 'center',
      },
      {
        title: '问题',
        dataIndex: 'qsTitle',
        align: 'center',
      },
      {
        title: '添加时间',
        dataIndex: 'qsUdate',
        align: 'center',
        render:(text,record) => {
          return timeFormat(text, 'yyyy-MM-dd')
        }
      },
      {
        title: '发布状态',
        dataIndex: 'qsState',
        align: 'center',
        render:(text,record)=> {
          if(text == 0) {
            return '未发布'
          } else if(text == 1){
            return '已发布'
          } else if (text == 3) {
            return '待审核'
          } else if (text == 4) {
            return '审核不通过'
          }
        } 
      }
    ]
    let pagination = {
      showQuickJumper: true,
      current: this.state.currentPage,
      total: this.state.total,
      pageSize: this.state.pageSize,
    }
    let {resourceData,qsTypeId} = this.state
    const listProps = {
      dataSource: resourceData,
      pagination,
      loading: this.state.loading,
      onChange(page) {
        _this.setState({
          currentPage: page.current,
          size: page.pageSize,
        })
        _this.getDataList({
          currentPage: page.current,
          size: page.pageSize,
          qsType:qsTypeId,
          
        })
      },
    }
    const options = this.props.rsType
    const {clickSearchHandler} = this;
    return ( 
      <Modal {...modalProps} onOk={this.handleOk} onCancel={this.handleCancel} width={850} wrapClassName="special-content-modal">
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
function mapStateToProps(state){
  return {
    rsType: state.filterData.rsType
  }
}
ContentModal = Form.create()(ContentModal);
export default connect(mapStateToProps)(ContentModal);