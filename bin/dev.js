const shell = require('shelljs');
const path = require('path');
const del = require('del');

let arr = del.sync([path.join(__dirname + '/../dist/**')]);
console.log('正在删除目录');

shell.exec('node ./biz/server.js --env=dev', { async: true }, (code, stdout, stderr) => {});
shell.exec('webpack --config ./webpack.ie.dev.config.js --watch', { async: true }, (code, stdout, stderr) => {});
