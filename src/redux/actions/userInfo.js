import { actionTypes } from '../actionTypes/userInfo';

export function login(data) {
  return {
    type: actionTypes.USERINFO_LOGIN,
    data
  }
}

export function update(data) {
  return {
    type: actionTypes.USERINFO_UPDATE,
    data
  }
}

// export function setDefaultMenu(data) {
//   return {
//     type: actionTypes.DEFAULT_MENU,
//     data
//   }
// }
// export function setDefaultSubMenu(data) {
//   return {
//     type: actionTypes.DEFAULT_SUBMENU,
//     data
//   }
// }