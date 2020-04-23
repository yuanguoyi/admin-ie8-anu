import React, { Component } from 'react';
import {Icon, Modal,Message} from 'antd'
import Upload from 'rc-upload';
import './upload.less'
class FileUpload extends Component {
  state = {  }
  handleCancel = () => {
    this.setState({
      priviewVisible: false,
    });
  }
  render() {
     
    const props = {
      action: '/upload.do',
      data: { a: 1, b: 2 },
      headers: {
        Authorization: 'xxxxxxx',
      },
      multiple: true,
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
        thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
      }],
      onStart: (file) => {
        console.log('onStart', file);
        let fileBase64 = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(fileBase64);
        reader.onload  = function (e) {
          console.log(e.target.result)
          // 图片的base64格式,可以直接当成img的src属性值
          // let dataURL = reader.result;
          // console.log(dataURL)
          // let dataURL64 = dataURL.split(',');
          // console.log(dataURL64)
        };
        // this.refs.inner.abort(file);
      },
      onSuccess(file) {
        console.log('onSuccess', file);
      },
      onProgress(step, file) {
        console.log('onProgress', Math.round(step.percent), file.name);
      },
      onError(err) {
        console.log('onError', err);
      },
      beforeUpload: (file) => {
        const isImg = file.type.indexOf('image/') != -1
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isImg) {
          Message.error('请上传图片!')
          return false
        }
        if (!isLt2M) {
          Message.error('上传图片大小不能超过 2MB!')
          return false
        }
      }
    };
    
    const {...fileData} = this.props
    const uploadNum = fileData.uploadNum
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
        <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" src={this.state.priviewImage} style={{width: '100%'}} />
        </Modal>
      </div>
     );
  }
}
 
export default FileUpload;