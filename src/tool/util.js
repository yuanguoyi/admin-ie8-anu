// import moment from 'moment'
// import secret from "@/tool/secret"
// 设置cookie
export const setCookie = (a,b) =>{
  var d=new Date();
  var v=arguments;
  var c=arguments.length;
  var e=(c>2)?v[2]:null;
  var p=(c>3)?v[3]:null;
  var m=(c>4)?v[4]:window.location.host;
  var r=(c>5)?v[5]:false;
  if(e!=null){
     var T=parseFloat(e);
     var U=e.replace(T,"");
     T=(isNaN(T)||T<=0)?1:T;
     U=("snhdwmqy".indexOf(U)==-1||U=="")?'s':U.toLowerCase();
     switch(U){
      case 's':d.setSeconds(d.getSeconds()+T);break;
      case 'n':d.setMinutes(d.getMinutes()+T);break;
      case 'h':d.setHours(d.getHours()+T);break;
      case 'd':d.setDate(d.getDate()+T);break;
      case 'w':d.setDate(d.getDate()+7*T);break;
      case 'm':d.setMonth(d.getMonth()+1+T);break;
      case 'q':d.setMonth(d.getMonth()+1 +3*T);break;
      case 'y':d.setFullYear(d.getFullYear()+ T);break
     }
  }
  document.cookie=a+"="+escape(b)+((e==null)?"":("; expires="+d.toGMTString()))+((p==null)?("; path=/"):("; path="+p))+("; domain="+m)+((r==true)?"; secure":"")
}
// 获取cookie
// function getCookieVal(a){
//   var b=document.cookie.indexOf(";",a);
//   if(b==-1)b=document.cookie.length;
//   return unescape(document.cookie.substring(a,b))
//   }
export const getCookie =(a)=>{
  var v=a+"=";
  var i=0;
  while(i<document.cookie.length){
     var j=i+v.length;
     if(document.cookie.substring(i,j)==v)return getCookieVal(j);
     i=document.cookie.indexOf(" ",i)+1;
     if(i==0)break
  }
  return null
 }
// 删除cookie
export const delCookie = (a)=>{
  var e=new Date();
  e.setTime(e.getTime()-1);
  var b=getCookie(a);
  document.cookie=a+"="+a+";path=/; domain="+window.location.host+"; expires="+e.toGMTString()
  }
// 格式化时间字符串
// export const transformTimeStamp = (moment, timeStr, format = "YYYY/MM/DD HH:mm") => {
//   if (timeStr) {
//     return moment(timeStr).format(format)
//   }
//   return globalLine
// }
export const timeFormat = (date, fmt = 'yyyy-MM-dd') => {
  date = new Date(date);
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}
export const getCode = (paraName) => {
  var arrObj = window.location.href.split("?"); 
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] === paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}
// 导出文件
export const exportFile = (url) => {
  // 兼容ff浏览器和chrome的下载文件，a标签必须显式的写在html文档中，或者使用document.body.appendChild()进行追加到html文档中，不能仅仅用js创建的a标签，否则ff浏览器不兼容
  const downloadFileA = document.createElement('a')
  document.body.appendChild(downloadFileA)
  downloadFileA.style.display = 'none'
  downloadFileA.rel = 'noopener noreferrer'
  downloadFileA.href = `${sundryURL}${url}`
  downloadFileA.download = '下载文件'
  downloadFileA.click()
  document.body.removeChild(downloadFileA)
}
export const extname = (filename) => {
  if(!filename||typeof filename!='string'){
     return false
  };
  let a = filename.split('').reverse().join('');
  let b = a.substring(0,a.search(/\./)).split('').reverse().join('');
  return b
};
export const upload = (file) => {
  // const loginData = sessionStorage.getItem("loginData");
     const loginData ={}
    let userId = ''
    if(loginData) userId = JSON.parse(loginData).userId;
    const time=new Date().getTime();
    let data = {
      value:'1'
    }
  let value = JSON.stringify({
    data: secret.Encrypt(JSON.stringify(data),true),
    userId,
    fromSource:1,
    osType:1,
    versionCode:"10001",
    version:"1",
    timeStamp : time,
    hashCode : secret.MD5(time),
    appId:"B55AB05AECBC43E6B84B3240AF3E3316",
    deviceId:""
  })
  return new Promise((resolve, reject) => {
    let fd = new FormData()
    let xhr = new XMLHttpRequest()
    fd.append('file', file)
    fd.append('name','wangEditorFile')
    fd.append('cmd','importFile')
    fd.append('value',value)
    xhr.open('POST', '/api')
    xhr.send(fd)
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status <= 207) || xhr.status == 304) {
          let res = JSON.parse(xhr.responseText)
          resolve(res)
        } else {
          reject({
            errorText: '上传失败' 
          })
        }
      }
    }
  })
}