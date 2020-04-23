
import React, { Component } from 'react';
import { Table, Switch,Popconfirm  } from 'antd'
import { timeFormat } from '@/tool/util'
class List extends Component {
  state = {  }
  render() { 
    const { ...listProps } = this.props
    const { current, pageSize } = {...listProps.pagination}
    const columns = [
      {
        title: '序号',
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '类型',
        dataIndex: 'qsTypeName',
        align: 'center',
      },
      {
        title: '问题',
        dataIndex: 'qsTitle',
        align: 'center',
      },
      {
        title: '添加时间',
        dataIndex: 'qsCdate',
        align: 'center',
        render:(text,record) => {
          return timeFormat(text, 'yyyy-MM-dd')
        }
      },
      {
        title: '发布状态',
        dataIndex: 'qsState',
        align: 'center',
        render:(text,record)=> {
          if(text == 0) {
            return '未发布'
          } else if(text == 1){
            return '已发布'
          } else if(text == 3){
            return '待审核'
          } else if(text == 4){
            return '审核不通过'
          }
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: 220,
        render: (record) => (
          <span className="operation">
            {/* {record.rsTagtype == 0 ? <a className="edit" onClick={() => {this.props.onRecommend(record)}}>推荐</a> : <a className="edit" style={{color:'#ccc'}}>已推荐</a>} */}
            {/* <a className="line">|</a> */}
            <a className="edit" onClick={() => {this.props.onEditItem(record)}}>编辑</a>
            <a className="line">|</a>
            <a className="edit" onClick={() => {this.props.lookDetail(record)}}>查看</a>
            <a className="line">|</a>
            <Popconfirm
              title="确定要删除此项？"
              placement="left"
              onConfirm={() => {this.props.onDeleteItem(record)}}
            >
              <a className="del">删除</a>
            </Popconfirm>
          </span>
        )
      },
    ]
    return ( 
      <Table
      {...listProps}
      pagination={{
        ...listProps.pagination,
        showTotal: total => `总共 ${total} 项`,
      }}
      columns={columns}
      rowKey={record => record.qsUuid}
    />
     );
  }
}
 
export default List;