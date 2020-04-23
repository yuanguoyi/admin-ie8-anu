const shell = require('shelljs');
const path = require('path');
const del = require('del');

let arr = del.sync([path.join(__dirname + '/../dist/**')]);
console.log('正在删除目录');

shell.exec('webpack --config ./webpack.config.js', { async: true }, (code, stdout, stderr) => {});
