// 引用expess框架
const express = require('express');
// 创建管理系统API路由对象
const admin = express.Router();

// 登录模块
admin.post('/login', require('./admin/login'));

// 验证用户登录状态模块
admin.use('/', require("./admin/authorization"));

// 获取左侧菜单
admin.get('/menus', require("./admin/menus"));

// 管理员管理模块
admin.use('/admins', require("./admin/admins"));

// 权限管理模块
admin.get('/rights/:type', require("./admin/rights"));

// 角色管理模块
admin.use('/roles', require("./admin/roles"));

// 商品分类模块
admin.use('/categories', require("./admin/categories"));

// 商品管理模块
admin.use('/goods', require("./admin/goods"));

// 图片上传
admin.post('/upload',require("./admin/upload"))

// 将路由对象作为模块成员进行导出
module.exports = admin;