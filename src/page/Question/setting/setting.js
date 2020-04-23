import React, { Component } from 'react';
import { Button, Table, Form,message,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../../tool/request";
import List from './components/list'
import AddModal from './components/modal'
import Axios from '@/tool/ajax'
class Setting extends Component {
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
        policeList: []
      }
    }
  componentDidMount () {
    const {pageSize} = this.state;
    this.getSettingList({currentPage:1, pageSize})
    this.getElPoliceList()
  }
  getElPoliceList () {
    Request.post("",{
      cmd: "getElPoliceList",
      value: {
        data: {

        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        this.setState({
          policeList: res.data.data
        })
      } else {

      } 
    })
    .catch((msg)=>{
      message.success(msg)
    })
  }
  addModal = () => {
    this.setState({
      addModal: true,
      modalType: 'create'
    })
  }
  delItem = (item) => {
    Request.post("",{
      cmd: "delAsUser",
      value: {
        data: {
          urUuid: item.urUuid, 
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        const {pageSize,currentPage} = this.state;
        this.getSettingList({currentPage:currentPage, pageSize})
      } else {

      } 
    })
    .catch((msg)=>{
      message.success(msg)
    })
  }
  addSetting = (value) => {
    let item = this.state.currentItem
    let type = this.state.modalType
    let newValue
    if (type == 'create') {
      newValue = value
    } else {
      newValue = {...value,...{urUuid: item.urUuid}}
    }
    console.log(newValue)
    let url = type == 'create' ? 'addAsUser' : 'updateAsUser'
    Request.post("",{
      cmd: url,
      value: {
        data: {
          ...newValue, 
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        message.success('保存成功')
        this.setState({
          currentPage: 1
        })
        const {pageSize} = this.state;
        this.getSettingList({currentPage:1, pageSize})
      } else {

      } 
    })
    .catch((msg)=>{
      message.success(msg)
    })
  }
  // 获取设置列表
  getSettingList = (value) => {
    this.setState({ loading: true });
    Request.post("",{
      cmd: "getAsUserList",
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
          personList: res.data.list,
          total: res.data.total,
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
  render() {
      let _this = this
      let pagination = {
        // showSizeChanger: true,
        showQuickJumper: true,
        current: this.state.currentPage,
        total: this.state.total,
        pageSize: this.state.pageSize
      }
      const {personList,selectedRowKeys} = this.state
      const rowSelection = {
        selectedRowKeys,
        onChange(selectedRowKeys){
          _this.setState({ selectedRowKeys });
        }
      };
      const listProps = {
        dataSource: personList,
        pagination,
        // loading: this.state.loading,
        onChange(page) {
          _this.setState({
            currentPage: page.current,
            pageSize: page.pageSize,
          })
          _this.getSettingList({
            currentPage: page.current,
            pageSize: page.pageSize
          })
        },
        onEditItem(item){
          _this.setState({
            addModal: true,
            modalType: 'update',
            currentItem: item
          })
        },
        onDeleteItem (item) {
          _this.delItem(item)
        },
        lookDetail(item) {
        }
      }
      const modalVisble = this.state.addModal
      const modalType = this.state.modalType
      const currentItem = this.state.currentItem
      const departData = this.props.departMent
      const queType = this.props.queType
      const policeList = this.state.policeList
      const modalProps = {
        policeList: policeList,
        visible: modalVisble,
        maskClosable: false,
        departData: departData,
        queType: queType,
        modalType:modalType,
        item: modalType === 'create' ? {} : currentItem,
        title: `${modalType === 'create' ? '新增' : '编辑'}`,
        onOk(value) {
          _this.setState({
            addModal: false
          })
          _this.addSetting(value)
        },
        onCancel() {
          _this.setState({
            addModal: false
          })
        }
      }
      return (
        <div className="contain-wrap">
          <div>
            <div className="contain-add">
              <Button type="primary" onClick={this.addModal}>添加</Button>
            </div>
            <div className="content-table">
              <List {...listProps}/>
              <AddModal {...modalProps}/>
            </div>
          </div>
        </div>
      )
    }
}
function mapStateToProps(state) {
  return {
    departMent: state.filterData.departMent,
    queType: state.filterData.queType,
  }
}
export default connect(
  mapStateToProps
)(Setting); 