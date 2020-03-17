// 引用expess框架
const express = require('express');
// 创建管理系统API路由对象
const admin = express.Router();

// 加载登录模块
admin.post('/login', require('./admin/login'));

//验证用户登录状态
admin.use('/', require("./admin/authorization"));

//管理员管理模块
admin.use('/admins', require("./admin/admins"));

// 将路由对象作为模块成员进行导出
module.exports = admin;