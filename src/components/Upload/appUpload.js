import React, { Component } from 'react';
import {Upload,Icon, Button,Modal,message,Input,Spin} from 'antd'
import './upload.less'
import {baseURLDev,baseURLPro} from '@/tool/api-url'
// import secret from "@/tool/secret";
import {extname,upload} from '@/tool/util'
class FileUpload extends Component {
  state = { 
    fileList: [],
    defaultFileList: [],
    uploadStatus: ''
  }
  handleCancel = () => {
    this.setState({
      priviewVisible: false,
    });
  }
  // handleChange = (info) => {
  //   let fileList = info.fileList;
  //   // 1. 上传列表数量的限制
  //   //    只显示最近上传的一个，旧的会被新的顶掉
  //   fileList = fileList.slice(-2);

  //   // 2. 读取远程路径并显示链接
  //   fileList = fileList.map((file) => {
  //     if (file.response) {
  //       // 组件会将 file.url 作为链接进行展示
  //       file.url = file.response.url;
  //     }
  //     return file;
  //   });

  //   // 3. 按照服务器返回信息筛选成功上传的文件
  //   fileList = fileList.filter((file) => {
  //     if (file.response) {
  //       return file.response.status === 'success';
  //     }
  //     return true;
  //   });
  //   this.setState({ fileList });
  // }
  render() {
    let _this = this
    const {...UploadData} = this.props
    const uploadNum = UploadData.uploadNum
    const uploadFile = UploadData.uploadFile
    const {onRemoveVideo} = UploadData
    const uploadStatus = this.state.uploadStatus
    console.log(uploadFile)
    const loginData = sessionStorage.getItem("loginData");
    let userId = ''
    let acUuid = ''
    if(loginData) userId = JSON.parse(loginData).userId;
    const time=new Date().getTime();
    let param = {
      value: {
        data: {
          acUuid
        }
      },
      bool: true
    }
    const props = {
      action: process.env.NODE_ENV === 'development' ?  window.global_config.BASE_DEV_URL :  window.global_config.BASE_PRO_URL,
      name: 'wangEditorFile',
      headers: {
      },
      defaultFileList: uploadFile,
      data:{
        cmd:'importFile',
        // value: JSON.stringify({
        //   data: secret.Encrypt(JSON.stringify(param.value.data),true),
        //   userId,
        //   fromSource:1,
        //   osType:1,
        //   versionCode:"10001",
        //   version:"1",
        //   timeStamp : time,
        //   hashCode : secret.MD5(time),
        //   appId:"B55AB05AECBC43E6B84B3240AF3E3316",
        //   deviceId:""
        // })
      },
      // listType: 'picture-card',
      // fileList: imgList,
      onRemove: () => {
        const {uploadType} = UploadData
        // const {uploadImg} = UploadData
        // let fileList = uploadFile.splice(0,1)
        // fileList = []
        // uploadFile.push(fileList)
        // // let data = ''
        // console.log(uploadFile)
        // props.defaultFileList = []
        if(uploadType !== 'apk'){
          uploadFile.splice(0,1)
          onRemoveVideo()
        }
        
        //uploadImg(data)
        // _this.setState({
        //   defaultFileList: fileList
        //  })
      }, 
      onChange(info){
        const {uploadImg} = UploadData
        console.log(info)
        if(info.file.status == 'uploading'){
          _this.setState({
            uploadStatus: 'uploading'
          })
          // console.log(1)
        } else if (info.file.status === 'done') {
           let res = info.file.response
           uploadFile.push(info.fileList)
           _this.setState({
            uploadStatus: 'done'
          })
           uploadImg(res.data.url)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败。`);
        }
        console.log(info)
        //_this.handleChange(info)
      },  
      beforeUpload: (file) => {
        let _this = this
        const {uploadType} = UploadData
        const fileName = extname(file.name)
        if(uploadType == 'apk'){
          if(fileName!=='apk'){
            message.error('请上传apk文件')
            return false
          }
        } else if(uploadType == 'video'){
          if ((fileName=='mpeg' || fileName=='mp4' || fileName=='AVI' || fileName=='rmvb' || fileName=='mov' || fileName=='3GP' || fileName=='wma'  )) {

          } else {
            message.error('请上传视频文件')
            return false
          }
        }
      }
    };
    const uploadFilelength = props.defaultFileList
    return ( 
      <div className="clearfix">
        <Upload {...props} >
          {
           uploadFilelength.length < uploadNum && <Button type="ghost">
             {
               uploadStatus == 'uploading' ? <span><Spin />上传中</span> : <span><Icon type="upload" />点击上传</span>
             }
           </Button>
          }
        </Upload>
      </div>
     );
  }
}
 
export default FileUpload;