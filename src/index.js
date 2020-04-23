import 'es5-shim'; //IE8 ^4.5.10
import 'object-create-ie8';//IE8, 我写的库，这样就不用加上es5-sham
import 'object-defineproperty-ie8';//IE8， 我写的库
import 'console-polyfill';//IE8下，如果你不打开开发者工具，window下是没有console这个对象的，
//只有打开了F12才会有这个方法
import 'json3';  //比IE8的JSON好用
import 'bluebird'; //性能超高的Promise实现
import 'fetch-polyfill2'; //fetch 实现，我的另一力作
import 'es6-promise';
import 'babel-polyfill';

//上面这几个可以单独打包
import  React  from 'react';
import  ReactDOM  from 'react-dom';
// import { Router,Link } from 'router';
// import './index.less';
import 'antd/dist/antd.less';
import './style/style.less';
import 'create-react-class';
import {Provider} from 'react-redux';
import store from './store/store';
import Home from './page/home/Home'
import Login from './page/login/login'
import Loading from './page/loading/loading'
import ResourcesList from './page/Resources/resourcesList' 
import AddResources from './page/Resources/addResources/addResources'
import Approval from './page/Resources/approval/index'
import UploadResource from './page/uploadResource/index'
import Answer from './page/Question/answer/answer'
import AddAnswer from './page/Question/answer/addAnswer'
import AnswerApproval from './page/Question/answer/answerApproval'
import Question from './page/Question/question/question'
import AddQuestion from './page/Question/question/addQuestion'
import Setting from './page/Question/setting/setting'
import News from './page/content/news/index'
import AddNew from './page/content/news/addNew'
import Special from './page/content/special/index'
import AddSpecial from './page/content/special/addSpecial'
import Recommend from './page/content/recommend/recommend'
import AppMangent from './page/system/app/index'
import AddApp from './page/system/app/addApp'
import Suggest from './page/system/suggest/index'
// import ResourceAnalyse from './page/census/resource'
// import AnswerAnalyse from './page/census/answer'
// import UserAnalyse from './page/census/user'
// import UserDetail from './page/census/userDetail'
import { Router, Route, IndexRedirect, IndexRoute, Link, hashHistory  } from 'react-router'

const App = ({ children }) => (
  <div>
    <Router history={hashHistory}>
        <Route path="/" component={Login} />
        <Route path="/home" component={Home}>
          <Route path="/home/loading" component={Loading} />
          <Route path="/home/resourcesList" component={ResourcesList} />
          <Route path="/home/addResources" component={AddResources} />
          <Route path="/home/approval" component={Approval} />
          <Route path="/home/uploadResource" component={UploadResource} />
          <Route path="/home/answer" component={Answer} />
          <Route path="/home/addAnswer" component={AddAnswer} />
          <Route path="/home/answerApproval" component={AnswerApproval} />
          <Route path="/home/question" component={Question} />
          <Route path="/home/addQuestion" component={AddQuestion} />
          <Route path="/home/setting" component={Setting} />
          <Route path="/home/news" component={News} />
          <Route path="/home/addNew" component={AddNew} />
          <Route path="/home/special" component={Special} />
          <Route path="/home/addSpecial" component={AddSpecial} />
          <Route path="/home/recommend" component={Recommend} />
          <Route path="/home/app" component={AppMangent} />
          <Route path="/home/addApp" component={AddApp} />
          <Route path="/home/suggest" component={Suggest} />
          {/* <Route path="/home/resourceAnalyse" component={ResourceAnalyse} />
          <Route path="/home/answerAnalyse" component={AnswerAnalyse} />
          <Route path="/home/userAnalyse" component={UserAnalyse} />
          <Route path="/home/userDetail" component={UserDetail} /> */}
        </Route>
    </Router>
  </div>
);

ReactDOM.render(<Provider store={store} ><App/></Provider>, document.getElementById('root'));