
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
        width: 150
      },
      {
        title: '资源类型',
        dataIndex: 'srRestype',
        align: 'center',
      },
      {
        title: '资源标题',
        dataIndex: 'ssTitle',
        align: 'center',
      },
      {
        title: '上传时间',
        dataIndex: 'ssCdate',
        align: 'center',
        // render:(text)=>{
        //   return timeFormat(text,'yyyy-MM-dd')
        // }
      },
      {
        title: '发布状态',
        dataIndex: 'srState',
        align: 'center',
        render:(text,record) => {
          if(text == 0) {
            return '未发布'
          } else if(text == 1){
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
      // rowKey={record => record.roleId}
    />
     );
  }
}
 
export default List;