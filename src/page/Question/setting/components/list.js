
import React, { Component } from 'react';
import { Table, Switch,Popconfirm  } from 'antd'
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
        title: '姓名',
        dataIndex: 'urAsusername',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'urUserdeptname',
        align: 'center',
      },

      {
        title: '负责类别',
        dataIndex: 'urAstypeName',
        align: 'center',
      },
      {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (record) => (
          <span className="operation">
            <a className="edit" onClick={() => {this.props.onEditItem(record)}}>修改</a>
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