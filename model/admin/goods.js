// 引入mongoose模块
const mongoose = require('mongoose');
// 引入joi模块
const Joi = require('joi');

// 创建商品集合规则
const goodsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    url: {
        type: String,
        required: true
    },
    state:{
        type:Boolean,
        required:true,
        default:false
    },
    specification: {
        type: [{
            name: {
                type: String,
                required: true
            },
            price: {
                type: String,
                required: true
            },
            stock: {
                type: Number,
                required: true
            },
            freight: {
                type: String,
                required: true
            }
        }],
        required: true
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    swiperUrl: {
        type: [String],
        required: true
    },
    urls: {
        type: [String],
        required: true
    },
    desc: {
        type: String,
        required: true,
        maxlength: 50
    }
});

// 创建商品集合并应用规则
const Goods = mongoose.model('goods', goodsSchema);

// Goods.create({
//     name: '仙贝',
//     url: 'url',
//     swiperUrl: ['url'],
//     urls: ['url'],
//     specification: [{
//         name: '一斤',
//         price: 55,
//         stock: 20,
//         freight: 10
//     }],
//     categories: '5e75b24d44733839f87b9067'
// })

// 验证商品信息
const validateGoods = goods => {
    const schema = {
        name: Joi.string().min(2).max(20).required().error(new Error('商品名不符合要求')),
        desc: Joi.string().required().error(new Error('商品描述不符合要求')),
        url: Joi.string().required().error(new Error('商品url不符合要求')),
        categories: Joi.string().regex(/^[0-9a-f]{24}$/).required().error(new Error('分类ID不符合要求')),
        specification: Joi.array().items(Joi.object().keys({
            name: Joi.string().required(),
            price:Joi.number().required(),
            stock:Joi.number().required(),
            freight:Joi.number().required()
        })).required().error(new Error('规格不符合要求')),
        swiperUrl: Joi.array().items(Joi.string().required()).required().error(new Error('轮播图不符合要求')),
        urls: Joi.array().items(Joi.string().required()).required().error(new Error('详情图片不符合要求')),
    }
    return Joi.validate(goods, schema);
}

module.exports = {
    Goods,
    validateGoods
}