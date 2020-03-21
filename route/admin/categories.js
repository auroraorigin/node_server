// 引用expess框架
const express = require('express');
// 创建商品分类API路由对象
const router = express.Router();
// 引入分类集合
const Category = require('../../model/admin/category')

// 获取商品分类列表
router.get('/', async (req, res) => {
    const {
        pagenum,
        pagesize
    } = req.query

    if (!pagenum && !pagesize) { // 获取商品分类数据列表
        const data = await Category.find({}, {
            __v: 0
        })
        return res.json(200, data)

    } else if (pagenum && pagesize) {
        let response = {}
        // 获取商品分类数据列表
        response.data = await Category.find({}, {
            __v: 0
        }).skip((pagenum - 1) * pagesize).limit(Number(pagesize));

        // 获取商品分类数据总数
        response.totalpage = await Category.estimatedDocumentCount()

        return res.json(200, response)
    }

    res.json(400, null)
})

// 添加商品分类
router.post('/', async (req, res) => {
    const {
        name
    } = req.query

    if (!name)
        return res.json(400, null)

    try {
        await Category.create({
            name
        })
    } catch (error) {
        return res.json(400, null)
    }

    res.json(201, null)
})

// 修改商品分类名称
router.put('/:_id', async (req, res) => {
    const _id = req.params._id
    const name = req.query.name

    try {
        await Category.updateOne({
            _id
        }, {
            name
        })
        res.json(200, null)
    } catch (error) {
        return res.json(400, null)
    }
})

// 删除商品分类
router.delete('/:_id', async (req, res) => {
    const _id = req.params._id

    try {
        await Category.findOneAndDelete({
            _id
        })
        res.json(204, null)
    } catch (error) {
        res.json(400, null)
    }
})

// 将路由对象作为模块成员进行导出
module.exports = router;