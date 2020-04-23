import React, { Component } from 'react';
import { Button, Table, Form,message,Modal } from "antd";
import {connect} from 'react-redux'
import Request from "../../tool/request";
import Filter from '../../components/searchFilter/filter'
import List from './components/list'
import { timeFormat } from '@/tool/util'
class User extends Component {
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
    this.getSpecialList({currentPage:1, pageSize})
  }
  
  // 获取专题列表
  getSpecialList = (value) => {
    this.setState({ loading: true });
    Request.post("",{
      cmd:"getPoliceInfoList",
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
          personList: res.data.getPoliceInfoList,
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
  goToHash = (pathname, state) => {
    this.context.router.push({
      pathname,
      state
    });
  };
  addModal = () => {
    sessionStorage.removeItem('specialItem')
    this.props.history.push({
      pathname: '/home/addSpecial',
      query: {
        type: 0 // 新增
      }
    })
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
    this.getSpecialList({currentPage:1, pageSize,...value,qsIsAs: 1});
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
          {key: 'policeName',label:"姓名",placeholder:"请输入姓名"}
        ],
        [
          // {key: 'partment',label:"岗位",placeholder:"请输入岗位"}
        ],
        [
          
        ],
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
            ...fiterValue
          })
        },
        lookDetail(item) {
          _this.props.history.push({
            pathname: '/home/userDetail', 
            query:{
              id: item.policeId
            }
          })
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
        title: `${modalType === 'create' ? '查看详情' : ''}`,
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
            <div className="content-table">
              <List {...listProps}/>
              {/* <AddModal {...modalProps} ref="showEditor"/> */}
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
)(User); 