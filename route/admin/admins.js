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
        return res.sendResult(null, 400,'参数不合法')

    let response = {}
    // 判断查询条件
    if (!query) {
        // 获取管理员数据列表
        response.data = await Admin.find({}, {
            password: 0,
            __v: 0
        }).populate('role', 'name').skip((pagenum - 1) * pagesize).limit(Number(pagesize));

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
        }, {
            password: 0,
            __v: 0
        }).populate('role', 'name').skip((pagenum - 1) * pagesize).limit(Number(pagesize))

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

    res.sendResult(response, 200,'获取管理员列表成功')
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
        return res.sendResult(null, 400, '参数不合法')

    // 判断参数是否合法
    try {
        await validateAdmin(req.body)
    } catch (err) {
        return res.sendResult(null, 400, '参数不合法')
    }

    const verify = await Admin.findOne({
        name
    })

    if (verify)
        return res.sendResult(null, 400, '管理员名称已存在')

    // 对管理员密码进行加密 && 添加新管理员
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    await Admin.create({
        name,
        password,
        email,
        mobile
    })
    res.sendResult(null, 201, '添加管理员成功')
})

// 修改管理员状态
router.put("/:_id/state/:state", async (req, res) => {

    // 判断参数是否合法
    try {
        await validateAdmin(req.params)
    } catch (err) {
        return res.sendResult(null, 400, '参数不合法')
    }

    if(req.params._id==='5e955de71695aa14f0d5f7c8')
        return res.sendResult(null, 400, '权限不足')
        
    //修改管理员状态
    const verify = await Admin.updateOne({
        _id: mongoose.Types.ObjectId(req.params._id)
    }, {
        state: req.params.state
    })

    if (!verify.n)
        return res.sendResult(null, 400, '参数不合法')

    res.sendResult(null, 200, '修改管理员状态成功')
})

// 修改管理员信息
router.put("/:_id", async (req, res) => {

    const data = {
        _id: req.params._id,
        email: req.body.email,
        mobile: req.body.mobile
    }

    // 判断参数是否合法
    try {
        await validateAdmin(data)
    } catch (err) {
        return res.sendResult(null, 400, '参数不合法')
    }

    // 修改管理员信息
    const verify = await Admin.updateOne({
        _id: mongoose.Types.ObjectId(data._id)
    }, {
        email: data.email,
        mobile: data.mobile
    })

    if (!verify.n)
        return res.sendResult(null, 400, '修改失败')

    res.sendResult(null, 200, '修改成功')
})

// 删除管理员
router.delete("/:_id", async (req, res) => {

    // 判断参数是否合法
    try {
        await validateAdmin(req.params)
    } catch (err) {
        return res.sendResult(null, 400, '参数不合法')
    }

    if(req.params._id==='5e955de71695aa14f0d5f7c8')
        return res.sendResult(null, 400, '权限不足')
    
    // 删除管理员
    await Admin.findOneAndDelete({
        _id: req.params
    })

    res.sendResult(null, 204, '删除成功')

})

// 分配管理员角色
router.put("/:_id/role", async (req, res) => {
    try {
        await Admin.updateOne({
            _id: req.params._id
        }, {
            role: req.body.rid
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }

    res.sendResult(null, 200, '分配角色成功')
})

// 根据ID查询管理员
router.get("/:_id", async (req, res) => {
    var data
    try {
        data = await Admin.findOne({
            _id: req.params._id
        }, {
            password: 0,
            __v: 0
        }).populate('role', 'name')
    } catch (error) {
        res.sendResult(null, 400)
    }
    res.sendResult(data, 200)
})

module.exports = router;