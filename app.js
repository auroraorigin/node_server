// 导入expess框架
const express = require('express');
// 引入路径模块
const path = require('path');
// 导入body-parser模块
const bodyPaser = require('body-parser');
// 引入定时器模块
const schedule = require('node-schedule');
// 引入清理无效图片模块
const clear = require('./operation/clear')
// 引入更新订单模块
const changeOrder = require('./operation/changeOrder')

// 创建网站服务器
const app = express();

// 处理post请求参数
app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({
  extended: false
}));

// 数据库连接
require('./model/connect');

// 开放静态资源文件
app.use(express.static(path.join(__dirname, 'public')));

// 定时器
const scheduleCronstyle = () => {
  //每天凌晨三点清理无效图片、更新所有订单状态
  schedule.scheduleJob('0 0 3 * * *', async () => {
    clear()
    changeOrder()
  });
}

scheduleCronstyle();

//引入路由对象
const wx = require('./route/wx');
const admin = require('./route/admin');

// 为路由匹配请求路径
app.use('/wx', wx);
app.use('/admin', admin);

app.use((err, req, res, next) => {
  res.json(404, null)
})

// 监听端口
app.listen(8888);
console.log('网站服务器启动成功')