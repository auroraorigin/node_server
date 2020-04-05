// 引入mongoose模块
const mongoose = require('mongoose');

// 数据库连接
//require('../connect');

//创建优惠卷中心集合规则
const couponCenterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },//优惠卷名称
    money: {
        type: Array,
        required: true,
    },//达到满减的价格，优惠价格
    effective: {
        type: Array,
        required: true,
    },//有效期
    number: Number//优惠卷剩余数量
})

// 创建优惠卷中心集合
const CouponCenter = mongoose.model('CouponCenter', couponCenterSchema);

/*async function createCouponCenter() {
    await CouponCenter.create({
        name: "海鲜商城",
        money: ["250", "25"],
        effective: ["2020.2.1", "2020.4.3"],
        number: 50
    });
}
createCouponCenter();*/

module.exports = {
    CouponCenter
}