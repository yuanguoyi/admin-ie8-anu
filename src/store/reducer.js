
/**
|--------------------------------------------------
| redux 所有 reducer 整合。
|--------------------------------------------------
*/
import { combineReducers } from 'redux';
import userInfo from '../redux/reducers/userInfo'
import filterData from '../redux/reducers/filterData'
export default combineReducers({userInfo,filterData});