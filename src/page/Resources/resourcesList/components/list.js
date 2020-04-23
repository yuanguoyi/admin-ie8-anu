
import React, { Component } from 'react';
import { Table, Switch,Popconfirm  } from 'antd'
import { transformTimeStamp,timeFormat} from '@/tool/util'
class List extends Component {
  state = {  }
  render() { 
    const { ...listProps } = this.props
    const {dataSource,isProvicalUser} = listProps
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
        title: '发布状态',
        dataIndex: 'rsState',
        align: 'center',
        render:(text,record)=> {
          if(text == 0) {
            return '未发布'
          } else if(text == 1){
            return '已发布'
          } else if (text == 3) {
            return '待审核'
          } else if (text == 4) {
            return '审核不通过'
          }
        } 
      },
      {
        title: '操作',
        key: 'operation',
        width: 200,
        render: (record) => (
          <span className="operation">
            {/* {record.rsTagtype == 0 ? <a className="edit" onClick={() => {this.props.onRecommend(record)}}>推荐</a> : <a className="edit" style={{color:'#ccc'}}>已推荐</a>} */}
            {/* <a className="line">|</a> */}
            <span><a className="edit" onClick={() => {this.props.onEditItem(record)}}>编辑</a><a className="line">|</a></span>
            <a className="edit" onClick={() => {this.props.lookDetail(record)}}>查看</a>
            {
              record.urReleasetype == 1 && record.rsState == 1 && !isProvicalUser ? null :<span>
                <a className="line">|</a>
                <Popconfirm
                  title="确定要删除此项？"
                  placement="left"
                  onConfirm={() => {this.props.onDeleteItem(record)}}
                >
                  <a className="del">删除</a>
                </Popconfirm>
              </span> 
            }
            
          </span>
        )
      },
      {
        title: '排序',
        key: 'operation2',
        width: 200,
        render: (text,record,index) => (
          <span className="operation">
            {index !==0 && <a className="edit" onClick={() => {this.props.moveUp(record,index)}}>上移</a>}
            {index!==0 && <a className="line">|</a>}
            {index !== dataSource.length-1 && <a className="edit" onClick={() => {this.props.moveDown(record,index)}}>下移</a>}
            {index !== dataSource.length-1 && <a className="line">|</a>}
            {record.rsIstop==1 ? <a className="edit" onClick={() => {this.props.isTopCancel(record)}}>取消置顶</a> : <a className="edit" onClick={() => {this.props.isTop(record)}}>置顶</a> }
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