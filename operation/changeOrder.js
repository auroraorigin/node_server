const {
    Order
  } = require('../model/wx/order');

module.exports = async ()=>{
    console.log('更新订单状态模块激活')

    let time = parseInt(Date.now()/1000)
    await Order.updateMany({state:'待付款',timestamp:{$lt:time}},{state:'交易关闭'})
    await Order.updateMany({state:'待收货',timestamp:{$lt:time}},{state:'交易成功'})

    console.log('更新订单状态完毕')
}