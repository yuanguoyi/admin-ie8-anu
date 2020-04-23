
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
    const catlogTree = modalProps.catlogTree
    
   }
   componentWillReceiveProps(nextProps){
    const {...modalProps} = this.props;
    const catlogTree = modalProps.catlogTree
    let selectedKeys = []
     if(catlogTree!==nextProps.catlogTree){
      let id = nextProps.catlogTree.length>0 && nextProps.catlogTree[0].key
      if (id) {
        selectedKeys.push(nextProps.catlogTree[0].key)
        this.setState({
          selectedKeys: selectedKeys
        })
        
      }
      
      // setTimeout(() => {
       
      // }, 300);
     
     }
   }
   handleOk = () => {
    const {onCancel} = this.props
    onCancel()
   }
   handleCancel = () => {
    const {onCancel} = this.props
    onCancel()
   }
   // 显/隐
  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  };
   changeTab = (key) => {
    const {...modalProps} = this.props;
    const {changeTab} = modalProps
    changeTab(key)
    let id = this.state.selectedKeys.join()
    this.getHtml(id)
    // let editor = document.getElementById('editorDetail')
    // if (editor) {
    //   editor.innerHTML = ''
    // }
    //  this.setState((prevState)=>({
    //   time: prevState + 1,
    //  }))
   }
   // 获取资源内容
   selectTree = (selectedKeys) => {
     console.log(selectedKeys)
    this.setState({
      selectedKeys: selectedKeys
    })
    let rshlRslsuuid = selectedKeys.join()
    this.getHtml(rshlRslsuuid)
   }
   getHtml = (rshlRslsuuid) => {
    Request.post("",{
      cmd:"getResourceHtml",
      value: {
        data:{
          rshlRslsuuid: rshlRslsuuid
        }
      },
      bool:true
    })
    .then((rest)=>{
      if(rest.code === 1000){
        let editor = document.getElementById('editorDetail')
        if (rest.data) {
          console.log(rest.data.rshlContent)
          editor.innerHTML= rest.data.rshlContent
        } else {
          editor.innerHTML= '<p>暂无内容</p>'
        }
      }
    })
    .catch((msg)=>{
    })
   }
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
    const catlogTree = modalProps.catlogTree
    console.log(catlogTree)
    const {tabKey} = modalProps;
    const {selectedKeys} = this.state
    const that = this;
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.key} title={item.title} />;
    });
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
        <Tabs activeKey={tabKey} onChange={this.changeTab}>
         <TabPane tab="基本信息" key="1">
           <div className="basic-info-modal">
             <Row className="item">
               <Col span={12}> <span>标题: </span> <span>{basicInfo.rsTitle}</span></Col>
               <Col span={12}> <span>类型: </span> <span>{basicInfo.rsTypeName}</span></Col>
             </Row>
             {/* <Row className="item">
               <Col span={12}> <span>单位: </span> <span>第八届全国人大常委会</span></Col>
               <Col span={12}> <span>查阅范围: </span> <span>{basicInfo.rsDeptName}</span></Col>
             </Row> */}
             <Row  className="item">
               <Col span={12}> <span>发布状态: </span> <span>{basicInfo.rsState == 0 ? '未发布': '已发布'}</span></Col>
               <Col span={12}> <span>查阅范围: </span> <span>{basicInfo.rsDeptName}</span></Col>
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
         </TabPane>
         <TabPane tab="文档内容" key="2">
           {
             catlogTree.length>0 ? <Row className="document">
             <Col span={5} className="left">
               <Tree
                 selectedKeys={selectedKeys}
                 defaultExpandAll
                 onSelect={this.selectTree}
               >
                 {loop(catlogTree)}
               </Tree>
             </Col>
             <Col span={19} className="right" >
               <div id="editorDetail"></div>
               {/* <div id='editor'style={{height:'600px',maxHeight:'600px'}} contentEditable="false"></div> */}
             </Col>
            </Row>
            : '暂无文档内容'
           }
           
         </TabPane>
          </Tabs>
        </Drawer>
      </div>
     );
  }
}
export default AddModal;