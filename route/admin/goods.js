// 引用expess框架
const express = require('express');
// 创建商品管理模块路由对象
const router = express.Router();
// 引入商品集合
const {
    Goods,
    validateGoods
} = require('../../model/admin/goods')

// 获取商品列表
router.get('/', async (req, res) => {
    const {
        query,
        pagenum,
        pagesize
    } = req.query

    // 判断参数是否合法
    if (!pagenum || !pagesize || pagenum < 1)
        return res.sendResult(null, 400, '参数不合法')

    let response = {}

    if (!query) {
        // 获取商品列表信息
        response.data = await Goods.find({}, {
            __v: 0
        }).populate('categories', 'name').skip((pagenum - 1) * pagesize).limit(Number(pagesize));

        // 获取商品数据总数
        response.total = await Goods.estimatedDocumentCount()
    } else {
        // 获取与查询信息相关的商品数据列表
        response.data = await Goods.find({
            $or: [{
                name: {
                    $regex: new RegExp("" + query + "")
                }
            }]
        }, {
            __v: 0
        }).populate('categories', 'name').skip((pagenum - 1) * pagesize).limit(Number(pagesize))

        // 获取与查询信息相关的商品数据总数
        response.total = await Goods.find({
            $or: [{
                name: {
                    $regex: new RegExp("" + query + "")
                }
            }]
        }).countDocuments()
    }

    res.sendResult(response, 200, '获取商品列表成功')
})

// 添加商品
router.post('/', async (req, res) => {
    // 判断参数是否合法
    try {
        await validateGoods(req.body)
        // 添加商品
        await Goods.create(req.body)
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }

    res.sendResult(null, 201, '添加商品成功')
})

// 根据ID查询商品
router.get('/:_id', async (req, res) => {
    var data
    try {
        data = await Goods.findOne({
            _id: req.params._id
        }, {
            __v: 0
        }).populate('categories', 'name')
    } catch (error) {
        res.sendResult(null, 400, '参数不合法')
    }

    res.sendResult(data, 200, '查询成功')
})

// 根据ID修改商品基本信息
router.put('/:_id', async (req, res) => {
    const data = req.body
    try {
        await Goods.updateOne({
            _id: req.params._id
        }, {
            name: data.name,
            url: data.url,
            desc: data.desc,
            categories: data.categories,
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }
    res.sendResult(null, 200, '修改成功')
})

// 根据商品ID修改商品详情图
router.put('/:_id/detail', async (req, res) => {

    var {
        swiperUrl,
        urls
    } = req.body
    var nswiperUrl = []
    var nurls = []
    try {
        for (let i = 0; i < swiperUrl.length; i++) {
            nswiperUrl.push(swiperUrl[i].url)
        }
        for (let i = 0; i < urls.length; i++) {
            nurls.push(urls[i].url)
        }
    
        await Goods.updateOne({
            _id: req.params._id
        }, {
            swiperUrl: nswiperUrl,
            urls: nurls
        })
    } catch (error) {
        console.log(error)
        return res.sendResult(null,400,'参数不合法')
    }
    res.sendResult(null,200,'修改成功')
})

// 根据ID删除商品
router.delete('/:_id', async (req, res) => {
    try {
        await Goods.findOneAndDelete({
            _id: req.params._id
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }
    res.sendResult(null, 204, '删除成功')
})

// 根据ID添加商品规格
router.post('/:_id/specification', async (req, res) => {

    try {
        await Goods.updateOne({
            _id: req.params._id
        }, {
            $addToSet: {
                specification: req.body
            }
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }

    const data = await Goods.findOne({
        _id: req.params._id
    })
    res.sendResult(data.specification, 201, '添加成功')
})

// 根据商品ID以及规格ID修改规格
router.put('/:_id/specification/:_sId', async (req, res) => {
    var data = []
    try {
        const temp = await Goods.findOne({
            _id: req.params._id
        }).lean()
        data = temp.specification

        for (let i = 0; i < data.length; i++) {
            if (data[i]._id == req.params._sId) {
                data[i].name = req.body.name
                data[i].price = req.body.price
                data[i].stock = req.body.stock
                data[i].freight = req.body.freight
                break
            }
        }

        await Goods.updateOne({
            _id: req.params._id
        }, {
            specification: data
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }
    res.sendResult(data, 200, '修改成功')
})

// 根据商品ID以及规格ID删除指定ID
router.delete('/:_id/specification/:_sId', async (req, res) => {
    var data = []
    try {

        const temp = await Goods.findOne({
            _id: req.params._id
        }).lean()
        data = temp.specification

        function check(item) {
            return item._id == req.params._sId
        }

        data.splice(data.findIndex(check), 1)
        await Goods.updateOne({
            _id: req.params._id
        }, {
            specification: data
        })

    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }
    res.sendResult(data, 204, '删除成功')
})

// 根据商品ID修改商品状态
router.put('/:_id/state/:state', async (req, res) => {
    try {
        await Goods.updateOne({
            _id: req.params._id
        }, {
            state: req.params.state
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }

    res.sendResult(null, 200, '修改成功')
})

module.exports = router;