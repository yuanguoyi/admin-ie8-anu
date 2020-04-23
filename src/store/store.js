/**
|--------------------------------------------------
| redux 添加中间件，增强器，处理函数。
|--------------------------------------------------
*/
import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
import reducer from './reducer';

// 中间件
// const middlewares = [thunk];

// 增强器
const storeEnhancers = compose(
  // applyMiddleware(...middlewares),
  window.devToolsExtension?window.devToolsExtension():f=>f
  );

// 参数：函数，初始值，增强器
export default createStore(reducer, {}, storeEnhancers);
