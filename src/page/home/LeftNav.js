/*
*   左侧导航
* */

import React, { Component } from 'react';
// import {withRouter} from  'react-router'
import { Icon } from 'antd';
import './style/LeftNav.less';
import Cookies from 'js-cookie'
class LeftNav extends Component {
  constructor(props,context) {
    super(props,context);
    this.state={
      position1:0,   // 指向1级
      position2:0,   // 指向2级
      position3:0,   // 指向3级
      navList:[
        {
          Level_1:{
            title:"资源管理",
            allTitle:"资源管理",
            icon:"book"
          },
          Level_2: [
            {
              list:[
                { title: "资源列表", path: "/home/resourcesList" },
                { title: "资源审批", path: "/home/approval" },
                { title: "上传资源", path: "/home/uploadResource" },
              ]
            },
          ]
        },
        {
          Level_1:{
            title:"答疑管理",
            allTitle:"答疑管理",
            icon:"file-text"
          },
          Level_2: [
            {
              title: "答疑管理",
              list:[
                { title: "答疑", path: "/home/answer" },
                { title: "答疑审批", path: "/home/answerApproval" },
                { title: "提问", path: "/home/question" },
                { title: "解答人设置", path: "/home/setting" },
              ]
            },
          ]
        },
        {
          Level_1:{
            title:"内容管理",
            allTitle:"内容管理",
            icon:"copy"
          },
          Level_2: [
            {
              title: "内容管理",
              list:[
                { title: "专题列表", path: "/home/special" },
                { title: "新闻列表", path: "/home/news" },
                { title: "推荐列表", path: "/home/recommend" }
              ]
            },
          ]
        },
        {
          Level_1:{
            title:"系统设置",
            allTitle:"系统设置",
            icon:"setting"
          },
          Level_2: [
            {
              title: "系统设置",
              list:[
                { title: "意见反馈", path: "/home/suggest" },
                { title: "版本管理", path: "/home/app" }
              ]
            },
          ]
        },
        {
          Level_1:{
            title:"资源统计",
            allTitle:"资源统计",
            icon:"book"
          },
          Level_2: [
            {
              title: "资源统计",
              list:[
                { title: "资源统计情况", path: "/home/resourceAnalyse" },
                { title: "答疑解惑情况", path: "/home/answerAnalyse" },
                { title: "用户情况", path: "/home/userAnalyse" },
              ]
            },
          ]
        },
      ]
    }
  }
  componentWillReceiveProps (nextProps,nextState) {
    // console.log(nextState)
    //this.goToHash();
    // //alert()
    // if ( this.state.navList.length>0) {
    //   alert()
      
    // }
  }
  // 路由跳转
  goToHash = () => {
    sessionStorage.removeItem('fiterValue')
    const {navList,position1,position2,position3}=this.state;
    if(navList.length>0 && navList[position1].Level_1.path){
      this.context.router.push({
        pathname:navList[position1].Level_1.path,
        state:{msg:navList[position1].Level_1.title}
      });
    }else {
      if (navList.length>0){
        this.context.router.push({
          pathname:navList[position1].Level_2[position2].list[position3].path,
          state:{msg:navList[position1].Level_2[position2].list[position3].title}
        });
      }
      
    }
  };

  // 点击一级导航
  levelClick1 = (item) => {
    let {navList}=this.state;
    for(let i = 0; i < navList.length; i++){
      if(navList[i]===item){
        this.setState({position1:i, position2:0, position3:0},()=>{
         this.goToHash();
        });
      }
    }
  };

  // 点击三级导航
  levelClick3 = (parentitem, item) => {
    let {navList,position1,position2}=this.state;
    let prveArr=navList[position1].Level_2;
    let posi2=prveArr.indexOf(parentitem);
    let posi3=prveArr[posi2].list.indexOf(item);
    console.log(posi2,posi3)
    this.setState({position2:posi2,position3:posi3},()=>{
      this.goToHash();
    });
  };

  componentDidMount() {
    //this.goToHash();
    // eventProxy.on('changeRouter', changeRouter => {
    //   this.setState({position2:0,position3:1},()=>{
    //     this.goToHash();
    //   });
    // })
    const loginData = JSON.parse(sessionStorage.getItem("loginData"));
    //const loginData = {}
    // let resourceList = loginData.resourceList
    // let nav = this.state.navList
    // let navList = []
    // resourceList.forEach((v,i)=>{
    //   navList.push({
    //     Level_1:{
    //       'title':v.name,
    //       'allTitle': v.name,
    //       'icon': v.csscode
    //     },
    //     Level_2:[{
    //       list:[]
    //     }]
    //   })
    //   if (v.children.length>0) {
    //     v.children.forEach((k,j)=>{
    //       navList[i].Level_2[0].list.push({'title':k.name,'path':k.url})
    //     })
    //   }
    // })
    // this.setState({
    //   navList: navList
    // })
    // setTimeout(()=>{
    //  this.goToHash();
    // },100)
  }
  render() {
    const {navList,position1,position2,position3}=this.state;
    console.log(navList)
    return (
      
      <div className="left-nav">
        <div className="Level-1">
          {navList.length>0 && this.renderNavList1(navList,position1)}
        </div>
        <div className="Level-2">
          <div className="allTitle">{navList.length>0 && navList[position1].Level_1.allTitle}</div>
          {navList.length>0 &&  this.renderNavList2(navList,position1,position2,position3)}
        </div>
      </div>
    );
  }

  renderNavList1(arr,position){
    return arr.map((item,index,array)=>{
      if(array[position]===item){
        return (
          <div className="Level-1-item checked" key={index} onClick={this.levelClick1.bind(this,item)}>
            <div>
              <Icon type={item.Level_1.icon} />
            </div>
            <p>{item.Level_1.title}</p>
          </div>
        )
      }else{
        return (
          <div className="Level-1-item" key={index} onClick={this.levelClick1.bind(this,item)}>
            <div>
              <Icon type={item.Level_1.icon} />
            </div>
            <p>{item.Level_1.title}</p>
          </div>
        )
      }
    });
  }

  renderNavList2(arr,position1,position2,position3){
    arr=arr[position1].Level_2;
    if (!arr || arr.length===0) return;
    let checked=arr[position2].list[position3];
    return arr.map((item,index,array)=>{
      return(
        <div className="Level-2-content" key={index}>
          {/* <div className="Level-2-header">{item.title}</div> */}
          {
            item.list.map((v,i,arr)=>{
              if(checked===v) {
                return (<div className="Level-2-item checked" key={i} onClick={this.levelClick3.bind(this,item,v)}>
                  {v.title}
                </div>);
              }else{
                return (<div className="Level-2-item" key={i} onClick={this.levelClick3.bind(this,item,v)}>
                  {v.title}
                </div>);
              }
            })
          }
        </div>
      );
    });
  }

}

//添加router至this.context
LeftNav.contextTypes = {
  router: Object
};

export default LeftNav