// 引用expess框架
const express = require('express');
// 创建角色管理模块路由对象
const router = express.Router();
// 引入角色集合
const {
    Role,
    validateRole
} = require('../../model/admin/role.js');
// 引入权限集合
const {
    Right
} = require('../../model/admin/right.js');

// 获取角色列表
router.get('/', async (req, res) => {

    // 获取每个角色信息
    let data = await Role.find({}, {
        __v: 0
    }).lean();


    // 循环处理每个角色权限
    for (let i = 0; i < data.length; i++) {

        // 找出一级权限
        let right = await Right.find({
            _id: {
                $in: data[i].children
            },
            pid: []
        }, {
            __v: 0,
            pid: 0
        }).lean();

        // 嵌套循环获取权限树结构
        for (let j = 0, len = right.length; j < len; j++) {

            // 获取二级权限
            right[j].children = await Right.find({
                _id: {
                    $in: data[i].children
                },
                pid: [right[j]._id]
            }, {
                __v: 0,
                pid: 0
            }).lean()


            // 获取三级权限
            for (let k = 0, clen = right[j].children.length; k < clen; k++) {
                right[j].children[k].children = await Right.find({
                    _id: {
                        $in: data[i].children
                    },
                    pid: [right[j].children[k]._id, right[j]._id]
                }, {
                    __v: 0,
                    pid: 0
                })
            }
        }

        // 处理完权限赋值给角色
        data[i].children = right
    }


    res.sendResult(data, 200, '获取角色列表成功')
})

// 添加角色
router.post('/', async (req, res) => {
    const {
        name,
        desc
    } = req.body

    if (!name)
        return res.sendResult(null, 400, '参数不合法')

    // 判断参数是否合法
    try {
        await validateRole(req.body)
    } catch (err) {
        return res.sendResult(null, 400, '参数不合法')
    }

    // 判断角色名是否存在
    const verify = await Role.findOne({
        name
    })

    if (verify)
        return res.sendResult(null, 400, '角色名字已存在')

    await Role.create({
        name,
        desc
    })

    res.sendResult(null, 201, '添加角色成功')
})

// 修改角色
router.put('/:_id', async (req, res) => {
    const {
        _id
    } = req.params

    const {
        name,
        desc
    } = req.body

    if (!_id || !name)
        return res.sendResult(null, 400, '参数不合法')

    // 判断参数是否合法
    try {
        await validateRole(req.body)
        await validateRole(req.params)
    } catch (err) {
        console.log(err)
        return res.sendResult(null, 400, '参数不合法')
    }

    // 尝试修改角色名字
    try {
        await Role.updateOne({
            _id
        }, {
            name,
            desc
        })
    } catch (error) {
        return res.sendResult(null, 400, '角色名字已存在')
    }


    res.sendResult(null, 200, '修改成功')
})

// 删除角色
router.delete('/:_id', async (req, res) => {

    // 删除角色
    try {
        await Role.findOneAndDelete({
            _id: req.params
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }

    res.sendResult(null, 204, '删除成功')
})

// 角色授权
router.post('/:_id/rights', async (req, res) => {

    const {
        rids
    } = req.body

    let arr = []

    if (rids)
        arr = rids.split(',')

    try {
        await Role.updateOne({
            _id: req.params._id
        }, {
            children: arr
        })
    } catch (error) {
        return res.sendResult(null, 400, '参数不合法')
    }

    res.sendResult(null, 200, '授权成功')
})

// 删除角色指定权限
router.delete('/:roleId/rights/:rightId', async (req, res) => {
    try {
        // 找出roleId对应的角色
        var role = await Role.findOne({
            _id: req.params.roleId
        }).lean()

        // 找出该权限及该权限所有的子权限ID
        var rightId = req.params.rightId
        var right = await Right.find({
            _id: {
                $in: role.children,
                $ne: rightId
            },
            pid: {
                $ne: rightId
            }

        }).lean()

        var children = []
        // 转化为数组
        for (let i = 0; i < right.length; i++)
            children.push(right[i]._id)

        await Role.updateOne({
            _id: req.params.roleId
        }, {
            children
        })

        // 找出一级权限
        var data = await Right.find({
            _id: {
                $in: children
            },
            pid: []
        }, {
            __v: 0,
            pid: 0
        }).lean();

        // 嵌套循环获取树结构
        for (let i = 0, len = data.length; i < len; i++) {
            // 获取二级权限
            data[i].children = await Right.find({
                _id: {
                    $in: children
                },
                pid: [data[i]._id]
            }, {
                __v: 0
            }).lean()

            // 获取三级权限
            for (let j = 0, clen = data[i].children.length; j < clen; j++) {
                data[i].children[j].children = await Right.find({
                    _id: {
                        $in: children
                    },
                    pid: [data[i].children[j]._id, data[i]._id]
                }, {
                    __v: 0
                })
            }
        }
    } catch (err) {
        return res.sendResult(null, 400, '参数不合法')
    }

    res.sendResult(data, 204, '删除角色指定权限成功')
})

// 根据ID查询角色
router.get('/:_id', async (req, res) => {
    var data
    try {
        data = await Role.findOne({
            _id: req.params._id
        }, {
            __v: 0,
            children: 0
        })
    } catch (error) {
        res.sendResult(null, 400, '参数不合法')
    }
    res.sendResult(data, 200, '查询成功')
})
module.exports = router;