// 引用expess框架
const express = require('express');
// 创建推广信息管理路由对象
const router = express.Router();
// 引入ad模块
const {
    Ad
} = require('../../model/admin/ad')
// 引入商品集合
const {
    Goods,
} = require('../../model/admin/goods')

router.get('/', async (req, res) => {
    var data = await Ad.findOne().lean()
    var temp = []
    for (let i = 0; i < data.floor.length; i++) {
            temp=await Goods.find({
                _id: {
                    $in: data.floor[i].goods
                }
            })
            data.floor[i].goods=temp
    }

    for (let i = 0; i < data.cate.length; i++) {
            temp=await Goods.find({
                _id: {
                    $in: data.cate[i].goods
                }
            })
            data.cate[i].goods=temp
    }

    res.sendResult(data, 200, '获取成功')
})

// 将路由对象作为模块成员进行导出
module.exports = router;