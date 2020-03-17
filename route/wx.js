// 引用expess框架
const express = require('express');
// 创建微信小程序API路由
const wx = express.Router();

// 将路由对象做为模块成员进行导出
module.exports = wx;