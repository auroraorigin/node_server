// 导入expess框架
const express = require('express');
// 导入path模块
const path = require('path');
// 导入body-parser模块
const bodyPaser = require('body-parser');

// 创建网站服务器
const app = express();

// 处理post请求参数
app.use(bodyPaser.urlencoded({extended: false}));

// 数据库连接
require('./model/connect');

//引入路由对象
const wx = require('./route/wx');
const admin = require('./route/admin');

// 为路由匹配请求路径
app.use('/wx', wx);
app.use('/admin', admin);

app.use((err, req, res, next) => {
	res.json(400, null)
})

// 监听端口
app.listen(8888);
console.log('网站服务器启动成功')