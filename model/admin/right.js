// 引入mongoose模块
const mongoose = require('mongoose');

// 创建权限集合规则
const rightSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxlength: 10
    },
    path: {
        type: String,
        required: true
    },
    pid: {
        type: [String],
        default: []
    },
    method:{
        type:String,
        default: ''
    }
})

// 创建权限集合
const Right = mongoose.model('right', rightSchema);

// Right.create({
//     name: '添加角色',
//     path: 'rights',
//     pid: ['5e72e81b9e064435c4a7c5cd','5e72e84668380434a0d09eec']
// })

module.exports = {
    Right
}