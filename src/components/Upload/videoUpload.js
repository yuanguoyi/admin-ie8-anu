import React, { Component } from 'react'
import {Button,Icon,message} from 'antd'
import '@/style/webuploader.css'
import {baseURLDev,baseURLPro} from '@/tool/api-url'
// import secret from "@/tool/secret";
import {extname} from '@/tool/util'
let uploader
let fileMd5
let fileName
let progress = 0;
let chunks
let loginData = sessionStorage.getItem("loginData");
let userId = ''
if(loginData) userId = JSON.parse(loginData).userId;
let time= new Date().getTime();
console.log(time)
class VideoUpload extends Component {
  state = { 
		isShowSelect: true
	 }
  componentDidMount() {
		const {...videoData} = this.props
		const type = videoData.createType
		const editType = videoData.editType
		const videoName = videoData.uploadVideo
		var _this = this
		if(type == 1 && editType == 0 && videoName!='') {
			// alert()
			// $("#picker").hide();
			// this.setState({
			// 	isShowSelect: false
			// })
			$("#picker").css('visibility','hidden')
			$('#thelist').append( '<div class="item">' +
					'<div class="fileWrap"><h4 class="info">' + videoName + '</h4><span class="delFile">删除</span></div>' +
				'</div>' );
			$('.delFile').bind('click',function() {
				_this.removeVideo()
				var fileItem = $(this).parent().parent();
				// uploader.removeFile($(fileItem).attr("id"), true);
				fileItem.remove();
				$("#picker").css('visibility','visible')
				// _this.setState({
				// 	isShowSelect: true
				// })
			})
		}
		WebUploader.Uploader.register(
			{
				"before-send-file": "beforeSendFile",//整个文件上传前
				"before-send": "beforeSend",  //每个分片上传前
				"after-send-file": "afterSendFile"  //分片上传完毕
			},
			{
				beforeSendFile:function (file){
					var deferred = WebUploader.Deferred();
					//1、计算文件的唯一标记fileMd5，用于断点续传  如果.md5File(file)方法里只写一个file参数则计算MD5值会很慢 所以加了后面的参数：10*1024*1024
					(new WebUploader.Uploader()).md5File(file, 0, 10 * 1024 * 1024).progress(function (percentage) {
						$('#' + file.id).find('.file-status').text('正在计算MD5...' + Math.round(percentage * 100) + "%");
					}).then(function (val) {
						$('#' + file.id).find(".file-status").text("计算完成,等待上传");
						fileMd5 = val;
						//获取文件信息后进入下一步
						deferred.resolve();
					});
					fileName = file.name; //为自定义参数文件名赋值
					// file.key = {"zjxUuid":zjxUuid,"eventUuid":eventUuid};
					return deferred.promise();
				},
				beforeSend:function(block,data){
					var deferred = WebUploader.Deferred();  
								chunks = block.chunks;
								console.log(chunks)
								console.log(userId)
								console.log(time)
                $.ajax({
	                type:"POST",  
	                url: process.env.NODE_ENV === 'development' ?  window.global_config.BASE_DEV_URL :  window.global_config.BASE_PRO_URL,   
	                data:{
										cmd:'CheckchunkktFile',
										// value: JSON.stringify({
										// 	data: secret.Encrypt(JSON.stringify({data:1}),true),
										// 	userId,
										// 	fromSource:1,
										// 	osType:1,
										// 	versionCode:"10001",
										// 	version:"1",
										// 	timeStamp : time,
										// 	hashCode : secret.MD5(time),
										// 	appId:"B55AB05AECBC43E6B84B3240AF3E3316",
										// 	deviceId:""
										// }),
										fileName:fileName,
										fileMd5:fileMd5,  //文件唯一标记  
										chunk:block.chunk,  //当前分块下标  
										chunkSize:block.end-block.start,//当前分块大小
										chunks:chunks 
	                },
	                cache: false,
	                async: false,
	                timeout: 1000, //超时的话，只能认为该分片未上传过
	                dataType:"json",  
	                success:function(data){
										console.log(data)
	                    if(data.code==1000){
	                        //分块存在，跳过  
	                        //deferred.reject();  
	                        // if(progress == 0){
	                        // 	progress = Math.round((data.hasChunks/chunks)*100);
	                        // }
	                    }else{  
												  if(data.data.code == 4000) {

													} else {
														//分块不存在或不完整，重新发送该分块内容  
														deferred.resolve();  
													}
	                        
	                    }
	                }
	            });
	           	this.owner.options.formData.fileMd5 = fileMd5;  
	            // this.owner.options.formData.zjxUuid = zjxUuid;
	            // this.owner.options.formData.eventUuid = eventUuid;
	            // this.owner.options.formData.flag = flag;
	            deferred.resolve();  
	            return deferred.promise(); 
				},
				afterSendFile: function(file){
					
				}	
			}
		)
    uploader = WebUploader.create({
			//设置选完文件后是否自动上传
			auto: true,
			// auto: false,
			//swf文件路径
			swf: '../../../public/js/Uploader.swf',
			// 文件接收服务端。
			server: process.env.NODE_ENV === 'development' ?  window.global_config.BASE_DEV_URL :  window.global_config.BASE_PRO_URL,
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，s可能是input元素，也可能是flah.
			pick: '#picker',
			chunked: true, //开启分块上传
			chunkSize: 50 * 1024 * 1024,
			chunkRetry: 3,//网络问题上传失败后重试次数
			threads: 1, //上传并发数
			//fileNumLimit :1,
			fileSizeLimit: 2000 * 1024 * 1024,//最大2GB
			fileSingleSizeLimit: 2000 * 1024 * 1024,
			resize: false, //不压缩
			duplicate: true,	// 允许重复上传
			accept: {
				 extensions: 'avi,asf,avs,mpg,mov,mp4,m4a,3gp,ogg,flv,ps,ts,dav,rmvb,SV4,SV5,SSDV,mpeg',
			},
			formData: {
				cmd:'imporChunkktFile',
				chunks:chunks,
				// value: JSON.stringify({
        //   data: secret.Encrypt(JSON.stringify({data:1}),true),
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
			}
		});	
		uploader.on('beforeFileQueued',function(file){
			let fileNameCheck = extname(file.name)
			if ((fileNameCheck=='mpeg' || fileNameCheck=='mp4' || fileNameCheck=='AVI' || fileNameCheck=='rmvb' || fileNameCheck=='mov' || fileNameCheck=='3GP' || fileNameCheck=='wma'  )) {

			} else {
				message.error('请上传视频文件')
				return false
			}
		})
		// 当有文件被添加进队列的时候
		uploader.on( 'fileQueued', function( file ) {
			$("#picker").hide();
			$('#thelist').append( '<div id="' + file.id + '" class="item">' +
					'<div class="fileWrap"><h4 class="info">' + file.name + '</h4><span class="delFile">删除</span></div>' +
					'<p class="file-status">等待上传...</p>' +
			'</div>');
			$('.delFile').bind('click',function() {
				_this.removeVideo()
				var fileItem = $(this).parent().parent();
				uploader.removeFile($(fileItem).attr("id"), true);
				fileItem.remove();
				$("#picker").show();
			})
		});	
		// 文件上传过程中创建进度条实时显示。
		uploader.on( 'uploadProgress', function( file, percentage ) {
			var $li = $( '#'+file.id)
			$li.find('.file-status').text('上传中  ' + Math.round(progress + (100 - progress) * percentage) + '%');
		});
		// 上传成功
		uploader.on('uploadSuccess', function (file,response) {
			const video = response.data.url
			_this.uploadVideo(video)
			$('#' + file.id).find('.file-status').text('上传成功');
		});
		// 上传失败
		uploader.on( 'uploadError', function( file ) {
			$( '#'+file.id ).find('.file-status').text('上传出错,请重新上传');
		});	
	}
	uploadVideo = (value) => {
		const {...videoData} = this.props
		const {upload} = videoData
		upload(value)
	  //console.log(videoData.uploadVideo)
	}
	removeVideo = ()=> {
		const {...videoData} = this.props
		const {onRemoveVideo} = videoData
		onRemoveVideo()
	}
  render() { 
		const isShowSelect = this.state.isShowSelect
    return ( 
      <div id="uploader" class="wu-example">
        <div id="thelist" class="uploader-list"></div>
        <div class="btns">
				    <div id="picker" className="selectFile">选择文件</div>
            {/* {
							isShowSelect && 
						} */}
						
            {/* <Button id="UploadBtn"  type="primary" style={{marginLeft:'10px'}} class="btn btn-default">开始上传</Button> */}
        </div>
      </div>
     );
  }
}
 
export default VideoUpload;
