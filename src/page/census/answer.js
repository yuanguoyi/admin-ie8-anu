import React, { Component } from 'react'
import '@/style/analys.less'
import echarts from 'echarts'
import {Tabs,message} from 'antd'
import Modal from './components/answerTypeModal'
import Request from "../../tool/request";
import AnswerModal from './components/AnswerModal'
const TabPane = Tabs.TabPane;
const loginData = JSON.parse(sessionStorage.getItem("loginData"))
let rsTypeList = []
let recentDay = []
let uploadNumber = []
let allReadNumber = '' // 文档阅读总数量
let alldocumentDate = [] // 文档阅读天数
let rulesData = [] // 规章制度
let lawProces = [] // 执法流程
let lawCase = [] // 执法案例
let Punishment = [] // 刑罚执行
let lifeList = [] // 生活卫生
let allReadList = []
let recentReadNumber = [] // 答疑最近七天阅读量
let timer,myChart,upload,lineChart
class Resource extends Component {
  state = { 
    addModal: false,
    rsDataList:[],
    rsDataTotal:'',
    detailModal:  false, // 查看详情弹框
    currentItem: '',
    modalType: 'create',
    qsTypeId: '',
    allHotDocument: []
   }
   // 最近七天问答情况
   getRecentUpload () {
    Request.post("",{
      cmd:"getRecentlyUploadedAnsweringQuestionSituation",
      value: {
        data:{
          userId: loginData.userId,
          day: 6
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code===1000){
         recentDay = []
         uploadNumber = []
         rest.data.forEach(item => {
          recentDay.unshift(item.qsDate)
          uploadNumber.unshift(item.qsNumber)
         });
        }else{
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{

      })
   }
   // 答疑解惑分档分布
  getDocument () {
    Request.post("",{
      cmd:"getAnsweringQuestionsDistribution",
      value: {
        data:{
          userId: loginData.userId,
        }
      },
      bool:true
    })
    .then((rest)=>{
        if(rest.code===1000){
          let data = rest.data.qsTypeList
          data.map(item =>{
            item['name'] = item.codeName
            item['value'] = item.rsNumber
            delete item['codeName']
            delete item['rsNumber']
          })
          rsTypeList = [...data]
          this.setState({
            rsDataTotal: rest.data.qsTotal
          })
        }else{
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{

      })
   }
   // 热门文档
   getHotDocument() {
    Request.post("",{
      cmd:"getPopularAnsweringQuestionList",
      value: {
        data:{
          userId: loginData.userId,
          pageSize: 10000
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code===1000){
          this.setState({
            allHotDocument: rest.data[0].qsReadingList
          })
        }else{
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{

      })
   }
   // 文档阅读量
   getDocumentRead () {
    Request.post("",{
      cmd:"getRecentlyAnsweringQuestionReadings",
      value: {
        data:{
          userId: loginData.userId,
          day:6
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code===1000){
          let data = rest.data.qsTypeList
          allReadNumber = rest.data.qsTotal
          let documentDate = data[0].rsReadingList
          recentReadNumber = []
          data.forEach(item=>{
            let readingsList = []
            item.rsReadingList.forEach(e =>{
              readingsList.push(e.readings)
            })
            let json = {name:item.codeName,type:'line',stack:'总量',data:readingsList}
            recentReadNumber.push(json)
          })
          console.log(recentReadNumber)
          allReadList = rest.data.qsTypeList
        }else{
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{

      })
   }
  componentDidMount(){
    // this.getDocument()
    // this.getRecentUpload()
    // this.getDocumentRead()
    // this.getHotDocument()
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      myChart = echarts.init(document.getElementById('res-echarts'));
      upload = echarts.init(document.getElementById('upload'));
      lineChart = echarts.init(document.getElementById('lineChart'));
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
              var colorList = ['#F14964', '#8B4BE2', '#3792FF', '#47CACA','#FFB40E','#B4FF0E','#430EFF','#FF0EE5'];
                return colorList[params.dataIndex]
            }
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['60%', '38%'],
            data: rsTypeList,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      });
        let _this = this
        myChart.on('click',function (item) {
          _this.setState({
            addModal: true,
            qsTypeId: item.data.codeUuid, 
          })
        });
        upload.setOption({
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
              data: recentDay
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                name:'问答情况',
                type:'line',
                stack: '总量',
                data: uploadNumber,
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
              data: recentDay
          },
          yAxis: {
              type: 'value'
          },
          color: ['#FF0EE5','#430EFF','#B4FF0E','#8B4BE2','#FFB40E','#F14964','#3792FF','#47CACA'],
          series: recentReadNumber
        })
    }, 300);
  }
  changTab = () => {

  }
  showModal = (item) => {
    this.lookDetail(item)
    this.setState({
      detailModal: true
    })
  }
   // 查看详情数据
   lookDetail = (item) => {
    Request.post("",{
      cmd:"searchAnsweringQuestionsDetails",
      value: {
        data: {
          qsUuid: item.qsId,  
        }
      },
      bool:true
    })
    .then((res)=>{
      if(res.code === 1000){
        sessionStorage.setItem('html',JSON.stringify(res.data))
        this.setState({
          currentItem: res.data,
        })
      } else {

      } 
    })
  } 
  render() { 
    const {addModal,rsDataList,rsDataTotal,detailModal,modalType,currentItem,qsTypeId,allHotDocument} = this.state
    console.log(rsDataList)
    //console.log(allReadList)
    let _this = this;
    const modalProps = {
      visible: addModal,
      maskClosable: false,
      title: '答疑文档分布',
      qsTypeId: qsTypeId,
      onOk(data,userId) {
        _this.setState({
          addModal: false
        })
      },
      onCancel() {
        _this.setState({
          addModal: false
        })
      }
    }
    const resDetailModal = {
      visible: detailModal,
      maskClosable: false,
      item: modalType === 'create' ? currentItem : '',
      title: `${modalType === 'create' ? '查看详情' : '编辑'}`,
      onOk(data,userId) {
      },
      onCancel() {
        _this.setState({
          detailModal: false
        })
      }
    }
    return ( 
      <div className="analys-wrap">
          <div>
            <div className="main-wrap" style={{marginBottom:'20px'}}>
              <div className="resource-document">
                <div className="res-title">答疑文档分布(<span className="label">{rsDataTotal}篇</span>)</div>
                <div className="resource-wrap answer-wrap">
                  <div className="res-echarts" id="res-echarts"></div>
                  <div className="res-right answer-right">
                    {rsTypeList.map((item)=> {
                      return (
                        <div className="item">
                          <span className="yuan"></span> 
                          <span className="title">{item.name}</span>
                          <span className="propo">{(item.value/rsDataTotal).toFixed(2)*100}%</span>
                          <span>{item.value}篇</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="upload">
                <div className="res-title">最近七天问答情况</div>
                <div className="resource-wrap" id="upload">
                </div>
              </div>
            </div>
            <div className="main-wrap">
              <div className="resource-document">
                <div className="res-title">最近七天查阅量(<span className="label">总量{allReadNumber}</span>)</div>
                <div className="resource-wrap">
                  <div className="read-title answer-title">
                    {allReadList.map((item)=>{
                      return (
                        <div className="item">
                          <p className="yuan-wrap">
                            <span className="yuan"></span><span>{item.codeName}</span>
                          </p>
                          <p className="number">{item.rsNumber}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div id="lineChart" className="lineChart"></div>
                </div>
              </div>
              <div className="upload">
                <div className="res-title">热门问答</div>
                <div className="resource-wrap">
                <div className="item-wrap" >
                  {allHotDocument.map(item=>{
                    return(
                      <div className="item" onClick={this.showModal.bind(this,item)}>
                        <div className="item-tit">
                          <p>{item.qsName}</p>
                          <p className="tag-class">{item.qsTypeName}</p>
                        </div>
                        <img src="/img/turnRight.png" className="turnRight" />
                        <div className="num">
                         {item.readings}
                        </div>
                      </div>
                    )
                  })}
                </div>
                </div>
              </div>
            </div>
            <Modal {...modalProps}/>
            <AnswerModal {...resDetailModal} />
          </div>
      </div>
     );
  }
}
 
export default Resource;