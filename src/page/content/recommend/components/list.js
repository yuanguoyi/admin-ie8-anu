
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
        title: '标题名称',
        dataIndex: 'ptTile',
        align: 'center',
      },
      {
        title: '上传部门',
        dataIndex: 'ptDeptName',
        align: 'center',
      },
      {
        title: '添加时间',
        dataIndex: 'ctime',
        align: 'center',
        render:(text)=>{
          return timeFormat(text,'yyyy-MM-dd')
        }
      },
      {
        title: '类型',
        dataIndex: 'ptResourceType',
        align: 'center',
        render:(text,record) => {
          if(text == 1) {
            return '资源类型'
          } else if(text == 2){
            return '答疑类型'
          }
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: 150,
        render: (record) => (
          record.ptTagType ==1 && 
         <span className="operation">
            <Popconfirm
              title="确定要取消推荐此项？"
              placement="left"
              onConfirm={() => {this.props.onDeleteItem(record)}}
            >
              <a className="del">取消推荐</a>
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
      rowKey={record => record.ptUnid}
    />
     );
  }
}
 
export default List;