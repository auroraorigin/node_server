// 引入mongoose模块
const mongoose = require('mongoose');

// 创建用户集合规则
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 20
    },//用户姓名
    mobile: {
        type: String,
        maxlength: 11,
        minlength: 11
    },//用户电话
    sex: {
        type: String
    },//用户性别
    birthday: {
        type: String
    },//用户生日
    region: {
        type: String,
    },//用户所在地区
    wxNumber:{
        type:String
    },//用户微信号
    detailAddress:{
        type:String
    },//用户详细地址
    openid:{
        type:String,
        unique:true,
        required:true
    },//用户唯一标识符
});

// 创建用户集合
const User = mongoose.model('user', userSchema);

module.exports = {
    User
}