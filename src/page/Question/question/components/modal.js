
import React, { Component } from 'react';
import { Form, Input,Row,Col,DatePicker, Select, Modal,Button } from "antd";
import { timeFormat } from '@/tool/util'
// require('wangeditor')
import '@/style/answer.less'
import Drawer from '@/components/Drawer/Drawer'
let addTime = 1
class AddModal extends Component {
   state = { 
    item: {},
    time: 1,
   }
  //  componentWillUpdate (prevProps) {
  //    if (prevProps.visible && addTime == 1) {
  //       addTime ++ 
  //       setTimeout(() => {
  //         var id = 'editor';
  //         this.editor = new window.wangEditor(id);
  //         this.editor.config.menus =  [
  //           'img',
  //           '|',
  //           'undo',
  //           'redo',
  //           'fullscreen'
  //         ];
  //         this.editor.disable();
  //         this.editor.create();
  //         let html = JSON.parse(sessionStorage.getItem('questionHtml'))
  //         this.editor.$txt.append(html.elAnswer.asHtml)
  //       }, 300);
  //    } else {
  //     let html = JSON.parse(sessionStorage.getItem('questionHtml'))
  //     this.editor && this.editor.$txt.html('<p><br></p>');
  //     this.editor && this.editor.$txt.append(html.elAnswer.asHtml)
  //    }
     
  //  }
   handleOk = () => {
    const {onOk} = this.props
    onOk()
   }
   handleCancel = () => {
    const {onCancel} = this.props
    onCancel()
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
            <Col span={8}> <span>类型: </span> <span>{item.qsTypeName}</span></Col>
            <Col span={8}> <span>查阅范围: </span> <span>{item.qsDeptName}</span></Col>
            <Col span={8}> <span>添加时间: </span> <span>{timeFormat(item.qsCdate)}</span></Col>
          </Row>
          <Row className="item">
            <Col span={24}> <span>问题: </span> <span>{item.qsTitle}</span></Col>
          </Row>
          <Row className="item">
            <Col span={24} className="account">
              <p className="tit" style={{width:'40px'}}>简介:</p>
              <p>{item.qsHtml}</p>
            </Col>
          </Row>
          <p className="modal-title" style={{marginTop:'20px',textAlign:'left'}}>回答</p>
          <Row className="item">
            <Col span={24} className="account">
              <p style={{width: '75px'}}>问题回答:</p>
              <p>
                还未回答
                {/* <div id='editor'style={{height:'400px',maxHeight:'400px'}} contentEditable="true"></div> */}
              </p>
            </Col>
          </Row>
        </div>
        </Drawer>
      </div>
      // <Modal 
      //   {...modalProps} onOk={this.handleOk} onCancel={this.handleCancel}
      //   okText="关闭" cancelText="取消"
      //   wrapClassName="vertical-center-add8-modal"
      //   className="answer-modal answer-info question"
      // >
        
      // </Modal>
     );
  }
}
export default AddModal;