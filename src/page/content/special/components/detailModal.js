
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
    const {...detailModalProps} = this.props;
    const {visible} = detailModalProps;
    const item = detailModalProps.item || {}
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
          <Row className="item">
            <Col span={12}> <span>资源标题: </span> <span>{item.ssTitle}</span></Col>
            <Col span={12}> <span>是否发布: </span> <span>{item.ssState == 0 ? '未发布' : '已发布'}</span></Col>
          </Row>
          <Row className="item">
            <Col span={12}> <span>资源类型: </span> <span>{item.srRestype}</span></Col>
          </Row>
          <Row className="item">
            <Col span={24} className="account">
              <p className="tit" style={{width:'40px'}}>内容:</p>
              <p>{item.ssHtml || '暂无内容'}</p>
            </Col>
          </Row>
         </div>
        </Drawer>
      </div>
     );
  }
}
export default AddModal;