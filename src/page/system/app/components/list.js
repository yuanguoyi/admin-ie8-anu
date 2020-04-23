
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
        title: '版本号',
        dataIndex: 'avName',
        align: 'center',
      },
      {
        title: '更新说明',
        dataIndex: 'avConent',
        align: 'center',
      },
      {
        title: '更新方式',
        dataIndex: 'avFlag',
        align: 'center',
        render:(text) => {
          if(text==0) {
            return '非强制'
          } else {
            return '强制'
          }
        }
      },
      {
        title: '下载地址',
        dataIndex: 'avUrl',
        align: 'center',
      },
      {
        title: '发布时间',
        dataIndex: 'avCdate',
        align: 'center',
        render:(text,record) => {
          return timeFormat(text, 'yyyy-MM-dd')
        }
      },{
        title: '状态',
        dataIndex: 'avState',
        align: 'center',
        render:(text,record) => {
          if(text==0) {
            return '未发布'
          } else {
            return '已发布'
          }
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (record) => (
          <span className="operation">
            <a className="edit" onClick={() => {this.props.onEditItem(record)}}>查看</a>
            <a className="line">|</a>
            <Popconfirm
              title="确定要撤回此项？"
              placement="left"
              onConfirm={() => {this.props.onDeleteItem(record)}}
            >
              <a className="del">撤回</a>
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
      // rowKey={record => record.roleId}
    />
     );
  }
}
 
export default List;