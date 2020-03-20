// 引入mongoose模块
const mongoose = require('mongoose');
// 引入joi模块
const Joi = require('joi');

// 创建角色集合规则
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxlength: 10
    },
    desc: {
        type: String,
        maxlength: 30
    },
    children: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'right',
        }],
        default: []
    }
})

// 创建权限集合
const Role = mongoose.model('role', roleSchema);

// Role.create({
//     name: '超级管理员',
//     desc: '拥有所有权限',
//     children:['5e71d72f993f6246d8147c27','5e71d7753ff3ed1d2cd660d2','5e71db1637108f3db096cb35','5e72e7580e5ae72e28eae474','5e72e7580e5ae72e28eae475','5e72e7580e5ae72e28eae476','5e72e7580e5ae72e28eae477','5e72e7580e5ae72e28eae478','5e72e81b9e064435c4a7c5cd','5e72e84668380434a0d09eec','5e72e84668380434a0d09eed','5e72e8c817ce822a80b17718','5e72e8c817ce822a80b17719','5e72e8c817ce822a80b1771a','5e72e8c817ce822a80b1771b','5e72e8c817ce822a80b1771c','5e72e8c817ce822a80b1771d','5e72e8c817ce822a80b1771e','5e72e8c817ce822a80b1771f','5e72e8c817ce822a80b17720']
// })

// 验证角色信息
const validateRole = role => {
    const schema = {
        _id: Joi.string().regex(/^[0-9a-f]{24}$/).error(new Error('_id不符合要求')),
        name: Joi.string().max(10).error(new Error('角色名称不符合要求')),
        desc: Joi.string().max(30).error(new Error('角色描述不符合要求'))
    }
    return Joi.validate(role, schema);
}

module.exports = {
    Role,
    validateRole
}