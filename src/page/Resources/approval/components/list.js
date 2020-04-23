
import React, { Component } from 'react';
import { Table, Switch,Popconfirm  } from 'antd'
import { timeFormat } from '@/tool/util'
class List extends Component {
  state = {  }
  render() { 
    const { ...listProps } = this.props
    console.log(listProps)
    const { current, pageSize } = {...listProps.pagination}
    const columns = [
      {
        title: '序号',
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '资源类型',
        dataIndex: 'rsTypeName',
        align: 'center',
      },
      {
        title: '标题',
        dataIndex: 'rsTitle',
        align: 'center',
      },
      {
        title: '上传部门',
        dataIndex: 'rsDeptName',
        align: 'center',
      },
      {
        title: '上传时间',
        dataIndex: 'rsCdate',
        align: 'center',
        render:(text,record) => {
          return timeFormat(text, 'yyyy-MM-dd')
        }
      },
      {
        title: '审批状态',
        dataIndex: 'rsState',
        align: 'center',
        render:(text,record)=> {
          if(text == 0) {
            return '取消发布'
          } else if(text == 1){
            return '已发布'
          } else if (text==3) {
            return '待审核'
          } else if (text==4) {
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
            <a className="edit" onClick={() => {this.props.onEditItem(record,'1')}}>通过</a>
            <a className="line">|</a>
            <a className="edit" onClick={() => {this.props.onEditItem(record,'4')}}>不通过</a>
            <a className="line">|</a>
            <a className="edit" onClick={() => {this.props.lookDetail(record)}}>查看</a>
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
      rowKey={record => record.subUuid}
    />
     );
  }
}
 
export default List;