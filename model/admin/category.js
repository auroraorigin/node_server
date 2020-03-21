// 引入mongoose模块
const mongoose = require('mongoose');

// 创建分类集合规则
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxlength: 20
    }
})

// 创建分类集合
const Category = mongoose.model('category', categorySchema);

// Category.create({
//     name:'醉类'
// })

// 导出分类路由对象
module.exports = Category