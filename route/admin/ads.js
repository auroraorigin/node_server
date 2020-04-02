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
// 引入分类集合
const Category = require('../../model/admin/category')

// 获取页面信息
router.get('/', async (req, res) => {
    var data = await Ad.findOne().lean()
    var temp = []
    for (let i = 0; i < data.floor.length; i++) {
        temp = await Goods.find({
            _id: {
                $in: data.floor[i].goods
            }
        }).populate('categories', 'name')
        data.floor[i].goods = temp
    }

    for (let i = 0; i < data.cate.length; i++) {
        temp = await Goods.find({
            _id: {
                $in: data.cate[i].goods
            }
        }).populate('categories', 'name')
        data.cate[i].goods = temp
    }

    res.sendResult(data, 200, '获取成功')
})

// 修改首页轮播图
router.put('/swiper', async (req, res) => {
    const {
        swiper
    } = req.body
    var nswiper = []

    for (let i = 0; i < swiper.length; i++) {
        nswiper.push(swiper[i].url)
    }

    await Ad.updateOne({}, {
        swiper: nswiper
    })
    res.sendResult(null, 200, '修改成功')
})

// 修改公告
router.put('/notice', async (req, res) => {

    await Ad.updateOne({}, {
        notice: req.body.notice
    })

    res.sendResult(null, 200, '修改成功')
})

// 获取商品信息
router.get('/goods', async (req, res) => {
    let data = await Category.find({}, {
        __v: 0,
        url: 0
    }).lean()
    json = JSON.parse(JSON.stringify(data).replace(/_id/g, "value").replace(/name/g, "label"));

    for (let i = 0; i < json.length; i++) {
        json[i].children = []
        let goods = await Goods.find({
            categories: json[i].value
        }).populate('categories', 'name')

        for (let j = 0; j < goods.length; j++) {
            temp = {
                value: {},
                label: ''
            }
            temp.value = goods[j]
            temp.label = goods[j].name
            json[i].children.push(temp)
        }
    }
    res.sendResult(json, 200, '获取商品列表成功')
})

// 修改首页楼层
router.put('/floor', async (req, res) => {
    const {
        floor
    } = req.body
    let nfloor = []
    for (let i = 0; i < floor.length; i++) {
        let temp = {
            url: '',
            goods: []
        }
        temp.url = floor[i].url
        for (let j = 0; j < floor[i].goods.length; j++) {
            temp.goods.push(floor[i].goods[j]._id)
        }

        if (temp.url)
            nfloor.push(temp)
    }

    await Ad.updateOne({}, {
        floor: nfloor
    })
    res.sendResult(null, 200, '修改成功')
})

// 修改分类楼层
router.put('/cate', async (req, res) => {
    const {
        cate
    } = req.body
    let ncate = []
    for (let i = 0; i < cate.length; i++) {
        let temp = {
            name: '',
            goods: []
        }
        temp.name = cate[i].name
        for (let j = 0; j < cate[i].goods.length; j++) {
            temp.goods.push(cate[i].goods[j]._id)
        }

        if (temp.name && temp.goods.length)
            ncate.push(temp)
    }

    await Ad.updateOne({}, {
        cate: ncate
    })
    res.sendResult(null, 200, '修改成功')
})

// 将路由对象作为模块成员进行导出
module.exports = router;