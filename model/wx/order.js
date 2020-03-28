// 引入mongoose模块
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    openid: {
        type: String,
        required: true,
    }, //用户唯一标识
    address: {
        type: Object,
        required: true,
    }, //订单地址
    state: {
        type: String,
        enum: ['待付款', '待发货', '待收货', '交易成功', '退款中', '交易关闭'],
        required: true,
    }, //订单状态
    goods: {
        type: Array,
        required: true
    }, //商品
    coupon: String, //优惠卷
    totalPrice: {
        type: String,
        required: true,
    }, //总价
    expressNumber: {
        type: String
    },
    freight: String, //运费
    creatDate: String, //创建日期
    updateDate: String, //更新日期
});

//创建订单集合
const Order = mongoose.model('order', orderSchema);

module.exports = {
    Order
}