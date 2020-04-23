import React, { Component } from 'react'
import '@/style/analys.less'
import echarts from 'echarts'
import {Tabs} from 'antd'
import Request from "@/tool/request";
const TabPane = Tabs.TabPane;
const loginData = JSON.parse(sessionStorage.getItem("loginData"))
// console.log(this.props.location.query.id)

let rsTypeList = []
let readTime = []
let rsDate = []
let readNumberDate = []
let readNumberTime = []
let timer,myChart,lineChart,readChart
class UserDetail extends Component {
  state = { 
    userDetail: {}
   }
  getPersonInfo = () => {
    let policeId = this.props.location.query.id
    Request.post("",{
      cmd: "getPoliceDetailsInfo",
      value: {
        data: {
          userId: loginData.userId,
          policeId: policeId
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        this.setState({
          userDetail: res.data,
          total: res.data.total,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      } 
    })
    .catch((msg)=>{
      
    })
  } 
  getDocument = () =>{
    let policeId = this.props.location.query.id
    Request.post("",{
      cmd: "getPoliceUseResourceTypeSituation",
      value: {
        data: {
          userId: loginData.userId,
          policeId: policeId
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        let data = res.data
          data.map(item =>{
            item['name'] = item.codeName
            item['value'] = item.readings
            delete item['codeName']
            delete item['readings']
            delete item['codeUuid']
          })
          rsTypeList = [...data]
      }
    })
    .catch((msg)=>{
      
    })
  }
  readTime = () => {
    let policeId = this.props.location.query.id
    Request.post("",{
      cmd: "getPoliceRecentlyReadtime",
      value: {
        data: {
          userId: loginData.userId,
          policeId: policeId,
          day:6
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        let data = res.data
        readTime = []
        rsDate = []
        data.forEach(item => {
          readTime.unshift(item.readtime)
          rsDate.unshift(item.rsDate)
        })
      }
    })
    .catch((msg)=>{
      
    })
  }
  readNumber = () => {
    let policeId = this.props.location.query.id
    Request.post("",{
      cmd: "getPoliceRecentlyReadings",
      value: {
        data: {
          userId: loginData.userId,
          policeId: policeId,
          day:6
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        let data = res.data
        readNumberTime = []
        readNumberDate = []
        data.forEach(item => {
          readNumberTime.unshift(item.readtime)
          readNumberDate.unshift(item.rsDate)
        })
      }
    })
    .catch((msg)=>{
      
    })
  }
  componentDidMount(){
    // this.getPersonInfo()
    // this.getDocument()
    // this.readTime()
    // this.readNumber()
    if (timer) {
      clearInterval(timer)
    }
    timer = setTimeout(()=>{
      myChart = echarts.init(document.getElementById('res-echarts'));
      lineChart = echarts.init(document.getElementById('lineChart'));
      readChart = echarts.init(document.getElementById('readChart'));
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        calculable: true,
        itemStyle:{
          normal:{
            color:function(params) {
              //自定义颜色
              var colorList = [          
                '#FFB40E', '#47CACA', '#3792FF',
                  ];
                  return colorList[params.dataIndex]
              }
          }
        },
        series: [
          {
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: rsTypeList,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      });
      lineChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: rsDate
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
              name:'阅读时长',
              type:'line',
              stack: '总量',
              data: readTime,
              itemStyle : { 
                normal : { 
                  color:'#F14964', //改变折线点的颜色
                  lineStyle:{ 
                  color:'#F14964' //改变折线颜色
                  } 
                } 
              },
            },
        ]
      })
      readChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: rsDate
        },
        yAxis: {
          type: 'value'
        },
        series: [
            {
                type:'line',
                stack: '总量',
                data: readTime,
                itemStyle : { 
                  normal : { 
                    color:'#47CACA', //改变折线点的颜色
                    lineStyle:{ 
                    color:'#47CACA' //改变折线颜色
                    } 
                  } 
                },
            },
        ]
      })
    },300)
  }
  changTab = () => {

  }
  render() { 
    const {userDetail} = this.state
    return ( 
      <div className="analys-wrap">
          <div>
            <div className="main-wrap" style={{marginBottom:'20px'}}>
              <div className="upload"  style={{float: 'left',width:'49%'}}>
                <div className="res-title">人员信息</div>
                <div className="resource-wrap person-wrap" >
                  <p className="person-item"><span className="person-yuan" ></span><span className="person-tit">姓名：</span><span>{userDetail.policeName}</span></p>
                  <p className="person-item"><span className="person-yuan" ></span><span className="person-tit">单位：</span><span>{userDetail.deptName}</span></p>
                  <p className="person-item"><span className="person-yuan" ></span><span className="person-tit">阅读数：</span><span>{userDetail.readings}</span></p>
                  <p className="person-item"><span className="person-yuan" ></span><span className="person-tit">阅读时长：</span><span>{userDetail.readtime}秒</span></p>
                  <p className="person-item"><span className="person-yuan" ></span><span className="person-tit">提问数：</span><span>{userDetail.questionsNum}</span></p>
                </div>
              </div>
              <div className="resource-document" style={{float: 'right'}}>
                <div className="res-title">资源文档类别</div>
                <div className="resource-wrap">
                  <div className="res-echarts" id="res-echarts"></div>
                  <div className="res-right">
                    {
                      rsTypeList.map(item=>{
                        return(
                          <div className="item">
                            <span className="yuan"></span>
                            <span className="title">{item.name}</span>
                            <span>{item.value}篇</span>
                          </div>
                        )
                      })
                    }
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="main-wrap">
              <div className="resource-document">
                <div className="res-title">最近七天阅读时长</div>
                <div className="resource-wrap">
                  {/* <div className="read-title">
                    <div className="item">
                     <p>
                        <span className="yuan" style={{background:'#F14964'}}></span><span>法律法规阅读量</span>
                     </p>
                     <p className="number">234</p>
                    </div>
                  </div> */}
                  <div id="lineChart" className="lineChart"></div>
                </div>
              </div>
              <div className="resource-document" style={{float:'right'}}>
                <div className="res-title">最近七天阅读数</div>
                <div className="resource-wrap">
                   {/* <div className="read-title">
                      <div className="item">
                      <p>
                          <span className="yuan" style={{background:'#F14964'}}></span><span>法律法规阅读量</span>
                      </p>
                      <p className="number">234</p>
                      </div>
                   </div> */}
                  <div id="readChart" className="lineChart"></div>
                </div>
              </div>
            </div>
          </div>
      </div>
     );
  }
}
 
export default UserDetail;