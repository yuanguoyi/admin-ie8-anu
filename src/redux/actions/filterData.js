import { actionTypes } from '../actionTypes/filterData';
export function commitCompany (data) {
  return {
    type: actionTypes.COMPANY,
    data
  }
}
export function commitDepart (data) {
  return {
    type: actionTypes.DEPARTMENT,
    data
  }
}
export function commitRstype (data) {
  return {
    type: actionTypes.RSTYPE,
    data
  }
}
export function commitQuetype (data) {
  return {
    type: actionTypes.QUETYPE,
    data
  }
}