// 引入mongoose模块
const mongoose = require('mongoose');

//创建优惠卷集合规则
const couponSchema = new mongoose.Schema({
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
    state: {
        type: String,
        enum: ['可用', '不可用'],
        required: true,
    },//状态
    couponCenterId: {
        type: String
    },//获取的优惠卷所在数据库的_id
    openid: {
        type: String,
        required: true,
    }//用户唯一标识符
})

// 创建优惠卷集合
const Coupon = mongoose.model('coupon', couponSchema);

module.exports = {
    Coupon
}