// 引入mongoose模块
const mongoose = require('mongoose');

// 创建地址集合规则
const addressSchema = new mongoose.Schema({
    openid:{
        type:String,
        unique:true,
        required:true
    },//用户唯一标识符
    addressList:{
        type:Array
    },//用户所有地址列表
    defaultAddress:{
        type:Object
    }//用户默认地址
});

// 创建地址集合
const Address = mongoose.model('address', addressSchema);

module.exports = {
    Address
}