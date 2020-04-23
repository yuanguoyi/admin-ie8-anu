
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
        width: 150
      },
      {
        title: '类型',
        dataIndex: 'qsTypeName',
        align: 'center',
      },
      {
        title: '标题',
        dataIndex: 'qsTitle',
        align: 'center',
      },
      {
        title: '提问时间',
        dataIndex: 'qsCdate',
        align: 'center',
        render:(text,record) => {
          return timeFormat(text, 'yyyy-MM-dd')
        }
      },
      {
        title: '解答状态',
        dataIndex: 'qsState',
        align: 'center',
        render:(text,record)=> {
          if(text == 0) {
            return '未解答'
          } else if(text == 1){
            return '已解答'
          }
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (record) => (
          <span className="operation">
            <a className="edit" onClick={() => {this.props.onEditItem(record)}}>回答</a>
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
      rowKey={record => record.qsUuid}
    />
     );
  }
}
 
export default List;