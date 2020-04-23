import { actionTypes } from '../actionTypes/userInfo';
// let defaultMenu = sessionStorage.getItem('defaultMenu') ? JSON.parse(sessionStorage.getItem('defaultMenu')): [];
// let defaultSubmenu = sessionStorage.getItem('defaultSubmenu') ? sessionStorage.getItem('defaultSubmenu'): '/home';
const initialState = {
  infoData: ''
}

export default function userInfo (state = initialState, action) {
  switch (action.type) {
    case actionTypes.USERINFO_LOGIN:
      return action.data
    case actionTypes.USERINFO_UPDATE:
      return action.data
    default:
      return state
  }
}