// 引用expess框架
const express = require('express');
// 创建管理员管理模块路由对象
const router = express.Router();
// 导入bcrypt模块
const bcrypt = require('bcrypt');
// 引入数据库
const mongoose = require('mongoose')
// 引入管理员集合
const {
    Admin,
    validateAdmin
} = require('../../model/admin/admin.js');

// 获取管理员列表
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
    // 判断查询条件
    if (!query) {
        // 获取管理员数据列表
        response.data = await Admin.find().skip((pagenum - 1) * pagesize).limit(Number(pagesize));

        // 获取管理员数据总数
        response.totalpage = await Admin.estimatedDocumentCount()
    } else {
        // 获取与查询信息相关的管理员数据列表
        response.data = await Admin.find({
            $or: [{
                    name: {
                        $regex: new RegExp("" + query + "")
                    }
                },
                {
                    mobile: {
                        $regex: new RegExp("" + query + "")
                    }
                },
                {
                    email: {
                        $regex: new RegExp("" + query + "")
                    }
                }
            ]
        }).skip((pagenum - 1) * pagesize).limit(Number(pagesize))

        // 获取与查询信息相关的管理员数据总数
        response.totalpage = await Admin.find({
            $or: [{
                    name: {
                        $regex: new RegExp("" + query + "")
                    }
                },
                {
                    mobile: {
                        $regex: new RegExp("" + query + "")
                    }
                },
                {
                    email: {
                        $regex: new RegExp("" + query + "")
                    }
                }
            ]
        }).countDocuments()
    }

    res.json(200, response)
});

// 添加管理员
router.post('/', async (req, res) => {

    let {
        name,
        password,
        email,
        mobile
    } = req.body

    // 判断参数是否存在
    if (!name || !password)
        return res.json(400, null)

    // 判断参数是否合法
    try {
        await validateAdmin(req.body)
    } catch (err) {
        return res.json(400, null)
    }

    const verify = await Admin.findOne({
        name
    })

    if (verify)
        return res.json(400, null)

    // 对管理员密码进行加密 && 添加新管理员
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    await Admin.create({
        name,
        password,
        email,
        mobile
    })
    res.json(201, null)
})

// 修改管理员状态
router.put("/:_id/state/:state", async (req, res) => {

    // 判断参数是否合法
    try {
        await validateAdmin(req.params)
    } catch (err) {
        return res.json(400, null)
    }

    //修改管理员状态
    const verify = await Admin.updateOne({
        _id: mongoose.Types.ObjectId(req.params._id)
    }, {
        state: req.params.state
    })

    if (!verify.n)
        return res.json(400, null)

    res.json(200, null)
})

// 修改管理员信息
router.put("/:_id", async (req, res) => {

    const data = {
        _id: req.params._id,
        email: req.query.email,
        mobile: req.query.mobile
    }

    // 判断参数是否合法
    try {
        await validateAdmin(data)
    } catch (err) {
        return res.json(400, null)
    }

    // 修改管理员信息
    const verify = await Admin.updateOne({
        _id: mongoose.Types.ObjectId(data._id)
    }, {
        email: data.email,
        mobile: data.mobile
    })

    if (!verify.n)
        return res.json(400, null)

    res.json(200, null)
})

// 删除管理员
router.delete("/:_id", async (req, res) => {

    // 判断参数是否合法
    try {
        await validateAdmin(req.params)
    } catch (err) {
        return res.json(400, null)
    }

    // 删除管理员
    await Admin.findOneAndDelete({
        _id: req.params
    })

    res.json(200, null)

})

module.exports = router;