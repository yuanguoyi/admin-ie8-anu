
import React, { Component } from 'react';
import { Form, Input,Row,Col,DatePicker, Select, Modal,Button } from "antd";
import Drawer from '@/components/Drawer/Drawer'
import { timeFormat } from '@/tool/util'
// require('wangeditor')
import '@/style/answer.less'
let addTime = 1
class AddModal extends Component {
   state = { 
    item: {},
    time: 1,
   }
   componentWillUpdate (prevProps) {
     if (prevProps.visible && addTime == 1) {
        addTime ++ 
        setTimeout(() => {
          let html = JSON.parse(sessionStorage.getItem('newshtml'))
          let editor = document.getElementById('editorDetail')
          if (html.nsHtml!='') {
            editor.innerHTML= html.nsHtml
          } else {
            editor.innerHTML= '<p>暂无内容</p>'
          }
        }, 300);
     } else {
      setTimeout(() => {
        let html = JSON.parse(sessionStorage.getItem('newshtml'))
        let editor = document.getElementById('editorDetail')
        if (html && html.nsHtml!='') {
          if (editor) {
            editor.innerHTML= html.nsHtml
          }
        } else {
          if (editor) {
            editor.innerHTML= '<p>暂无内容</p>'
          }
         
        }
      }, 300);
     }
     
   }
   handleOk = () => {
    const {onOk} = this.props
    onOk()
   }
   handleCancel = () => {
    const {onCancel} = this.props
    onCancel()
   }
   checkState  = (state) => {
    if(state == 0){
      return '未发布'
    } else if(state==1){
      return '发布中'
    } else {
      return '取消发布'
    }
   }
  render() { 
    const {...modalProps} = this.props
    const {item,visible} = modalProps
    
    return ( 
      <div>
      <Drawer title="详情"
          wrapClassName="details-modal-wrap-modals"
          visible = {visible}
          onCancel={() => {
            this.handleCancel();
          }}
          footer={[
            <Button key="submit" onClick={() => {
              this.handleCancel();
            }}
            >
              返 回
            </Button>
          ]}
        >
         <div className="answer-modal answer-info question">
         <p className="title" style={{paddingLeft: '0px',textAlign:'left'}}>问题</p>
          <Row className="item">
            <Col span={8}> <span>新闻标题: </span> <span>{item.nsTitle}</span></Col>
            <Col span={8}> <span>发布状态: </span> <span>{this.checkState(item.nsState)}</span></Col>
            <Col span={8}> <span>发布时间: </span> <span>{timeFormat(item.nsCdate)}</span></Col>
          </Row>
          <p className="modal-title" style={{marginTop:'20px',textAlign:'left'}}>正文</p>
          <Row className="item">
            <Col span={24} className="account">
              <div className="account-title">新闻内容:</div>
              <div className="account-right">
                <p id="editorDetail"></p>
                {/* <div id='editor'style={{height:'400px',maxHeight:'400px'}} contentEditable="true"></div> */}
              </div>
            </Col>
          </Row>
         </div>
        </Drawer>
        </div>
     );
  }
}
export default AddModal;