// 引入权限集合
const {
    Right
} = require('../../model/admin/right.js');

module.exports = async (req, res) => {

    const type = req.params.type
    // 判断获取类型
    if (type === 'list') {
        const data = await Right.find({}, {
            __v: 0
        })
        res.sendResult(data,200,'获取权限列表成功')
    } else if (type === 'tree') {
        //获取一级权限
        let data = await Right.find({
            pid: []
        }, {
            __v: 0
        }).lean();

        // 嵌套循环获取树结构
        for (let i = 0, len = data.length; i < len; i++) {
            // 获取二级权限
            data[i].children = await Right.find({
                pid: [data[i]._id]
            }, {
                __v: 0
            }).lean()

            // 获取三级权限
            for (let j = 0, clen = data[i].children.length; j < clen; j++) {
                data[i].children[j].children = await Right.find({
                    pid: [data[i].children[j]._id, data[i]._id]
                }, {
                    __v: 0
                })
            }
        }

        res.sendResult(data,200,'获取权限列表成功')
    } else
    res.sendResult(null,400,'获取权限列表失败')

}