
import { actionTypes } from '../actionTypes/filterData';
const initialState = {
  companyData: '', // 单位
  departMent: '', // 部门
  rsType: '' , // 资源类型
  queType: '', // 答疑类型
}
export default function filterData (state = initialState, action) {
  switch (action.type) {
    case actionTypes.COMPANY:
      return {...state,companyData:action.data}
    case actionTypes.DEPARTMENT:
      return {...state,departMent:action.data}
    case actionTypes.RSTYPE:
      return {...state,rsType:action.data}
    case actionTypes.QUETYPE:
      return {...state,queType:action.data}
  default:
      return state
  }
}