import React, { Component } from 'react'
import {Button} from 'antd'
import '@/style/resources.less'
import List from './contentList'
import ContentModal from './ContentModal'
import DetailModal from './detailModal'
import Request from "@/tool/request";
import {connect} from 'react-redux'
let specialId = ''
class Content extends Component {
  state = { 
    currentPage: 1,
    pageSize: 10,
    total: 0,
    personList: [],
    loading: false,
    addModal: false,
    detailModal: false,
    detailItem: {},
    currentItem: {},
    modalType: 'create',
    selectedKeys: [],
    time: 0,
    fiterValue: '',
    treeData: []
   }
   componentDidMount() {
    const {pageSize} = this.state;
    const {...modal} = this.props
    specialId = modal.specialId
    this.getContentList({currentPage:1, pageSize})
    //this.getTreeData()
   }
   // 获取资源类型
   getTreeData () {
     let json = {
       codeName: ''
     }
    console.log(this.props.rsType)
   }
   hanleChange = () => {
    this.setState({
      addModal: true,
    })
   }
   save = () =>{
    let {...modal} = this.props
    let {backList} = modal
    backList()
   }
   getContentList (value) {
    this.setState({ loading: true });
    Request.post("",{
      cmd:"searchSubjectSubList",
      value: {
        data: {
          ...value, 
          subUuid:specialId
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        let selectedKeys = []
        res.data.data.forEach(e => {
          selectedKeys.push(e.srResuuid)
        });
        this.setState({
          personList: res.data.data,
          total: res.data.totalCount,
          loading: false,
          selectedKeys: selectedKeys
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
   // 上一步
   changUp = () => {
    let {...modal} = this.props
    let {changUp} = modal
    changUp()
   }
   // 删除该条记录
   onDeleteItem = (srSubuuid,srResuuid) => {
    this.setState({
      currentPage: 1
    })
    Request.post("",{
      cmd:"removeSubject",
      value: {
        data:{
          srSubuuid: srSubuuid,
          srResuuid: srResuuid
        }
      },
      bool:true,
    })
    .then((res)=>{
      if(res.code === 1000){
        const {pageSize} = this.state;
        this.getContentList({currentPage:1, pageSize})
      } else {
        message.error(res.msg);
      } 
    })
    .catch((msg)=>{
      message.error(msg);
    })
  }
  render() { 
    let pagination = {
      // showSizeChanger: true,
      showQuickJumper: true,
      current: this.state.currentPage,
      total: this.state.total,
      pageSize: this.state.pageSize
    }
    let _this = this
    let {personList,addModal,selectedKeys,detailModal,detailItem,treeData} = this.state
    let {...modal} = this.props
    let specialId = modal.specialId
    const listProps = {
      dataSource: personList,
      pagination,
      // loading: this.state.loading,
      onChange(page) {
        _this.setState({
          currentPage: page.current,
          size: page.pageSize,
        })
        _this.getContentList({
          currentPage: page.current,
          size: page.pageSize,
        })
      },
      onDeleteItem (item) {
        _this.onDeleteItem(item.srSubuuid,item.srResuuid)
      },
      lookDetail(item) {
        _this.setState({
          detailModal: true,
          detailItem: item
         })
      }
    }
    const detailModalProps = {
      visible: detailModal,
      maskClosable: false,
      item: detailItem,
      title: '专题详情',
      onOk() {
        _this.setState({
          detailModal: false
        })
      },
      onCancel() {
        _this.setState({
          detailModal: false
        })
      }
    }
    const modalProps = {
      selectedKeys: selectedKeys,
      specialId: specialId,
      visible: addModal,
      maskClosable: false,
      title: '添加内容',
      resType: treeData,
      onOk(data,userId) {
        const {pageSize} = _this.state;
        _this.getContentList({currentPage:1, pageSize})
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
    return ( 
      <div className="special-content">
        <Button style={{marginRight: '20px',marginBottom: '20px'}} onClick={this.changUp}>上一步</Button>
        <Button type="primary" style={{marginBottom: '20px',marginRight: '20px'}} onClick={this.hanleChange}>添加</Button>
        {
          personList.length>0 && <Button type="primary" style={{marginBottom: '20px'}} onClick={this.save}>完成</Button>
        }
        <div className="special-table">
          <List {...listProps}/>
          <ContentModal {...modalProps} />
          <DetailModal {...detailModalProps} />
        </div>
      </div>
     );
  }
}
function mapStateToProps (state) {
  return {
    rsType: state.filterData.rsType,
    queType: state.filterData.queType
  }
}
export default connect(
  mapStateToProps
)(Content);