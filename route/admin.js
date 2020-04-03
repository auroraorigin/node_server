// 引用expess框架
const express = require('express');
// 创建管理系统API路由对象
const admin = express.Router();

// 解决跨域问题
admin.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); //让options请求快速返回
    } else {
        next();
    }
});

// 初始化统一响应机制
var resextra = require('./admin/resextra')
admin.use(resextra)

// 登录模块
admin.post('/login', require('./admin/login'));

// 获取左侧菜单
admin.get('/menus', require("./admin/menus"));

// 验证用户登录状态模块
admin.use('/', require("./admin/authorization"));

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

// 订单管理模块
admin.use('/orders', require("./admin/orders"));

// 图片上传
admin.post('/upload', require("./admin/upload"))

// 数据报表
admin.get('/reports/:type', require("./admin/reports"))

// 页面管理
admin.use('/ad',require("./admin/ads"))

// 将路由对象作为模块成员进行导出
module.exports = admin;