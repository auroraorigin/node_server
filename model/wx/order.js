// 引入mongoose模块
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    openid: {
        type: String,
        required: true,
    },//用户唯一标识
    address:{
        type:Object,
        required:true,
    },//订单地址
    state:{
        type:String,
        enum:['待付款','待发货','待收货','退款中','交易成功','交易关闭'],
        required:true,
    },//订单状态
    goods:{
        type:Array,
        required:true
    },//商品
    coupon:Object,//优惠卷
    totalPrice:{
        type:String,
        required:true,
    },//总价
    expressNumber:{
        type:String,
    },//快递号
    freight:String,//运费
    createDate:String,//创建日期
    updateDate:String,//更新日期
    timestamp:Number,//订单关闭时间戳(只有待付款订单和待发货订单具备)
    userWord:{
        type:String,
        maxlength:50
    },//用户留言
    returnReason:{
        type:String,
        maxlength:50
    },//退款原因
    havedPaid:{
        type:String,
        required:true
    }//实付款
});

//创建订单集合
const Order=mongoose.model('order',orderSchema);

module.exports = {
    Order
}