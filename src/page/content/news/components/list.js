
import React, { Component } from 'react';
import { Table, Switch,Popconfirm  } from 'antd'
import {timeFormat} from '@/tool/util'
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
        title: '标题',
        dataIndex: 'nsTitle',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'nsState',
        align: 'center',
        render: (text) => {
          if(text == 0 ) {
            return '未发布'
          } else if(text == 1) {
            return '发布中'
          } else {
            return '取消发布'
          }
        }
      },
      {
        title: '发布时间',
        dataIndex: 'nsCdate',
        align: 'center',
        render:(text,record) => {
          return timeFormat(text, 'yyyy-MM-dd')
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (record) => (
          <span className="operation">
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
      rowKey={record => record.nsUnid}
    />
     );
  }
}
 
export default List;