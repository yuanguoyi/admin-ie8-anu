/*
*   头部高级搜索
* */

import React, { Component } from 'react';
import { Form, Input,DatePicker, Button, Select, Icon, TreeSelect,Cascader } from 'antd';
// import './style/TopSearch.less';
import FilterPerson from '../filterPerson/filterPerson'
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let clear  = 0;
class Filter extends Component {
  constructor(props,context) {
    super(props,context);
    this.state = {
      moreSearch:false,     // 是否展开更多搜索项
      prisonerName: '',  // 服刑人员
      clearFilter: '',
      defaultValue:[],
    };
  }

  // 点击查询
  clickSearch = (e) => {
    if(e){
      e.preventDefault();
    }
    let {clickSearchHandler, form} = this.props;
    let prisonerName = this.state.prisonerName
    let obj = form.getFieldsValue();
    let rsType
    let rsSubType
    if (clear == 0) {
      if (obj.rsType && obj.rsType.length>0){
        if (obj.rsType[0] !== obj.rsType[1]){
          rsType = obj.rsType[0]
          rsSubType =  obj.rsType[1]
        } else {
          rsType = obj.rsType[0]
          rsSubType = undefined
        }
      }
    } else {
      rsType = undefined
      rsSubType = undefined
      clear = 0
    }
    
    let newObj = {...obj,...{rsType:rsType},...{rsSubType:rsSubType}}
    console.log('收到表单值：', newObj);
    let value={};
    for (let key in newObj) {
      if (newObj[key]){
        value[key]=newObj[key];
      }
    }
    clickSearchHandler(value);
  };
  
  // 点击清除
  clickCancel = ()=>{
    const {resetFields} = this.props.form;
    clear = 1
    sessionStorage.removeItem('resTypeValue')
    resetFields();
    this.setState({
      clearFilter: '',
      prisonerName: ''
    })
    this.clickSearch();
  };
  hanleChange = () => {
    // alert()
  }
  render() {
    const {searchArray,options} =this.props;
    return (
      <div className="top-search">

        <Form horizontal className="top-search-form" onSubmit={this.clickSearch}>

          {this.renderList(searchArray)}

        </Form>

      </div>
    );
  }

  renderList(searchArray){
    const { moreSearch } = this.state;
    const that = this;
    return searchArray.map((item, index, array)=>{
      if(index!==3){
        return (
          <div className="gutter-box" key={index}>
            {
              moreSearch ? that.renderItem(item) : that.renderItem([item[0]])
            }
          </div>
        )
      }else{
        return (
          <div className="gutter-box gutter-box-last" key={index}>
            {
              moreSearch && that.renderItem(item)
            }
            <div className="gutter-box-button-wrap">
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button onClick={this.clickCancel.bind(this)}>清除</Button>
              <span onClick={()=>{
                this.setState((prvestate)=>({moreSearch:!prvestate.moreSearch}))
              }}>
                {moreSearch?<span>收 起</span>:<span>展 开</span>}
                {moreSearch?<Icon type="up" />:<Icon type="down" />}
              </span>
            </div>
          </div>
        )
      }
    })
  }

  renderItem(arr){
    const { getFieldProps } = this.props.form;
    const treeData = this.props.treeData
    const {clearFilter} = this.state
    const filerValue =  sessionStorage.getItem('resTypeValue')
    const defaultValue = filerValue ? JSON.parse(sessionStorage.getItem('resTypeValue')) : []
    const {options} = this.props
    const that = this
    const filterData = {
      clearFilter: clearFilter,
      selectRowData(data){
        that.setState({
          prisonerName: data.jbxxName,
          clearFilter: data.jbxxName
        })
      }
    }
    return arr.map((item,index,array)=>{
      if(item && item.option === ""){                // 下拉选
        return null;
      }else if(item && item.option){
        return (
        <FormItem label={item.label} labelCol={{span: 6}} wrapperCol={{span: 15}} key={index}>
          <Select onChange={this.hanleChange} placeholder={item.placeholder} {...getFieldProps(item.key)}>
            {item.option.map((v, i) => <Option value={v.codeUuid} key={i}>{v.codeName}</Option>)}
          </Select>
        </FormItem>
        );
      } else if (item && item.cascader) {
        return (
          <FormItem label={item.label} labelCol={{span: 6}} wrapperCol={{span: 15}} key={index}>
            <Cascader options={options} placeholder="请选择资源分类" 
            {...getFieldProps('rsType',{
              initialValue: defaultValue,
            })}
          />
         </FormItem>
        )
      } else if(item && item.date){               // 单日期选择框
        return (
          <FormItem label={item.label} labelCol={{span: 6}} wrapperCol={{span: 15}} key={index}>
            <DatePicker {...getFieldProps(item.key)}/>
          </FormItem>
        );
      }else if(item && item.rangerTime){               // 时间范围选择
        return (
          <FormItem label={item.label} labelCol={{span: 6}} wrapperCol={{span: 15}} key={index}>
            <RangePicker {...getFieldProps(item.key)} style={{ width: 184 }}  />
          </FormItem>
        );
      }else if(item && item.treeSelect){                //树选择 treeSelect:true
        return (
          <FormItem label={item.label} labelCol={{span: 6}} wrapperCol={{span: 15}} key={index}>
            <TreeSelect
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              treeData={treeData} 
              {...getFieldProps(item.key)} 
              // treeDefaultExpandAll   //默认展开所以树节点
              // treeNodeFilterProp="name"
             />
          </FormItem>
        );
      } else if (item && item.fliter) {
        return (
          <FormItem label={item.label} labelCol={{span: 6}} wrapperCol={{span: 15}} key={index}>
            <FilterPerson ref="subcomponents" {...filterData}  />
          </FormItem>
        )
      }else if(item){                             // 文本框
        return (
          <FormItem label={item.label} labelCol={{span: 6}} wrapperCol={{span: 15}} key={index}>
            <Input placeholder={item.placeholder} {...getFieldProps(item.key)}/>
          </FormItem>
        );
      }else {
        return null;
      }
    });
  }
}

//添加router至this.context
// TopSearch.contextTypes = {
//   router: Object
// };

// 添加form到this.props
Filter = Form.create()(Filter);

export default Filter;