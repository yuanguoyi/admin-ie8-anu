import React, { Component } from 'react';
import { Button, Table, Form,message,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../../tool/request";
import Filter from '../../../components/searchFilter/filter'
import List from './components/list'
import { timeFormat,exportFile } from '@/tool/util'
class Special extends Component {
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
        typeList: [] //类型
      }
   }
  componentDidMount () {
    const {pageSize} = this.state;
    const codeCharCode = "/TypeState/feedback";
    this.getQueType(codeCharCode)
    this.getSpecialList({currentPage:1, pageSize})
  }
  // 类型
  getQueType = (codeCharCode) => {
    Request.post("",{
      cmd:"getDictComBoboxByCode",
      value: {
        data:{
          codeCharCode
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code === 1000){
          this.setState({
            typeList: rest.data
          })
        }else{

        }
      })
      .catch((msg)=>{
        // console.log("批量调取数据字典项msg:",msg);
      })
   }
  // 获取专题列表
  getSpecialList = (value) => {
    this.setState({ loading: true });
    Request.post("",{
      cmd:"getElIdeaList",
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
   // window.location.href="http://10.250.196.100:8888/zfbd_if/outExcel.do"
    let value = this.state.fiterValue
    Request.post("",{
      cmd:"outExcel",
      value: {
        data: {
          ...value, 
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        console.log(res.data)
        //exportFile(res.data)
      } else {
        message.error(res.msg)
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
    this.getSpecialList({currentPage:1, pageSize,...value,qsIsAs: 1});
  };
  render() {
      let _this = this
      let rsStateList = [
        {codeUuid:'0',codeName:'未处理'},
        {codeUuid:'1',codeName:'已读'},
        {codeUuid:'2',codeName:'已导出'}
      ]
      const typeList = this.state.typeList
      const searchArray= [
        [
          {key:"ideaTypeuuid",label:"反馈类型",placeholder:"请选择",option: typeList},
        ],
        [
          {key:"rangerTime",label:"反馈时间",placeholder:"请选择",rangerTime:true},
        ],
        [
          {key:"ideaProcessing",label:"处理状态",placeholder:"请选择",option: rsStateList},
        ],
        [
          {key: 'userName',label:"用户姓名",placeholder:"请输入用户姓名"}
        ],
        
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
          _this.getSpecialList({
            currentPage: page.current,
            size: page.pageSize,
            ...fiterValue
          })
        },
      }
      const {clickSearchHandler} = this;
      const hasSelected = selectedRowKeys.length > 0;
      return (
        <div className="contain-wrap">
          <div>
            <Filter {...{searchArray,clickSearchHandler}} />
            {/* <div className="contain-add">
              <Button type="primary" onClick={this.addModal} disabled={!hasSelected}>导出</Button>
            </div> */}
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
    companyData: state.filterData.companyData
  }
}
export default connect(
  mapStateToProps
)(Special); 