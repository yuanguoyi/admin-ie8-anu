import React, { Component } from 'react';
import { Button, Table, Form,message,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../../tool/request";
import Filter from '../../../components/searchFilter/filter'
import List from './components/approvalList.js'
import { timeFormat } from '@/tool/util'
import AddModal from './components/modal'
class answerApproval extends Component {
    constructor(props) {
      super(props)
      this.state = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        personList: [],
        loading: false,
        addModal: false,
        currentItem: {},
        modalType: 'create',
        selectedRowKeys: [],
        time: 0,
        fiterValue: '',
        catlogTree: [],
        tabKey: 1 // 切换
      }
   }
  componentDidMount () {
    const {pageSize} = this.state;
    this.getSpecialList({currentPage:1, pageSize,qsState:'3'})
  }
  // 获取文档目录
  getTreeData = (item) => {
    let _this = this
    console.log(item)
    Request.post("",{
      cmd:"getResourceDirect",
      value: {
        data:{
          rslsReluuid: item.rsUuid
        }
      },
      bool:true
    })
    .then((rest)=>{
      if(rest.code === 1000){
        this.setState({catlogTree: rest.data})
      }
    })
    .catch((msg)=>{
    })
  }
  // 获取审批列表
  getSpecialList = (value) => {
    this.setState({ loading: true });
    Request.post("",{
      cmd:"getQuestionLista",
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
          personList: res.data.data,
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
  };
  // 审批是否通过
  onEditItem = (item,type) => {
    Request.post("",{
      cmd:"ViewQuestionAndanswer",
      value: {
        data:{
          qsUuid: item.qsUuid,
          qsState: type
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        message.success('操作成功');
        const {pageSize,currentPage} = this.state;
        this.getSpecialList({currentPage:currentPage, pageSize,qsState:'3'})
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  render() {
      let _this = this
      let pagination = {
        // showSizeChanger: true,
        showQuickJumper: true,
        current: this.state.currentPage,
        total: this.state.total,
        pageSize: this.state.pageSize
      }
      const {personList,selectedRowKeys,fiterValue,tabKey} = this.state
      const listProps = {
        dataSource: personList,
        pagination,
        // loading: this.state.loading,
        onChange(page) {
          _this.setState({
            currentPage: page.current,
            size: page.pageSize,
          })
          _this.getSpecialList({
            currentPage: page.current,
            size: page.pageSize,
            qsState:'3'
          })
        },
        onEditItem (item,type) {
          _this.onEditItem(item,type)
        },
        lookDetail(item) {
          _this.setState({
            addModal: true,
            modalType: 'create',
            currentItem: item,
            tabKey: 1
          })
          _this.getTreeData(item)
        },
      }
      const modalVisble = this.state.addModal
      const modalType = this.state.modalType
      const currentItem = this.state.currentItem
      const time = this.state.time
      const modalProps = {
        time: time,
        visible: modalVisble,
        maskClosable: false,
        item: modalType === 'create' ? currentItem : currentItem,
        title: `${modalType === 'create' ? '答疑详情' : ''}`,
        onOk(data,userId) {
          _this.setState({
            addModal: false
          })
        },
        onCancel() {
          _this.setState({
            addModal: false
          })
        }
      }
      const {clickSearchHandler} = this;
      const hasSelected = selectedRowKeys.length > 0;
      return (
        <div className="contain-wrap">
          <div>
            {/* <Filter {...{searchArray,clickSearchHandler}} /> */}
            <div className="content-table" style={{paddingTop: '40px'}}>
              <List {...listProps}/>
              <AddModal {...modalProps} />
            </div>
          </div>
        </div>
      )
    }
}
function mapStateToProps(state) {
  return {
    rsType: state.filterData.rsType,
    companyData: state.filterData.companyData
  }
}
export default connect(
  mapStateToProps
)(answerApproval); 