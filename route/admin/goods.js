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
        return res.json(400, null)

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

    res.json(200, response)
})

// 添加商品
router.post('/', async (req, res) => {
    // 判断参数是否合法
    try {
        await validateGoods(req.body)
    } catch (error) {
        return res.json(400, null)
    }

    // 添加商品
    await Goods.create(req.body)

    res.json(200, req.body)
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
        res.json(400, null)
    }

    res.json(200, data)
})

// 根据ID修改商品
router.put('/:_id', async (req, res) => {
    const data = req.body
    try {
        await validateGoods(data)
        await Goods.updateOne({
                _id: req.params._id
            },
            data
        )
    } catch (error) {
        return res.json(400, null)
    }
    res.json(200, null)
})

// 根据ID删除商品
router.delete('/:_id', async (req, res) => {
    try {
        await Goods.findOneAndDelete({
            _id: req.params._id
        })
    } catch (error) {
        return res.json(400, null)
    }
    res.json(204, null)
})

module.exports = router;