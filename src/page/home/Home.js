/*
*   主页
* */

import React, { Component } from 'react';
import Header from "./Header";
import LeftNav from "./LeftNav";
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {commitDepart,commitRstype,commitQuetype} from '../../redux/actions/filterData'
import './Home.less'; 
import Request from "../../tool/request";
import Cookies from "js-cookie"
// import {getCookie} from '@/tool/util'
let newArray = []
let departMent = []
class Home extends Component {
  constructor(props,context) {
    super(props,context);
    this.state={
      navList: []
    }
  }
  // 获取资源类型
  getDictBatchComBoboxByCode = (parms) => {
    Request.post("",{
      cmd:"getDictComBoboxByCode",
      value: {
        data:{
          ...parms
        }
      },
      bool:true
    })
      .then((rest)=>{
        console.log("批量调取数据字典项",rest);
        if(rest.code == 1000){
          this.tree(rest.data);
          let resTypeArray = [...newArray]
          resTypeArray.forEach((item,index)=>{
            if (item.children.length>0) {
              let json = {label:'全部',value:item.value}
              item.children.unshift(json)
            }
          })
        console.log(resTypeArray)
          this.props.commitRstype(resTypeArray)
        }
      })
      .catch((msg)=>{
        // console.log("批量调取数据字典项msg:",msg);
      })
  };
   // 获取答疑类型
   getQueType = (codeCharCode) => {
    Request.post("",{
      cmd:"getDictComBoboxByCode",
      value: {
        data:{
          codeCharCode
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code === 1000){
          console.log(rest.data)
          this.props.commitQuetype(rest.data)
        }else{

        }
      })
      .catch((msg)=>{
        // console.log("批量调取数据字典项msg:",msg);
      })
   }
  // 5.2获取监区树
  getAreaByCode = (prisonCode) => {
    const that = this;
    Request.post("",{
      cmd:"getAreaByCode",
      value: {
        data:{
          prisonCode
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code === 1000){
          window.prisonCode = rest.data;       // 对象，有子元素
        }else{
          window.prisonCode = null;
        }
      })
      .catch((msg)=>{
        window.prisonCode = null;
      })
  };
  //树处理
  tree = (array) =>{
    array.map((item, index) => {
      item['label'] = item.codeName;
      item['value'] = item.codeUuid;
      delete item['codeName'];
      delete item['codeUuid'];
      if (item.children) {
        this.tree(item.children);
      }
      
    })
    newArray = [...array]
  }
  // 获取所有部门
  getAllDept = () => {
    Request.post("",{
      cmd: "getAllDept",
      value: {
        data: {
        }
      },
      bool: true
    })
    .then((rest)=>{
      if(rest.code === 1000){
        this.tree(rest.data);
        this.props.commitDepart(newArray)
      }
    })
  }
  // 获取发布对象
  getPushList = () => {
    Request.post("",{
      cmd: "getViewObj",
      value: {
        data: {
          rsUuid: ''
        }
      },
      bool: true
    })
    .then((rest)=>{
      if(rest.code === 1000) {
        // this.tree(rest.data);
        // this.props.commitCompany(newArray)
      }
    })
  }
  componentDidMount() {
    // const loginData = JSON.parse(sessionStorage.getItem("loginData"))
    // //const loginData = {}
    // let resourceList = loginData.resourceList
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
    // let parms ={
    //   codeCharCode:'/TypeState/resType',
    //   nextLevel:'1'
    // }
    // this.getDictBatchComBoboxByCode(parms);
    // this.getQueType('/TypeState/queType')
    // this.getPushList()


    /*
    * 基本情况完善
    * 1.3   性别
    * 1.7   民族
    * ZBMCZQK   自报名查证情况
    * 1.2   籍贯
    * 1.8   文化程度
    * 1.16   宗教信仰
    * 2.8.2   关押单位
    * checkState   审核状态
    * messengerType   信息员类型
    * EMLX   耳目类型
    * DTXXNR   信息内容分类
    * messageType   信息类别
    */
    /*
    * 资源管理
    * /TypeState/resType: 资源类型
    * 1.3:  调查人员性别
    * */
    
  }

  render() {
    let {navList} = this.state
    return (
      <div className="home">
        <div className="home-header">
          {/* Header */}
          <Header/>
        </div>
        <div className="home-content">
          <div className="home-left">
              <LeftNav navList={navList} />
          </div>
          <div className="home-right">
            <div className="home-right-wrap">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    
  }
}
function mapDispatchToProps(dispatch) {
  return {
    commitDepart: bindActionCreators(commitDepart, dispatch),
    commitRstype: bindActionCreators(commitRstype, dispatch),
    commitQuetype: bindActionCreators(commitQuetype, dispatch),
  }
}
//添加router至this.context
// Home.contextTypes = {
//   router: Object
// };

// export default Home
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);