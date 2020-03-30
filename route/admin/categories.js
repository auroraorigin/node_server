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
        return res.sendResult(data, 200, '获取商品分类列表成功')

    } else if (pagenum && pagesize) {
        let response = {}
        // 获取商品分类数据列表
        response.data = await Category.find({}, {
            __v: 0
        }).skip((pagenum - 1) * pagesize).limit(Number(pagesize));

        // 获取商品分类数据总数
        response.totalpage = await Category.estimatedDocumentCount()

        return res.sendResult(response, 200, '获取商品分类列表成功')
    }

    res.sendResult(null, 400, '获取商品列表失败')
})

// 添加商品分类
router.post('/', async (req, res) => {
    const {
        name,
        url
    } = req.body

    if (!name||!url)
        return res.sendResult(null, 400, '参数不合法')


    try {
        await Category.create({
            name,url
        })
    } catch (error) {
        return res.sendResult(null, 400, '分类名称已存在')
    }

    res.sendResult(null, 201, '添加成功')
})

// 修改商品分类名称
router.put('/:_id', async (req, res) => {
    const _id = req.params._id
    const name = req.body.name
    const url = req.body.url

    try {
        await Category.updateOne({
            _id
        }, {
            name,
            url
        })
        res.sendResult(null,200,'修改成功')
    } catch (error) {
        return res.sendResult(null,400,'分类名称已存在')
    }
})

// 删除商品分类
router.delete('/:_id', async (req, res) => {
    const _id = req.params._id

    try {
        await Category.findOneAndDelete({
            _id
        })

        res.sendResult(null,204,'删除成功')
    } catch (error) {
        res.sendResult(null,400,'参数不合法')
    }
})

// 根据ID查询商品分类
router.get('/:_id', async (req, res) => {
    var data
    try {
        data = await Category.findOne({
            _id: req.params._id
        })
    } catch (error) {
        res.sendResult(null, 400, '参数不合法')
    }
    
    res.sendResult(data, 200, '查询成功')
})

// 将路由对象作为模块成员进行导出
module.exports = router;