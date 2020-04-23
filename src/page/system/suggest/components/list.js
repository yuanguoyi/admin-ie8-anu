
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
        title: '反馈类型',
        dataIndex: 'typeName',
        align: 'center',
      },
      {
        title: '反馈内容',
        dataIndex: 'ideaContent',
        align: 'center',
      },
      {
        title: '用户',
        dataIndex: 'userName',
        align: 'center',
      },
      {
        title: '反馈时间',
        dataIndex: 'ideaCdate',
        align: 'center',
        render:(text)=>{
          return timeFormat(text)
        }
      },
      {
        title: '处理状态',
        dataIndex: 'ideaProcessing',
        align: 'center',
        render:(text,record)=> {
          if(text == 0) {
            return '未处理'
          } else if(text == 1){
            return '已读'
          } else if(text == 2){
            return '已导出'
          }
        }
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
      expandedRowRender={record => <p>{record.ideaContent}</p>}
      className="table"
      rowKey={record => record.ideaUnid}
    />
     );
  }
}
 
export default List;