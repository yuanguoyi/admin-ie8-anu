import React, { Component } from 'react'
import '@/style/analys.less'
import echarts from 'echarts'
import {Tabs,message} from 'antd'
import Modal from './components/resourceModal'
import Request from "../../tool/request";
import DetailModal from './components/resourceDetailModal'
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
let allReadList = []
let recentReadNumber = [] // 最近七天阅读量
let timer,myChart,upload,lineChart
class Resource extends Component {
  state = { 
    addModal: false,
    rsDataList:[],
    rsDataTotal:'',
    detailModal:  false, // 查看详情弹框
    currentItem: '',
    modalType: 'create',
    resourceType: '',
    rsTypeId: '', // 分类id
    allHotDocument: []
   }
   // 最近七天上传情况
   getRecentUpload () {
    Request.post("",{
      cmd:"getRecentlyUploadedResourcesSituation",
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
          recentDay.unshift(item.rsDate)
          uploadNumber.unshift(item.rsNumber)
         });
        }else{
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{

      })
   }
   // 资源分档分布
  getDocument () {
    Request.post("",{
      cmd:"getDocumentDistribution",
      value: {
        data:{
          userId: loginData.userId,
          pageSize: 10,
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code===1000){
          let data = rest.data.rsTypeList
          data.map(item =>{
            item['name'] = item.codeName
            item['value'] = item.rsNumber
            delete item['codeName']
            delete item['rsNumber']
          })
          rsTypeList = [...data]
          this.setState({
            rsDataTotal: rest.data.rsTotal
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
      cmd:"getPopularResourcesList",
      value: {
        data:{
          userId: loginData.userId,
          pageSize: 10
        }
      },
      bool:true
    })
      .then((rest)=>{
        if(rest.code===1000){
          this.setState({
            allHotDocument: rest.data[0].rsReadingList
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
      cmd:"getRecentlyResourceReadings",
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
          let data = rest.data.rsTypeList
          allReadNumber = rest.data.rsTotal
          let documentDate = data[0].rsReadingList
          alldocumentDate = []
          documentDate.forEach(item =>{
            alldocumentDate.push(item.qsTypeDate)
          })
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
          allReadList = rest.data.rsTypeList
        }else{
          message.warning(rest.msg);
        }
      })
      .catch((err)=>{

      })
   }
  componentDidMount() {
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
              var colorList = [          
                '#FFB40E', '#47CACA', '#3792FF','#8B4BE2','#F14964','#B4FF0E','#430EFF','#FF0EE5'
                  ];
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
            center: ['54%', '38%'],
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
          rsTypeId: item.data.codeUuid, 
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
                  name:'上传情况',
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
    this.setState({
      currentItem: item,
      detailModal: true
    })
  }
  render() { 
    const {addModal,rsDataList,rsDataTotal,detailModal,modalType,currentItem,rsTypeId,allHotDocument} = this.state
    let _this = this;
    const modalProps = {
      visible: addModal,
      maskClosable: false,
      title: '资源分布',
      rsTypeId: rsTypeId,
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
                <div className="res-title">资源文档分布(<span className="label">{rsDataTotal}篇</span>)</div>
                <div className="resource-wrap">
                  <div className="res-echarts" id="res-echarts"></div>
                  <div className="res-right">
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
                <div className="res-title">最近七天上传情况</div>
                <div className="resource-wrap" id="upload">
                </div>
              </div>
            </div>
            <div className="main-wrap">
              <div className="resource-document">
                <div className="res-title">最近七天文档阅读量(<span className="label">总量{allReadNumber}</span>)</div>
                <div className="resource-wrap">
                  <div className="read-title">
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
                <div className="res-title">热门文档</div>
                <div className="resource-wrap">
                <div className="item-wrap" >
                  {allHotDocument.map(item=>{
                    return(
                      <div className="item" onClick={this.showModal.bind(this,item)}>
                        <div className="item-tit">
                          <p>{item.rsName}</p>
                          <p className="tag-class">{item.rsSubtypeName ? item.rsSubtypeName : item.rsTypeName}</p>
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
            <DetailModal {...resDetailModal} />
          </div>
      </div>
     );
  }
}
 
export default Resource;