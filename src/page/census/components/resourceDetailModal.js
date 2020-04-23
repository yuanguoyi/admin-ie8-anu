

import React, { Component } from 'react';
import { Form,Tree,Input, Tabs,Row,Col,DatePicker, Select, Modal,Button } from "antd";
import Request from "@/tool/request";
import '@/style/resources.less'
import Drawer from '@/components/Drawer/Drawer'
// require('wangeditor')
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
let timer ="" 
class AddModal extends Component {
  state = { 
    treeData: [],
    time: 1,
    selectedKeys: [],
    modalVisible: false,
   }
   componentDidMount() {
    const {...modalProps} = this.props;
   }
   handleOk = () => {
    const {onCancel} = this.props
    onCancel()
   }
   handleCancel = () => {
    const {onCancel} = this.props
    onCancel()
   }
   // 获取资源内容
   renderImg (basicInfo){
    return (
     <div className="account">
       <p className="tit">封面:</p>
        {
          basicInfo.rsImg ? <p><img src={basicInfo.rsImg} className="coverImg" /></p> : '暂无'
        }
     </div>
    ) 
   }
   renderVideo (basicInfo) {
    return (
      <div className="account">
        <p className="tit">视频:</p>
         {
           basicInfo.rsPath ? <p>{basicInfo.rsPath}</p> : '暂无'
         }
      </div>
     )
   }
  render() { 
    const {...modalProps} = this.props;
    const basicInfo = modalProps.item;
    const {visible} = modalProps
    const that = this;
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
          <div className="basic-info-modal">
             <Row className="item">
               <Col span={12}> <span>标题: </span> <span>{basicInfo.rsName}</span></Col>
               <Col span={12}> <span>类型: </span> <span>{basicInfo.rsTypeName}</span></Col>
             </Row>
             {/* <Row className="item">
               <Col span={12}> <span>单位: </span> <span>第八届全国人大常委会</span></Col>
               <Col span={12}> <span>查阅范围: </span> <span>{basicInfo.rsDeptName}</span></Col>
             </Row> */}
             <Row  className="item">
               <Col span={12}> <span>发布状态: </span> <span>{basicInfo.rsState == 0 ? '未发布': '已发布'}</span></Col>
               <Col span={12}> <span>查阅范围: </span> <span>{basicInfo.urReleasetype == 1 ? '省局' : '本单位'}</span></Col>
             </Row>
             {/* <Row  className="item">
               <Col span={12}> <span>发布状态: </span> <span> 已发布</span></Col>
               <Col span={12}> <span>阅读数: </span> <span>10010人</span></Col>
             </Row>
             <Row  className="item">
               <Col span={12}> <span>收藏数: </span> <span> 300人</span></Col>
               <Col span={12}> <span>下载数: </span> <span>300 次</span></Col>
             </Row> */}
             <Row  className="item">
              <Col span={24} >
                {
                 basicInfo.rsRealType == 1 ? that.renderImg(basicInfo) : that.renderVideo(basicInfo)
                }
                
              </Col>
             </Row>
             <Row  className="item">
               <Col span={24} className="account">
                 <p className="tit">简介:</p>
                 {
                   basicInfo.rsMemo ? <p>{basicInfo.rsMemo}</p> : <p>暂无</p>
                 }
               </Col>
             </Row>
           </div>
        </Drawer>
      </div>
     );
  }
}
export default AddModal;