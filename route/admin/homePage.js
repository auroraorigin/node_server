// 引入订单集合
const {
    Order
  } = require('../../model/wx/order');

module.exports = async (req, res) => {
    let data = {waitSent:0,paidReturn:0}

    data.waitSent = await Order.find({state:'待发货'}).countDocuments()
    data.paidReturn = await Order.find({state:'退款中'}).countDocuments()

    res.sendResult(data, 200, '获取订单信息成功')
}