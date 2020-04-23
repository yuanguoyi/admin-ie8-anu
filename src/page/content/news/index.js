import React, { Component } from 'react';
import { Button, Table, Form,message,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../../tool/request";
import Filter from '../../../components/searchFilter/filter'
import List from './components/list'
import AddModal from './components/modal'
import { timeFormat } from '@/tool/util'
class News extends Component {
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
        fiterValue: ''
      }
   }
  componentDidMount () {
    const {pageSize} = this.state;
    this.getNewList({currentPage:1, pageSize})
  }
  
  // 获取专题列表
  getNewList = (value) => {
    this.setState({ loading: true });
    Request.post("",{
      cmd:"searcNews",
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
          total: res.totalCount,
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
  goToHash = (pathname, state) => {
    this.context.router.push({
      pathname,
      state
    });
  };
  addModal = () => {
    sessionStorage.removeItem('newsItem')
    this.props.history.push({
      pathname: '/home/addNew',
      query: {
        type: 0 // 新增
      }
    })
  }
  // 删除该条记录
  onDeleteItem = (id) => {
    // this.setState({
    //   currentPage:1
    // })
    let filterValue = this.state.fiterValue
    Request.post("",{
      cmd:"delNews",
      value: {
        data:{
          nsDelunids: id,
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        const {pageSize,currentPage} = this.state;
        this.getNewList({currentPage:currentPage, pageSize,...filterValue})
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  // 查看详情数据
  lookDetail = (item) => {
    Request.post("",{
      cmd:"getNews",
      value: {
        data: {
          nsUuid: item.nsUuid,  
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        sessionStorage.setItem('newshtml',JSON.stringify(res.data))
        this.setState({
          currentItem: res.data,
        })
      } else {

      } 
    })
  } 
  resourceSend = (type)=> {
    let ids = this.state.selectedRowKeys.join(',')
    let filterValue = this.state.fiterValue
    console.log(ids,type)
    let params = ''
    if (type == 1) {
      params = {
        nsSaveunids:ids
      }
    } else {
      params = {
        nsDelunids:ids
      }
    }
    console.log(params)
    Request.post("",{
      cmd:"viewNews",
      value: {
        data:{
          ...params
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        message.success('操作成功');
        const {pageSize} = this.state;
        this.getNewList({currentPage:1, pageSize,...filterValue})
        this.setState({
          currentPage: 1
        })
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  // 批量发布
  batchSend = () => {
    this.resourceSend('1')
  }
  // 批量取消发布
  batchCancel = () => {
    this.resourceSend('2')
  }
  // 批量取消删除
  batchDel = () => {
    let selectedRowKeys = this.state.selectedRowKeys.join(',')
    this.onDeleteItem(selectedRowKeys)
  }
  // 点击高级搜索（过滤后表单值）
  clickSearchHandler = (value) => {
    const {rangerTime} = value
    if(rangerTime){
      value.Bdate = timeFormat(new Date(rangerTime[0]).getTime());
    }
    if(rangerTime){
      value.Edate = timeFormat(new Date(rangerTime[1]).getTime());
    }
    delete(value[rangerTime])
    console.log('过滤后表单值：', value);
    const {pageSize} = this.state;
    this.setState({
      fiterValue: value,
      currentPage:1
    })
    this.getNewList({currentPage:1, pageSize,...value});
  };
  render() {
      let _this = this
      let rsStateList = [
        // {codeUuid:'',codeName:'全部'},
        {codeUuid:'0',codeName:'未发布'},
        {codeUuid:'1',codeName:'发布中'},
        {codeUuid:'2',codeName:'取消发布'}
      ]
      const rsType = this.props.rsType
      const searchArray= [
        [
          {key:"nsState",label:"状态",placeholder:"请选择",option: rsStateList},
        ],
        [
          {key: 'nsTitle',label:"标题",placeholder:"请输入标题名称"}
        ],
        [],
        []
      ];
      let pagination = {
        // showSizeChanger: true,
        showQuickJumper: true,
        current: this.state.currentPage,
        total: this.state.total,
        pageSize: this.state.pageSize
      }
      const {personList,selectedRowKeys,fiterValue} = this.state
      const rowSelection = {
        selectedRowKeys,
        onChange(selectedRowKeys){
          _this.setState({ selectedRowKeys });
        }
      };
      const listProps = {
        dataSource: personList,
        pagination,
        rowSelection,
        // loading: this.state.loading,
        onChange(page) {
          _this.setState({
            currentPage: page.current,
            size: page.pageSize,
          })
          _this.getNewList({
            currentPage: page.current,
            size: page.pageSize,
            ...fiterValue
          })
        },
        onEditItem(item){
          sessionStorage.setItem('newsItem',JSON.stringify(item))
          _this.props.history.push({
            pathname: '/home/addNew',
            query: {
              id: item.nsUuid,
              type: 1 // 编辑
            }
          })
        },
        onDeleteItem (item) {
          _this.onDeleteItem(item.nsUnid.toString())
        },
        lookDetail(item) {
          _this.setState({
            addModal: true,
            modalType: 'create',
           })
          _this.lookDetail(item)
          
        }
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
        title: `${modalType === 'create' ? '新闻详情' : ''}`,
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
            <Filter {...{searchArray,clickSearchHandler}} />
            <div className="contain-add">
              <Button type="primary" onClick={this.addModal}>添加</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchSend}>批量发布</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchCancel} style={{width: '100px'}}>批量取消发布</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchDel} >批量删除</Button>
            </div>
            <div className="content-table">
              <List {...listProps}/>
              <AddModal {...modalProps} ref="showEditor"/>
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
)(News); 