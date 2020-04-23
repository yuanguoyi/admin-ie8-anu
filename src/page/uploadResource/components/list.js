
import React, { Component } from 'react';
import { Table, Switch,Popconfirm  } from 'antd'
import { transformTimeStamp,timeFormat} from '@/tool/util'
// import moment from "moment"
class List extends Component {
  state = {  }
  render() { 
    const { ...listProps } = this.props
    const { current, pageSize } = {...listProps.pagination}
    const columns = [
      {
        title: '文件名',
        dataIndex: 'rsTypeName',
        align: 'center',
      },
      {
        title: '标题',
        dataIndex: 'rsTitle',
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'rsDeptName',
        align: 'center',
      },
      {
        title: '查阅范围',
        dataIndex: 'rsCdate1',
        align: 'center',
      },
      {
        title: '大小',
        dataIndex: 'rsCdate2',
        align: 'center',
      },
      {
        title: '上传目录',
        dataIndex: 'rsCdate3',
        align: 'center',
      },
      {
        title: '发布状态',
        dataIndex: 'rsState4',
        align: 'center',
        render:(text,record)=> {
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
            <a className="edit" onClick={() => {this.props.onEditItem(record)}}>编辑</a>
            <a className="line">|</a>
            <a className="edit" onClick={() => {this.props.lookDetail(record)}}>查看</a>
            <a className="line">|</a>
            {/* <a className="del" onClick={() => {this.props.onDeleteItem(record)}}>删除</a> */}
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
      rowKey={record => record.rsUuid}
    />
     );
  }
}
 
export default List;