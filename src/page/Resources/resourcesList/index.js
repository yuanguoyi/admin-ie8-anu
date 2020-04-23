import React, { Component } from 'react';
import { Button,message, Table, Form,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "@/tool/request";
import Filter from '@components/searchFilter/filter'
import List from './components/list'
import AddModal from './components/modal'
import Axios from '@/tool/ajax'
import { timeFormat } from '@/tool/util'
class SentensePerson extends Component {
    constructor(props) {
      super(props)
      this.state = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        personList: [],
        loading: false,
        addModal: false,
        currentItem: '',
        modalType: 'create',
        selectedRowKeys: [],
        catlogTree: [],
        fiterValue: '',
        tabKey: 1, // 切换
        defaultValue: [],
        isEdit: 0,
        isProvicalUser: '', // 是否省局
        approvalData: '' // 审批列表数据
      }
    }
  componentDidMount () {
    const {pageSize,isEdit} = this.state;
    const filter = sessionStorage.getItem('fiterValue')
    // const loginData = JSON.parse(sessionStorage.getItem("loginData"));
    const loginData = {}
    // this.setState({
    //   isProvicalUser: loginData.jfpAccount.isProvicalUser
    // })
    if (filter){
      const fiterValue = JSON.parse(filter)
      this.getResourceList({currentPage:1, pageSize,...fiterValue})
    }else {
      sessionStorage.removeItem('resTypeValue')
      this.getResourceList({currentPage:1, pageSize})
    }
    console.log('showEditor',this.refs["showEditor"])
  }
  componentWillUnmount() {
    // const {isEdit} = this.state;
    // if(isEdit==0){
    //   sessionStorage.removeItem('fiterValue')
    // } 
    
  }
  // 获取审批人列表
  getApprovalData(item){
    Request.post("",{
      cmd:"getQuestionOrResourceLog",
      value: {
        data: {
          uuid:item.rsUuid,       //  currentPage:1,size:10
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
          this.setState({
            approvalData:res.data
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
  // 列表查询
  getResourceList = (value) => {
    console.log(value)
    const that = this;
    this.setState({ loading: true });
    Request.post("",{
      cmd:"getResource",
      value: {
        data:{
          ...value,       //  currentPage:1,size:10
        }
      },
      bool:true,
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
    sessionStorage.removeItem('rsItem')
    this.props.history.push({
      pathname: '/home/addResources',
      query: {
        type: 0 // 新增
      }
    })
  }
  moveUp = (item,itemIndex,type) => {
    const personList = this.state.personList
    let filterValue = this.state.fiterValue
    const {currentPage} = this.state;
    let twoRsUuid = ''
    personList.forEach((item,index)=>{
      if (type == 0) {
        if(itemIndex == index+1) {
          twoRsUuid = item.rsUuid
        }
      } else {
        if(itemIndex == index-1) {
          twoRsUuid = item.rsUuid
        }
      }
    })
    Request.post("",{
      cmd: 'moveUpAndDownResource',
      value: {
        data: {
          oneRsUuid: item.rsUuid,
          twoRsUuid: twoRsUuid,
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        this.getResourceList({currentPage:currentPage,...filterValue,})
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  isTop = (item,type) => {
    let {currentPage} = this.state
    let filterValue = this.state.fiterValue
    console.log(filterValue)
    Request.post("",{
      cmd:type == 1  ? "cancelTopResource" : 'topResource',  // 1 是取消置顶
      value: {
        data: {
          rsUuid: item.rsUuid,
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        this.getResourceList({currentPage:currentPage,...filterValue})
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  // 删除该条记录
  onDeleteItem = (item) => {
    // this.setState({
    //   currentPage: 1
    // })
    const {currentPage} = this.state
    let filterValue = this.state.fiterValue
    console.log(filterValue)
    Request.post("",{
      cmd:"delResource",
      value: {
        data:{
          rsUuid: item.rsUuid,       //  currentPage:1,size:10
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        this.getResourceList({currentPage:currentPage,...filterValue})
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  resourceSend = (type)=> {
    let ids = this.state.selectedRowKeys.join(',')
    let filterValue = this.state.fiterValue
    console.log(ids,type,filterValue)
    Request.post("",{
      cmd:"viewResource",
      value: {
        data:{
          rsUuid: ids,
          rsState: type,
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        message.success('操作成功');
        this.getResourceList({...filterValue})
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
  // 手动推荐
  onRecommend(item) {
    let filterValue = this.state.fiterValue
    Request.post("",{
      cmd:"addPoliceTagManual",
      value: {
        data:{
          rsUuids: item.rsUuid,
          deptUuids: item.rsDept,
          resourceType: '1'
        }
      },
      bool:true
    })
    .then((rest)=>{
      if(rest.code === 1000){
        const {pageSize,currentPage} = this.state;
        this.getResourceList({currentPage:currentPage, pageSize,...filterValue})
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
    const {pageSize} = this.state;
    this.setState({
      fiterValue: value,
      currentPage: 1
    })
    let resTypeValue = []
    if (value.rsType) {
      resTypeValue.push(value.rsType)
      if(value.rsSubType){
        resTypeValue.push(value.rsSubType)
      }
    }
    if(resTypeValue.length>0){
      sessionStorage.setItem('resTypeValue',JSON.stringify(resTypeValue))
    }
    this.getResourceList({currentPage:1, pageSize,...value});
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
      const rsType = this.props.rsType
      const searchArray= [
        [
          {key: 'rsTitle',label:"标题",placeholder:"请输入标题"}
        ],
        // [
        //   {key:"rsType",label:"资源类型",placeholder:"请选择",option:rsType},
        // ],
        [
          {key:"rsType",label:"资源类型",placeholder:"请选择",cascader: true},
        ],
        [
          {key:"rsState",label:"发布状态",placeholder:"请选择",option: rsStateList},
          
        ],
        [
          {key:"rangerTime",label:"上传时间",placeholder:"请选择",rangerTime:true},
        ]
      ];
      let pagination = {
        // showSizeChanger: true,
        showQuickJumper: true,
        current: this.state.currentPage,
        total: this.state.total,
        pageSize: this.state.pageSize
      }
      const {personList,selectedRowKeys,fiterValue,isProvicalUser} = this.state
      const rowSelection = {
        selectedRowKeys,
        onChange(selectedRowKeys){
          _this.setState({ selectedRowKeys });
        }
      };
      const listProps = {
        isProvicalUser: isProvicalUser,
        dataSource: personList,
        pagination,
        rowSelection,
        // loading: this.state.loading,
        onChange(page) {
          _this.setState({
            currentPage: page.current,
            pageSize: page.pageSize,
          })
          _this.getResourceList({
            currentPage: page.current,
            pageSize: page.pageSize,
            ...fiterValue
          })
        },
        onEditItem(item){
          sessionStorage.setItem('rsItem',JSON.stringify(item))
          sessionStorage.setItem('fiterValue',JSON.stringify(fiterValue))
          _this.props.history.push({
            pathname: '/home/addResources',
            query: {
              id: item.rsUuid,
              type: 1 // 编辑
            }
          })
          _this.setState({isEdit:1})
        },
        onDeleteItem (item) {
          _this.onDeleteItem(item)
        },
        lookDetail(item) {
          _this.setState({
            addModal: true,
            modalType: 'create',
            currentItem: item,
            tabKey: 1
          })
          _this.getTreeData(item)
          _this.getApprovalData(item)
        },
        onRecommend(item) {
          _this.onRecommend(item)
        },
        moveUp(item,index){ 
         _this.moveUp(item,index,0)
        },
        moveDown(item,index){
        _this.moveUp(item,index,1)
        },
        isTop(item){
          _this.isTop(item,0)
        },
        isTopCancel (item) {
          _this.isTop(item,1)
        }
      }
      const {tabKey,modalType,currentItem,catlogTree,addModal,approvalData} = this.state
      const modalProps = {
        visible: addModal,
        catlogTree: catlogTree,
        maskClosable: false,
        tabKey: tabKey,
        item: modalType === 'create' ? currentItem : '',
        approvalData:approvalData,
        isProvicalUser: isProvicalUser,
        title: `${modalType === 'create' ? '查看详情' : '编辑'}`,
        onOk(data,userId) {
        },
        onCancel() {
          _this.setState({
            addModal: false
          })
        },
        changeTab(key) {
          _this.setState({
            tabKey: key
          })
        }
      }
      const {clickSearchHandler} = this;
      const hasSelected = selectedRowKeys.length > 0;
      const options = this.props.rsType
      return (
        <div className="contain-wrap">
          <div>
            <Filter {...{searchArray,options,clickSearchHandler}} />
            <div className="contain-add">
              <Button type="primary" onClick={this.addModal}>添加</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchSend}>批量发布</Button>
              <Button type="primary" disabled={!hasSelected} onClick={this.batchCancel} style={{width: '100px'}}>批量取消发布</Button>
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
    departMent: state.filterData.departMent
  }
}
export default connect(
  mapStateToProps
)(SentensePerson); 