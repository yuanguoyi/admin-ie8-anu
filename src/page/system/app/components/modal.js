
import React, { Component } from 'react';
import { Form, Input,Row,Col,DatePicker, Select, Modal,Button } from "antd";
import Drawer from '@/components/Drawer/Drawer'
import '@/style/answer.less'
import {timeFormat} from '@/tool/util'
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
    const {visible} = modalProps;
    const item = modalProps.item || {}
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
            <Col span={12}> <span>版本号: </span> <span>{item.avName}</span></Col>
            <Col span={12}> <span>发布时间: </span> <span>{timeFormat(item.avCdate)}</span></Col>
            </Row>
            <Row className="item">
              <Col span={12}> <span>安装包: </span> <span>{item.avUrl}</span></Col>
              <Col span={12}> <span>更新方式: </span> <span>{item.avFlag == 0 ? '非强制更新' : '强制更新'}</span></Col>
            </Row>
            <Row className="item">
              <Col span={24} className="account">
                <p className="tit" style={{width:'65px'}}>更新说明:</p>
                <p>{item.avConent || '暂无更新说明'}</p>
              </Col>
            </Row>
          </div>
        </Drawer>
      </div>
     );
  }
}
export default AddModal;