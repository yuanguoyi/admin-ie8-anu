import React, { Component } from 'react';
import { Button,message, Table, Form,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../tool/request";
import Filter from '../../components/searchFilter/filter'
import List from './components/list'
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
        catlogTree: []
      }
    }
  componentDidMount () {
    const {pageSize} = this.state;
    // Axios.ajax('post','/list').then(res=>{
    //   console.log(res)
    //   this.setState({
    //     personList: res,
    //     loading: false
    //    })
    // })
    this.getResourceList({currentPage:1, pageSize})
  }
  
  // 列表查询
  getResourceList = (value) => {
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
    // this.context.router.goBack();
  };
  addModal = () => {
    this.props.history.push({
      pathname: '/home/addResources',
      query: {
        type: 0 // 新增
      }
    })
  }
  // 删除该条记录
  onDeleteItem = (item) => {
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
        this.getResourceList()
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
    console.log(ids,type)
    Request.post("",{
      cmd:"viewResource",
      value: {
        data:{
          rsUuid: ids,
          rsState: type
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        message.success('操作成功');
        this.getResourceList()
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
    this.getResourceList({currentPage:1, pageSize,...value});
  };
  render() {
      let _this = this
      let rsStateList = [
        {codeUuid:'',codeName:'全部'},
        {codeUuid:'0',codeName:'未发布'},
        {codeUuid:'1',codeName:'已发布'}
      ]
      const rsType = this.props.rsType
      const searchArray= [
        [
          {key: 'rsTitle',label:"标题",placeholder:"请输入标题"}
        ],
        [
          {key:"rsType",label:"资源类型",placeholder:"请选择",option:rsType},
        ],
        [
          {key:"rsDept",label:"查阅范围",placeholder:"请选择",treeSelect: true}
        ],
        [
          
        ]
      ];
      let pagination = {
        showSizeChanger: true,
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
        rowSelection,
        // loading: this.state.loading,
        onChange(page) {
          _this.setState({
            currentPage: page.current,
            size: page.pageSize,
          })
          _this.getResourceList({
            currentPage: page.current,
            size: page.pageSize
          })
        },
        onEditItem(item){
          console.log(item)
          sessionStorage.setItem('rsItem',JSON.stringify(item))
          _this.props.history.push({
            pathname: '/home/addResources',
            query: {
              id: '',
              type: 1 // 编辑
            }
          })
          
        },
        onDeleteItem (item) {
          _this.onDeleteItem(item)
        },
        lookDetail(item) {
          _this.setState({
            addModal: true,
            modalType: 'create',
            currentItem: item
          })
          _this.getTreeData(item)
        }
      }
      const modalVisble = this.state.addModal
      const modalType = this.state.modalType
      const currentItem = this.state.currentItem
      const catlogTree = this.state.catlogTree
      const modalProps = {
        visible: modalVisble,
        catlogTree: catlogTree,
        maskClosable: false,
        item: modalType === 'create' ? currentItem : '',
        title: `${modalType === 'create' ? '查看详情' : '编辑'}`,
        onOk(data,userId) {
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
              <Button type="primary" onClick={this.addModal}>上传文件</Button>
            </div>
            <div className="content-table">
              <List {...listProps}/>
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