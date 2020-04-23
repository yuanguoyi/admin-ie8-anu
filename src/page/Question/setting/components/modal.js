
import React, { Component } from 'react';
import { Form, Input,Row,Col,DatePicker,TreeSelect,Select, Modal,Checkbox,message } from "antd";
import FilterPerson from '@/components/filterPerson/filterPerson'
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
class AddModal extends Component {
  state = { 
    checkedValues:  ["0", "1"],
    prisonerName: '',
    dePart: '', // 部门
    dePartId: '', // 部门id
    plUuid: '' // 姓名id
   }
   handleOk = () => {
     let _this = this
    const {onOk} = this.props
    const { resetFields} = this.props.form;
    const {...modalProps} = this.props;
    const {modalType} = modalProps
    const item = modalProps.item
    let prisonerName = ''
    let plUuid = this.state.plUuid
    let dePartId = ''
    if (modalType == 'update' && plUuid=='') {
      plUuid = item.urAsuser
      prisonerName = item.urAsusername
      dePartId = item.urUserdept
    } else {
      plUuid = this.state.plUuid
      prisonerName = this.state.prisonerName
      dePartId = this.state.dePartId
    }
    console.log(prisonerName)
    if (prisonerName == '') {
      message.error('请输入姓名')
      return false
    }
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      let newValues = {...values,...{urAsuser:plUuid},...{urUserdept:dePartId}}
      this.refs.handleClear.handler()
      this.setState({
        dePart:'',
        prisonerName: '',
        plUuid: ''
      })
      onOk(newValues)
      resetFields();
    });
   }
   handleCancel = () => {
    const { resetFields} = this.props.form;
    const {onCancel} = this.props
    this.setState({
      prisonerName: '',
      plUuid: ''
    })
    resetFields();
    onCancel()
   }
   changeType = (checkedValues) => {
    this.setState({
      checkedValues: checkedValues
    })
   }
  render() { 
    let _this = this
    const { getFieldProps } = this.props.form;
    const {...modalProps} = this.props;
    const {modalType} = modalProps
    const item = modalProps.item
    let prisonerName = ''
    let dePart = ''
    let plUuid = this.state.plUuid
    if (modalType == 'update' && plUuid == '' ) {
      dePart = item.urUserdeptname
      prisonerName = item.urAsusername
    } else {
      dePart = this.state.dePart
      prisonerName = this.state.prisonerName
    }
    const queType = modalProps.queType ? modalProps.queType : []
    console.log(prisonerName)
    const filterData = {
      prisonerName:  prisonerName,
      selectRowData(data){
        _this.setState({
          plUuid: data.plUuid,
          prisonerName: data.plName,
          dePart: data.plDeptName,
          dePartId: data.plDept
        })
      }
    }
    return ( 
      <Modal 
        {...modalProps} onOk={this.handleOk} onCancel={this.handleCancel}
      >
        <Form horizontal>
            <Row> 
              <FormItem label={"姓名"} labelCol={{span: 5}} wrapperCol={{span: 14}} >
                {/* <Select showSearch notFoundContent="无法找到" optionFilterProp="children" placeholder={"请选择姓名"} {...getFieldProps('urAsuser',{
                  initialValue: item.urAsusername,
                  rules: [
                    { required: true, whitespace: true, message: '请输入姓名' }
                  ],
                })}>
                  {policeList.map((v, i) => <Option value={v.plUuid} key={i}>{v.plName}</Option>)}
                </Select> */}
                 <FilterPerson {...filterData} ref="handleClear"  />
              </FormItem>
            </Row>
            <Row> 
              <FormItem label={'部门'} labelCol={{span: 5}} wrapperCol={{span: 14}}>
                {/* <TreeSelect
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                  treeData={departData} 
                  {...getFieldProps('urUserdept',{
                    initialValue: item.urUserdept,
                    rules: [
                      { required: true, whitespace: true, message: '请选择部门' }
                    ]
                  })} 
                /> */}
                <Input disabled placeholder={"请输入"} {...getFieldProps("urUserdept",{
                  initialValue: dePart,
                  rules: [
                    { required: true, whitespace: true, message: '请输入部门' }
                  ],
                })}/>
              </FormItem>
            </Row>
            {/* <Row> 
              <FormItem label={"岗位"} labelCol={{span: 5}} wrapperCol={{span: 14}} >
                <Input placeholder={"请输入"} {...getFieldProps("urJobs",{
                  initialValue: item.urJobs,
                  rules: [
                    { required: true, whitespace: true, message: '请输入岗位' }
                  ],
                })}/>
              </FormItem>
            </Row> */}
            <Row> 
              <FormItem label={'负责类型'} labelCol={{span: 5}} wrapperCol={{span: 14}}>
                <Select placeholder={"请选择类型"} {...getFieldProps('urAstype',{
                  initialValue: item.urAstype,
                  rules: [
                    { required: true, whitespace: true, message: '请选择类型' }
                  ],
                })}>
                  {queType.map((v, i) => <Option value={v.codeUuid} key={i}>{v.codeName}</Option>)}
                </Select>
              </FormItem>
            </Row>
        </Form>
      </Modal>
     );
  }
}
AddModal = Form.create()(AddModal);
export default AddModal;