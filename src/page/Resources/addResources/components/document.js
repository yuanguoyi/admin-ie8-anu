import React, { Component } from 'react';
import {Row,Col,Icon,Input,Button,message} from 'antd'
import Request from "@/tool/request";
// import secret from "@/tool/secret";
import {baseURLDev,baseURLPro} from '@/tool/api-url'
// require('wangeditor')
let timer
let isChangeRsulit = false
class Document extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          oneLevelList: [],
          twoLevelList: [],
          currentIndex: 0,
          twoCurrentIndex: '',
          current: 0,
          twoCurrent: 0,
          value:'',
          catlogIndex: 1,
          prevOneLength:'',
          catlogId: '',
          contentEdit: false,
          rshlUuid: '', // 资源内容id
          parentIndex: '',
          catlogActive: false,
          resourceTit: '' // 资源标题
         };
         
         this.handleOne = this.handleOne.bind(this)
         this.handleTwo = this.handleTwo.bind(this)
        //  this.mover = this.mover.bind(this)
        //  this.moverOut = this.moverOut.bind(this)
         this.addLevelOne = this.addLevelOne.bind(this)
        //  this.addTwoLevel = this.addTwoLevel.bind(this)
    }
    componentWillReceiveProps(nextProps){
      let oneLevelList =  nextProps.resourcesList
      oneLevelList.forEach((v,index) => {
        v['showOneBtn'] =  false
        v['isEdit'] = false
      })
      this.setState({
        oneLevelList: oneLevelList,
        catlogIndex: nextProps.resourcesList.length+1,
      })
      if(oneLevelList.length>0){
        this.getContent(oneLevelList[0].key)
        this.setState({
          catlogId:oneLevelList[0].key,
          resourceTit: oneLevelList[0].title
        })
      }
      // console.log('componentWillReceiveProps',this.state.oneLevelList)
    }
    // 跳转上一步
    gostepUp = ()=> {
      let {changeStep} = this.props
      changeStep()
    }
    // // 获取内容
    // getContent = ()=> {
    //   var content = this.editor.$txt.html();
    //   console.log(content);
    // }
    // 追加内容
    appendContent = (data)=> {
      this.editor.$txt.append(data);
    }
    // 清空内容
    clearContent = ()=>{
      this.editor.$txt.html('');
    }
    // 资源目录删除
    hanleDel(id) {
      //.log(id)
      Request.post("",{
        cmd:"delResourceDirect",
        value: {
          data:{
            rslsUuid: id,
          }
        },
        bool:true,
      })
      .then((res)=>{
        if(res.code === 1000){
          
        } else {
          message.error(res.msg);
        } 
      })
      .catch((msg)=>{
        message.error(msg);
      })
    }
    // 调用接口编辑目录
    editCatalog (id,name) {
     // console.log(id,name)
      Request.post("",{
        cmd:"updResourceDirect",
        value: {
          data:{
            rslsUuid: id,
            rslsName: name
          }
        },
        bool:true,
      })
      .then((res) => {
        if(res.code === 1000){
          
        } else {
          message.error(res.msg);
        } 
      })
      .catch((msg)=>{
        message.error(msg);
      })  
    }
    // 编辑一级目录名称
    hanleChange (id,index,name) {
      let levelList = this.state.oneLevelList
      levelList.forEach((e,i) => {
        if(i == index) {
          if(name.trim() == ''){
            return false
          }
          levelList[i].isEdit = false
        }
      });
      this.setState({
        oneLevelList: levelList,
        resourceTit: name
      })
      this.editCatalog(id,name)
    }
    // 编辑二级目录名称
    hanleChangeTwo (id,number,index,name) {
      let levelList = this.state.oneLevelList
      levelList.forEach((e,i) => {
        if(i == index) {
          if(name.trim() == ''){
            return false
          }
          levelList[i].children[number].isEdit = false
        }
      });
      this.setState({
        oneLevelList: levelList,
        resourceTit: name
      })
      this.editCatalog(id,name)
    }
    // 设置一级input value值
    changeOne (fileds,index,e) {
      let {oneLevelList} = this.state
      oneLevelList[index][fileds] = e.target.value
      this.setState({oneLevelList});
    }
    // 设置二级input value值
    changeTwo (fileds,number,index,e) {
      let {oneLevelList} = this.state
      oneLevelList[index].children[number][fileds] = e.target.value
      this.setState({oneLevelList});
    }
    // 鼠标移入显示一级图标
    moverOne (index) {
      let levelList = this.state.oneLevelList
      levelList.forEach((e,i) => {
        if(i == index) {
          levelList[i].showOneBtn = true
        }
      });
      this.setState({
        oneLevelList: levelList
      })
    }
    // 鼠标移出隐藏一级图标
    moverOutOne (index)  {
      let levelList = this.state.oneLevelList
      levelList.forEach((e,i) => {
        if(i == index) {
          levelList[i].showOneBtn = false
        }
      });
      this.setState({
        oneLevelList: levelList
      })
    }
    // 鼠标移入显示二级图标
    moverTwo (number,index) {
      let moveLevelList = this.state.oneLevelList
      moveLevelList.forEach((e,i) => {
      moveLevelList[index].children[number].showTwoBtn = true
      });
      this.setState({
        oneLevelList: moveLevelList
      })
    }
    // 鼠标移出隐藏二级图标
    moverOutTwo(number,index) {
      let moveLevelList = this.state.oneLevelList
      moveLevelList.forEach((e,i) => {
        moveLevelList[index].children[number].showTwoBtn = false
      });
      this.setState({
        oneLevelList: moveLevelList
      })
    }
    // 点击编辑按钮切换
    editLevel (index,name) {
      let levelList = this.state.oneLevelList
      levelList.forEach((e,i) => {
        if (i==index){
          if (levelList[index].isEdit == false) {
            if(name.trim() == ''){
              return false
            }
            levelList[index].isEdit = true
          } else if (levelList[index].isEdit == true) {
            if(name.trim() == ''){
              return false
            }
            levelList[index].isEdit = false
          }
        }
      });
      this.setState({
        oneLevelList: levelList
      })
    }
    editTwoLevel (number,index,name) {
      let levelList = this.state.oneLevelList
      levelList.forEach((e,i)=>{
        if (i==index){
          if (levelList[index].children[number].isEdit == false) {
            // if(name == ''){
            //   return false
            // }
            levelList[index].children[number].isEdit = true
          } else if(levelList[index].children[number].isEdit == true){
            if(name.trim() == ''){
              return false
            }
            levelList[index].children[number].isEdit = false
          }
        }
      })
      this.setState({
        oneLevelList: levelList
      })
    }
    // 资源目录新增
    addResourceDirect (id,name,index,type,oneIndex) {
      let rsUuid = this.props.resourcesId
     // console.log(rsUuid,id,name)
      Request.post("",{
        cmd:"addResourceDirect",
        value: {
          data:{
            rsUuid: rsUuid,
            pId: id,
            rslsName: name
          }
        },
        bool:true,
      })
      .then((res) => {
        if(res.code === 1000){
          let levelList = this.state.oneLevelList
          if (type == 1) {
            levelList.forEach((v,i)=>{
              if(i == index) {
                v['key'] = res.data.rslsUuid
                v['value'] = res.data.rslsLevelcode
              }
              if(index == 0){
                this.setState({
                  catlogId: res.data.rslsUuid
                })
              }
            })
          } else {
            levelList[oneIndex].children.forEach((v,i)=>{
              if(i == index) {
                v['key'] = res.data.rslsUuid
              }
            })
          }
          this.setState({
            oneLevelList: levelList
          })
        } else {
          message.error(res.msg);
        } 
      })
      .catch((msg)=>{
        message.error(msg);
      }) 
    }
    // 新增一级标题
    addLevelOne (event) {
      event.stopPropagation()
      // this.setState((prevState) => (
      //   {
      //     catlogIndex: prevState.catlogIndex +1
      //   }
      // ))
      let levelList = this.state.oneLevelList
      let oneCurrentIndex = levelList.length
      // let currentIndex = this.state.catlogIndex
      let json = {showOneBtn: false, isEdit: false,children:[],title: `一级目录${oneCurrentIndex+1}`}
      
      levelList.push(json)
      let resName = `一级目录${oneCurrentIndex+1}`
      if (oneCurrentIndex ==0){
        this.setState({
          resourceTit: resName
        })
      }
      let type = 1
      this.addResourceDirect('',resName,oneCurrentIndex,type,'')
      }
     // 新增二级标题
     addTwoLevel (index,id) {
       //console.log(id)
      let oneLevelList = this.state.oneLevelList
      let twoCurrentIndex = ''
      
      twoCurrentIndex = oneLevelList[index].children.length
      oneLevelList.forEach((e,i) => {
        if(i == index) {
          oneLevelList[i].children.push({
            showTwoBtn:false,
            isEdit: false,
            title: `二级目录${twoCurrentIndex+1}`
          })
        }
      });
      let type = 2
      let resName = `二级目录${twoCurrentIndex+1}`
      this.addResourceDirect(id,resName,twoCurrentIndex,type,index)
      this.setState({
        oneLevelList: oneLevelList
      })
    }
    // 点击增加背景色样式
    handleOne ( event ) {
      event.stopPropagation()
      isChangeRsulit = true
      this.setState({
        currentIndex: parseInt(event.currentTarget.getAttribute('data-index'), 10),
        catlogId: event.currentTarget.getAttribute('data-key'),
        twoCurrentIndex: '',
        catlogActive: true,
        resourceTit:  event.currentTarget.getAttribute('data-title'),
      })
      let catlogId = event.currentTarget.getAttribute('data-key')
      this.clearContent()
      this.getContent(catlogId)
    }
    handleTwo (event) {
      event.stopPropagation()
      this.setState({
        twoCurrentIndex: parseInt(event.currentTarget.getAttribute('data-twoindex'), 10),
        parentIndex: parseInt(event.currentTarget.getAttribute('data-parentIndex'), 10),
        currentIndex: '',
        catlogId: event.currentTarget.getAttribute('data-key'),
        catlogActive: true,
        resourceTit:  event.currentTarget.getAttribute('data-title'),
      })
      let catlogId = event.currentTarget.getAttribute('data-key')
      this.clearContent()
      this.getContent(catlogId)
    }
    // 删除一级目录
    delOneLevel = (index,id,event)=> {
      event.stopPropagation()
      let delLevelList = this.state.oneLevelList
      delLevelList.splice(index,1)
      this.hanleDel(id)
      this.setState({
        oneLevelList: delLevelList
      })
    }
    // 删除二级目录
    delTwoLevel (number,index,id,event) {
      event.stopPropagation()
      let delLevelList = this.state.oneLevelList
      delLevelList.forEach((e,i) => {
        if(i == index) {
          delLevelList[i].children.splice(number,1)
        }
      });
      this.hanleDel(id)
      this.setState({
        oneLevelList: delLevelList
      })
    } 
    // 发布资源
    sendDocument = () => {
      let rsUuid = this.props.resourcesId
      let range = this.props.range
      Request.post("",{
        cmd:"viewResource",
        value: {
          data: {
            rsUuid: rsUuid,
            rsState: range == 1 ? '3': '1'
          }
        },
        bool:true,
      })
      .then((res)=>{
        if(res.code === 1000){
          let {cancel} = this.props
          cancel()
          message.success('发布成功');
        } else {
          message.error(res.msg);
        } 
      })
    }
    // 获取资源
    getContent = (catlogId) => {
      Request.post("",{
        cmd:"getResourceHtml",
        value: {
          data: {
            rshlRslsuuid: catlogId,
          }
        },
        bool:true,
      })
      .then((res)=>{
        if(res.code === 1000){
          isChangeRsulit = false
          if (res.data) {
            this.setState({
              contentEdit: true,
              rshlUuid: res.data.rshlUuid
            })
            //this.clearContent()
            this.appendContent(res.data.rshlContent)
          } else {
            this.setState({
              contentEdit: false,
            })
          }
        } else {
          message.error(res.msg);
        } 
      })
    }
    // 点击保存编辑资源内容
    saveDocument = () => {
      let content = this.editor.$txt.html();
      let text = this.editor.$txt.text()
      let catlogId = this.state.catlogId;
      let rsUuid = this.props.resourcesId;
      let rshlUuid = this.state.rshlUuid
      let contentEdit = this.state.contentEdit;
      //console.log(rsUuid,rshlUuid,catlogId,content)
      if (catlogId == '') {
        //message.error("请选择目录")
        return 
      }
      if (contentEdit) {
        // if(){

        // }
        Request.post("",{
          cmd:"updResourceHtml",
          value: {
            data:{
              rshlUuid: rshlUuid,
              rshlContent: content
            }
          },
          bool:true,
        })
        .then((res)=>{
          if(res.code === 1000){
           // message.success('编辑成功')
          } else {
            message.error(res.msg);
          } 
        })
        .catch((msg)=>{
          message.error(msg);
        })
      } else {
        Request.post("",{
          cmd:"addResourceHtml",
          value: {
            data:{
              rshlReluuid: rsUuid,
              rshlRslsuuid: catlogId,
              rshlContent: content
            }
          },
          bool:true,
        })
        .then((res)=>{
          if(res.code === 1000){
            //message.success('保存成功')
            this.setState({
              contentEdit: true,
              rshlUuid: res.data
            })
          } else {
            message.error(res.msg);
          } 
        })
        .catch((msg)=>{
          message.error(msg);
        })
      }
    }
    componentDidMount() {
      let _this = this
      var id = 'editor';
      this.editor = new window.wangEditor(id);
      this.editor.config.uploadImgUrl = process.env.NODE_ENV === 'development' ?  window.global_config.BASE_DEV_URL :  window.global_config.BASE_PRO_URL;
      // 配置自定义参数（举例）
      const loginData = sessionStorage.getItem("loginData");
      let userId = ''
      // let userId = "ac4bc34fcac311e9a7e294de8009f9be";
      if(loginData) userId = JSON.parse(loginData).userId;
      const time=new Date().getTime();
      let data = {
        value:'1'
      }
      // this.editor.config.uploadParams = {
      //   cmd: 'importFile',
      //   value: JSON.stringify({
      //     data: secret.Encrypt(JSON.stringify(data),true),
      //     userId,
      //     fromSource:1,
      //     osType:1,
      //     versionCode:"10001",
      //     version:"1",
      //     timeStamp : time,
      //     hashCode : secret.MD5(time),
      //     appId:"B55AB05AECBC43E6B84B3240AF3E3316",
      //     deviceId:""
      //   })
      // };
      this.editor.config.uploadImgFileName = 'wangEditorFile'

      // 自定义load事件
      this.editor.config.uploadImgFns.onload = function (resultText, xhr) {
        // resultText 服务器端返回的text
        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
        
        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
        var originalName = _this.editor.uploadImgOriginalName || '';  
        var imgUrl = JSON.parse(resultText)
        // 如果 resultText 是图片的url地址，可以这样插入图片：
        var url = imgUrl.data.url
        _this.editor.command(null, 'insertHtml', '<img src="' + url + '" alt="' + originalName + '" style="max-width:100%;"/>');
        // 如果不想要 img 的 max-width 样式，也可以这样插入：
        // editor.command(null, 'InsertImage', resultText);
      }
      this.editor.config.menus =  [
        'source',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        '|',
        'img',
        '|',
        'undo',
        'redo',
        'fullscreen'
    ];
    // 配置 onchange 事件
    this.editor.onchange = function () {
       //.log(this.$txt.text());
      // 编辑区域内容变化时，实时打印出当前内容
      if (timer) clearTimeout
            timer = setTimeout(()=>{
            _this.saveDocument()
          },300)
        // if(!isChangeRsulit) {
          
        // }
    };
    this.editor.create();
    };
    render() {
      let {oneLevelList,currentIndex,twoCurrentIndex,parentIndex,showOneBtn,value,resourceTit} = this.state
      let range = this.props.range
        return (
            <div className="contain-wrap">
              <div>
                <div className="article-left">
                  <div className="article-title">
                    <span>章节目录</span>
                    <img src="/img/add.png" className="add_list"  onClick={this.addLevelOne} />
                  </div>
                  <ul className="level-one" id="menu-list" >
                    {
                     oneLevelList.map((item,index)=> {
                       return (
                        <li className={currentIndex === index ? 'active level-one-li' : 'level-one-li'} key={item.key}  data-index={index} data-key={item.key} data-title={item.title} onClick={this.handleOne} >
                          <div className="level-one-title" onMouseOver={this.moverOne.bind(this,index)} onMouseLeave ={this.moverOutOne.bind(this,index)}>
                            
                            {
                              item.isEdit ? <Input placeholder="请输入一级目录" value={item.title} onChange={this.changeOne.bind(this,'title',index)} onBlur={this.hanleChange.bind(this,item.key,index,item.title)} className="editOneInput"/> : <p className="oneName">{item.title}</p>
                            }
                            {
                              item.showOneBtn && <span>
                                <img src="/img/add.png" className="add-levelOne"  onClick={this.addTwoLevel.bind(this,index,item.value)} />
                                <img src="/img/edit.png" className="edit-levelOne"  onClick={this.editLevel.bind(this,index,item.title)} />
                                <img src="/img/del.png" className="del-levelOne"  onClick={this.delOneLevel.bind(this,index,item.key)} />
                              </span>
                            }
                            
                          </div>
                          <ul className="level-two" id="level-two">
                            {
                              item.children && item.children.map((item1,number)=> {
                              return (
                                <li onMouseOver={this.moverTwo.bind(this,number,index)} onMouseLeave={this.moverOutTwo.bind(this,number,index)} data-key={item1.key} data-parentindex={index} onClick={this.handleTwo} className={twoCurrentIndex === number && parentIndex === index  ? 'active level-two-li': 'level-two-li' } key={item1.key} data-twoindex={number} data-title={item1.title} >
                                  {
                                    item1.isEdit ? <Input placeholder="请输入二级目录"  value={item1.title} onChange={this.changeTwo.bind(this,'title',number,index)} onBlur={this.hanleChangeTwo.bind(this,item1.key,number,index,item1.title)} className="editTwoInput"/> : <p className="order">{item1.title}</p>
                                  }
                                  {
                                    item1.showTwoBtn && <span>
                                      <img src="/img/edit.png" className="edit-levelOne"  onClick={this.editTwoLevel.bind(this,number,index,item1.title)} />
                                      <img src="/img/del.png" className="del-levelOne"  onClick={this.delTwoLevel.bind(this,number,index,item1.key)} />
                                    </span>
                                  }
                                </li>
                                )
                              }) 
                            }
                          </ul>
                         </li> 
                        )
                       }
                      )
                    }
                  </ul>
                </div>
                
                <div className="article-right">
                  <div style={{marginTop: '-20px',fontSize:'14px',height:'20px'}}>{resourceTit}</div>
                  <div>
                      <div id='editor'style={{height:'600px',maxHeight:'600px'}} contentEditable="true"></div>
                  </div>
                  <div className="newxStep">
                    <Button style={{marginRight: '20px'}} onClick={this.gostepUp}>上一步</Button>
                    <Button type="primary" style={{marginRight: '20px'}} onClick={this.sendDocument}>{range == 1 ? '提交审核':'发布'}</Button>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

export default Document;