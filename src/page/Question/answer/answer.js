import React, { Component } from 'react';
import { Button, Table, Form,message,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../../tool/request";
import Filter from '../../../components/searchFilter/filter'
import List from './components/list'
import AddModal from './components/modal'
import Axios from '@/tool/ajax'
import { timeFormat } from '@/tool/util'
class Answer extends Component {
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
    this.getAnswerList({currentPage:1, pageSize,qsIsAs: 1})
  }
  // 获取答疑列表
  getAnswerList = (value) => {
    console.log(value)
    this.setState({ loading: true });
    Request.post("",{
      cmd:"getQuestionList",
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
  goToHash = (pathname, state) => {
    this.context.router.push({
      pathname,
      state
    });
  };
  addModal = () => {
    this.props.history.push({
      pathname: '/home/addAnswer',
      query: {
        type: 0 // 新增
      }
    })
  }
  // 删除该条记录
  onDeleteItem = (id) => {
    let filterValue = this.state.fiterValue
    Request.post("",{
      cmd:"delQuestionAndanswer",
      value: {
        data:{
          qsUuid: id,       //  currentPage:1,size:10
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        const {pageSize,currentPage} = this.state;
        this.getAnswerList({currentPage:currentPage, pageSize,...filterValue})
        message.success('删除成功');
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
      cmd:"searchAnsweringQuestionsDetails",
      value: {
        data: {
          qsUuid: item.qsUuid,  
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        sessionStorage.setItem('html',JSON.stringify(res.data))
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
    Request.post("",{
      cmd:"ViewQuestionAndanswer",
      value: {
        data:{
          qsUuid: ids,
          qsState: type
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        message.success('操作成功');
        const {pageSize} = this.state;
        this.getAnswerList({currentPage:1, pageSize,qsIsAs: 1,...filterValue})
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
    this.resourceSend('0')
  }
  // 批量取消删除
  batchDel = () => {
    let selectedRowKeys = this.state.selectedRowKeys.join(',')
    console.log(selectedRowKeys)
    this.onDeleteItem(selectedRowKeys)
  }
  // 手动推荐
  onRecommend(item) {
    let filterValue = this.state.fiterValue
    Request.post("",{
      cmd:"addPoliceTagManual",
      value: {
        data:{
          rsUuids: item.qsUuid,
          deptUuids: item.qsDept,
          resourceType: '2'
        }
      },
      bool:true
    })
    .then((rest)=>{
      if(rest.code === 1000){
        const {pageSize,currentPage} = this.state;
        this.getAnswerList({currentPage:currentPage, pageSize,qsIsAs: 1,...filterValue})
        message.success('推荐成功')
      }
    })
    .catch((msg)=>{
    })
  }
  // 点击高级搜索（过滤后表单值）
  clickSearchHandler = (value) => {
    const {rangerTime} = value
    if(rangerTime){
      value.bDate = timeFormat(new Date(rangerTime[0]).getTime());
    }
    if(rangerTime){
      value.eDate = timeFormat(new Date(rangerTime[1]).getTime());
    }
    delete(value[rangerTime])
    console.log('过滤后表单值：', value);
    const {pageSize} = this.state;
    this.setState({
      fiterValue: value,
      currentPage:1
    })
    this.getAnswerList({currentPage:1, pageSize,...value,qsIsAs: 1});
  };
  render() {
      let _this = this
      let rsStateList = [
        {codeUuid:'',codeName:'全部'},
        {codeUuid:'0',codeName:'未发布'},
        {codeUuid:'1',codeName:'已发布'},
        {codeUuid:'3',codeName:'待审核'},
        {codeUuid:'4',codeName:'审核不通过'}
      ]
      const queType = this.props.queType
      const searchArray= [
        [
          {key:"qsType",label:"答疑类型",placeholder:"请选择",option:queType},
          // {key:"qsDept",label:"部门",placeholder:"请选择",treeSelect: true} 
        ],
        [
          {key:"qsState",label:"发布状态",placeholder:"请选择",option: rsStateList},
        ],
        [
          {key:"rangerTime",label:"添加时间",placeholder:"请选择",rangerTime:true},
        ],
        [
          {key: 'qsTitle',label:"问题",placeholder:"请输入问题"}
        ]
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
          _this.getAnswerList({
            currentPage: page.current,
            size: page.pageSize,
            qsIsAs: 1,
            ...fiterValue
          })
        },
        onEditItem(item) {
          _this.props.history.push({
            pathname: '/home/addAnswer',
            query: {
              id: item.qsUuid,
              type: 1, // 编辑
              urReleasetype: item.urReleasetype // 可见范围类型
            }
          })
        },
        onDeleteItem (item) {
          _this.onDeleteItem(item.qsUuid)
        },
        lookDetail(item) {
          _this.setState({
            addModal: true,
            modalType: 'create',
           })
          _this.lookDetail(item)
          
        },
        onRecommend(item) {
          _this.onRecommend(item)
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
      const treeData = this.props.departMent
      return (
        <div className="contain-wrap">
          <div>
            <Filter {...{searchArray,treeData,clickSearchHandler}} />
            <div className="contain-add">
              <Button type="primary" onClick={this.addModal}>添加</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchSend}>批量发布</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchCancel} style={{width: '100px'}}>批量取消发布</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchDel} >批量删除</Button>
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
    queType: state.filterData.queType,
    companyData: state.filterData.companyData,
    departMent: state.filterData.departMent
  }
}
export default connect(
  mapStateToProps
)(Answer); 