
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
        title: '姓名',
        dataIndex: 'policeName',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        align: 'center',
      },
      {
        title: '阅读数',
        dataIndex: 'readings',
        align: 'center',
      },
      {
        title: '阅读时长(秒)',
        dataIndex: 'readtime',
        align: 'center',
      },
      {
        title: '提问数',
        dataIndex: 'questionsNum',
        align: 'center',
      },
      {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (record) => (
          <span className="operation">
            <a className="edit" onClick={() => {this.props.lookDetail(record)}}>查看详情</a>
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