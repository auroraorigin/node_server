// 引入mongoose模块
const mongoose = require('mongoose');
// 引入joi模块
const Joi = require('joi');

// 创建管理员集合规则
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        maxlength: 11,
        minlength: 11
    },
    email: {
        type: String
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    state: {
        type: Boolean,
        default: false,
        required: true
    }
});

// 创建管理员集合
const Admin = mongoose.model('admin', adminSchema);

// 创建测试管理员
/*
// 导入bcrypt模块
const bcrypt = require('bcrypt');

async function createAdmin() {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('mima456', salt);
    await Admin.create({
        name: 'auroral',
        password: password,
        mobile: '13888888887',
        email: 'auroral@qq.com',
        role: 'admin',
        state: true
    });
}
createAdmin();
*/


// 验证管理员信息
const validateAdmin = admin => {
    const schema = {
        _id: Joi.string().regex(/^[0-9a-f]{24}$/).error(new Error('_id不符合要求')),
        name: Joi.string().min(2).max(20).error(new Error('用户名不符合要求')),
        email: Joi.string().email().error(new Error('邮箱格式不符合要求')),
        password: Joi.string().regex(/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]{6,15}$/).error(new Error('密码格式不符合要求')),
        role: Joi.string().error(new Error('角色值非法')),
        state: Joi.boolean().error(new Error('状态值非法')),
        mobile: Joi.string().regex(/^1[3456789]\d{9}$/).error(new Error('手机号格式不符合要求'))
    }
    return Joi.validate(admin, schema);
}

module.exports = {
    Admin,
    validateAdmin
}