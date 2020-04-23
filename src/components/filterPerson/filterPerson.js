
import React, { Component } from 'react';
import {Form,Dropdown,Input,Table} from 'antd'
import Request from "../../tool/request";
import './filter.less'
let timer = '';
class FilterPerson extends Component {
  state = { 
    loading: false,
    totalCount: 0,
    dataList: [],
    showFilter: false,
    value: ''
   }
  componentDidMount () {
    const {...filterData} = this.props
    // this.setState({
    //   value: filterData.prisonerName
    // })
    const {prisonerName} = filterData
    if(prisonerName!='') {
      this.setState({
        value: prisonerName
      })
    } else {
      // this.setState({
      //   value: ''
      // })
    }
    this.fetchHandler({
      currentPage: 1,
      size: 10
    })

  }
  handler = () => {
    this.setState({
      value: ''
    })
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    console.log(value)
    const {value} = this.state
    if (value !==nextProps.prisonerName) {
      this.setState({
        value: nextProps.prisonerName
      })
    }
  }
  fetchHandler = ({currentPage, size,value}) =>{  
    this.setState({
      loading: true
    })
    const that = this;
    Request.post("",{
      cmd: "getElPoliceList",
      value: {
        data: {
          keyWord: value,
          size: size,
          currentPage: currentPage,
        }
      },
      bool:true
    })
    .then((rest)=>{
      if(rest.code === 1000){
        that.setState({
          dataList: rest.data.data,
          totalCount: rest.data.totalCount,
          loading: false
        })
        if(rest.data.data.length == 0) {
          that.setState({
            value: ''
          })
        }
      }
    })
    .catch((err)=>{
      console.log("---",err)
    })
  }
  selectRow = (record,index) => {
    const {selectRowData} = this.props
    this.setState({
      showFilter: true,
      value: record.plName
    })
    selectRowData(record)
  }
  onChange = (event) => {
    console.log(event)
    
    this.setState({value: event.target.value});
    
    let that = this
    let inputValue = event.target.value
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      that.fetchHandler({
        currentPage: 1,
        size: 10,
        value: inputValue
      })
    }, 1000);
  }
  inputOnFocus = () => {
    this.setState({
      showFilter: false
    })
    const {value} = this.state
    if (value) {
      this.fetchHandler({
        currentPage: 1,
        size: 10,
        value: value
      })
    }
  }
  render() { 
    let that = this
    const columns = [
      {
        title: '姓名',
        dataIndex: 'plName',
        width:100
      },
      {
        title: '邮箱',
        dataIndex: 'plEmail',
        width:100
      },
      {
        title: '手机号',
        dataIndex: 'plMobilephone',
        width:200
      }
    ]
    const { totalCount,dataList,showFilter,value } = this.state
    const table = (
      <Table columns={columns} dataSource={dataList}
        className="filter-person"
        pagination={{
          showSizeChanger:true,
          simple: true,
          defaultCurrent: 1,
          pageSizeOptions:['10', '20', '50', '100'],
          total:totalCount,
          showTotal:(total) => `共 ${total} 条`,
          showQuickJumper:true,
          onShowSizeChange : (currentPage, size) => {
            that.fetchHandler({currentPage, size });
          },
          onChange:(currentPage,size) =>{
            that.fetchHandler({currentPage, size,value});
          }
        }}
        rowKey={record => record.jbxxAbbr}
        loading={this.state.loading}
        onRowClick= {(record,index)=>{
          that.selectRow(record,index)
        }}
      />
    )
    const notable = (
      <p></p>
    )
    return ( 

        <div>
          <Dropdown overlay={!showFilter? table : notable}>
              <Input placeholder= '请输入' value={this.state.value}  onFocus={this.inputOnFocus} onChange={this.onChange} 
              />
          </Dropdown>
        </div>
     );
  }
}
export default FilterPerson;