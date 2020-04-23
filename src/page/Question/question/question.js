import React, { Component } from 'react';
import { Button, Table, Form,message,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../../tool/request";
import Filter from '../../../components/searchFilter/filter'
import List from './components/list'
import AddModal from './components/modal'
import Axios from '@/tool/ajax'
import { timeFormat } from '@/tool/util'
class Question extends Component {
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
        fiterValue: '',
      }
    }
  componentDidMount () {
    const {pageSize} = this.state;
    this.getQuestionList({currentPage:1, pageSize,qsIsAs: 0})
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
        sessionStorage.setItem('questionHtml',JSON.stringify(res.data))
        this.setState({
          currentItem: res.data,
        })
      } else {

      } 
    })
  } 
  // 获取提问列表
  getQuestionList = (value) => {
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
    this.getQuestionList({currentPage:1, pageSize,...value,qsIsAs: 0});
  };
  render() {
      let _this = this
      let rsStateList = [
        {codeUuid:'',codeName:'全部'},
        {codeUuid:'0',codeName:'未解答'},
        {codeUuid:'1',codeName:'已解答'}
      ]
      const queType = this.props.queType
      const searchArray= [
        [
          {key:"qsType",label:"答疑类型",placeholder:"请选择",option:queType},
         
        ],
        [
          {key:"rangerTime",label:"提问时间",placeholder:"请选择",rangerTime:true},
        ],
        [
          {key: 'qsTitle',label:"问题",placeholder:"请输入问题"}
        ],
        []
      ];
      let pagination = {
        showSizeChanger: true,
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
        // loading: this.state.loading,
        onChange(page) {
          _this.setState({
            currentPage: page.current,
            pageSize: page.pageSize,
          })
          _this.getQuestionList({
            currentPage: page.current,
            pageSize: page.pageSize,
            ...fiterValue
          })
        },
        onEditItem(item){
           sessionStorage.setItem('questionItem',JSON.stringify(item))
          _this.props.history.push({
            pathname:'/home/addQuestion',
            query:{
              type: 1 // 新增
            }
          })
        },
        onDeleteItem (item) {

        },
        lookDetail(item) {
          _this.setState({
            addModal: true,
            modalType: 'create'
          })
          _this.lookDetail(item)
        }
      }
      const modalVisble = this.state.addModal
      const modalType = this.state.modalType
      const currentItem = this.state.currentItem
      const modalProps = {
        visible: modalVisble,
        maskClosable: false,
        item: modalType === 'create' ? currentItem : currentItem,
        title: `${modalType === 'create' ? '查看详情' : '编辑'}`,
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
      const treeData = this.props.departMent
      return (
        <div className="contain-wrap">
          <div>
            <Filter {...{searchArray,treeData,clickSearchHandler}} />
            <div className="contain-add">
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
)(Question); 