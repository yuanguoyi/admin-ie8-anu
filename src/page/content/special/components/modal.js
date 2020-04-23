
import React, { Component } from 'react';
import { Form, Input,Row,Col,DatePicker, Select, Modal,Button } from "antd";
import '@/style/answer.less'
import Drawer from '@/components/Drawer/Drawer'
const FormItem = Form.Item;
const Option = Select.Option;

class AddModal extends Component {
  state = { 

   }
   handleOk = () => {
    const {onOk} = this.props
    onOk()
   }
   handleCancel = () => {
    const {onCancel} = this.props
    onCancel()
   }
  render() { 
    const {...modalProps} = this.props;
    const {visible} = modalProps
    const item = modalProps.item || {}
    return ( 
      <div>
        <Drawer title="专题详情"
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
        <Row className="item">
          <Col span={12}> <span>专题名称: </span> <span>{item.subTitle}</span></Col>
          <Col span={12}> <span>是否发布: </span> <span>{item.subState == 0 ? '未发布' : '已发布'}</span></Col>
        </Row>
        <Row className="item">
          <Col span={12}> <span>推送部门: </span> <span>新民警必备知识</span></Col>
        </Row>
        <Row className="item">
          <Col span={24} className="account">
            <p className="tit" style={{width:'40px'}}>封面:</p>
            <p>
              {
                item.subImg && item.subImg!='' ? <img src={item.subImg} className="coverImg" /> : '暂无封面'
              }
            </p>
          </Col>
        </Row>
        <Row className="item">
          <Col span={24} className="account">
            <p className="tit" style={{width:'40px'}}>简介:</p>
            <p>{item.subDescribe || '暂无简介'}</p>
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