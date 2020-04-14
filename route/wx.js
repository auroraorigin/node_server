// 引用expess框架
const express = require('express');

//处理node request请求
const request = require('request');

// 创建微信小程序API路由
const wx = express.Router();

// 首页信息
wx.get('/homePage',require("./wx/homePage"))

// 搜索页面
wx.get('/search',require("./wx/search"))

// 搜索页面关键词
wx.get('/searchKey',require("./wx/searchKey"))

// 详情页面
wx.get('/detail',require("./wx/detail"))

// 分类页面
wx.get('/categories',require("./wx/categories"))

// 判断购物车页面商品是否有效
wx.get('/cart',require("./wx/cart"))

// 加载登录校验模块
wx.post('/checkUser', require('./wx/checkUser'));

//加载用户信息模块
wx.get('/getUserMessage', require("./wx/userMessage").getMessage);

//更新用户信息模块
wx.put('/userMessageUpdata', require("./wx/userMessage").messageUpdata);

//加载优惠卷列表
wx.post('/getCouponList',require("./wx/userMessage").getCouponList);

//加载收货地址
wx.get('/getAddressList', require("./wx/addresses").getAddress);

//保存(更新)收货地址
wx.put('/saveAddressList', require("./wx/addresses").addressUpdate);

//获取默认地址
// wx.get('/getDefaultAddress',require("./wx/addresses").getDefaultAddress);

//创建订单
wx.post('/createOrder',require("./wx/orders").createOrder);

//加载订单列表
wx.post('/getOrder',require("./wx/orders").getOrder);

//加载订单详情
wx.post('/getOrderDetail',require("./wx/orders").getOrderDetail);

//删除订单
wx.post('/deleteOrder',require("./wx/orders").deleteOrder);

//获取优惠卷中心列表
wx.get('/getCouponCenter',require("./wx/couponCenters").getCouponCenter);

//领取优惠卷
wx.post('/getCoupon',require("./wx/couponCenters").getCoupon);

//获取优惠状态
wx.post('/cheapState',require("./wx/userMessage").cheapState);

//订单状态转换
wx.post('/changeOrderState',require("./wx/orders").changeOrderState);

//计算运费
wx.get('/getDiscount',require("./wx/orders").getDiscount);

// 将路由对象做为模块成员进行导出
module.exports = wx; 