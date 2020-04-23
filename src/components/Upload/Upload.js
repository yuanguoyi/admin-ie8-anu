import React, { Component } from 'react';
import {Upload,Icon, Modal,Message,Input} from 'antd'
import './upload.less'
class FileUpload extends Component {
  state = { 
    imgList: []
  }
  handleCancel = () => {
    this.setState({
      priviewVisible: false,
    });
  }
  render() {
    const {...fileData} = this.props
    const imgList = fileData.rsImg
    const uploadNum = fileData.uploadNum
    const {onRemove} = fileData
    const props = {
      action: '/upload.do',
      listType: 'picture-card',
      fileList: imgList,
      onPreview: (file) => {
        this.setState({
          priviewImage: file.url,
          priviewVisible: true,
        });
      },
      onRemove: () => {
        onRemove()
      },  
      beforeUpload: (file) => {
        let _this = this
        const {uploadImg} = fileData
        const isImg = file.type.indexOf('image/') != -1
        const isLt2M = file.size / 1024 / 1024 < 4
        if (!isImg) {
          Message.error('请上传图片!')
          return false
        }
        if (!isLt2M) {
          Message.error('上传图片大小不能超过 4MB!')
          return false
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          uploadImg(e.target.result)
          imgList.push({
            url: e.target.result,
            uid: Math.random(),
            name: file.name,
            status: 'done',
          })
          _this.setState({
            fileList: imgList
          })
        };
      }
    };
    const fileList = props.fileList
    return ( 
      <div className="clearfix">
        <Upload {...props}>
          {
            fileList.length < uploadNum && 
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传照片</div>
            </div>
          }
        </Upload>
        {/* <Input type="file" onChange={this.changeFile}  accept="image/jpeg,image/png,image/jpg" /> */}
        <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" src={this.state.priviewImage} style={{width: '100%'}} />
        </Modal>
      </div>
     );
  }
}
 
export default FileUpload;