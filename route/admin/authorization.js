// 引入jsonwebtoken模块
const jwt = require('jsonwebtoken')
// 引入秘钥模块
const keys = require('../../config/key')
// 路由关键词
const keyPath = ['admins', 'state', 'role', 'rights', 'roles', 'categories', 'goods', 'detail', 'specification', 'orders', 'kuaidi', 'upload', 'reports', 'ad', 'swiper', 'notice', 'goods', 'floor', 'cate','coupon','discount','detail']
// 引入管理员集合
const {
    Admin
} = require('../../model/admin/admin.js');
// 引入角色集合
const {
    Role
} = require('../../model/admin/role.js');
// 引入权限集合
const {
    Right
} = require('../../model/admin/right.js');

module.exports = async (req, res, next) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.sendResult(null, 401, '超时')
        } else {
            // token验证通过，判断权限
            if(decode._id==='5e955de71695aa14f0d5f7c8')
                return next()
            const admin = await Admin.findOne({
                _id: decode._id
            })

            if (!admin)
                return res.sendResult(null, 400, '账号不存在')
            else if (!admin.state)
                return res.sendResult(null, 401, '该账号已停用')

            const role = await Role.findOne({
                _id: admin.role
            })
            if (!role)
                return res.sendResult(null, 401, '权限不足')

            // 获取请求路径
            let temp = req.path.split('/')
            for (let i = 1; i < temp.length; i++) {
                if (!keyPath.includes(temp[i]))
                    temp[i] = '$'
            }
            temp = temp.join('/')
            const right = await Right.findOne({
                path: temp,
                method: req.method
            })
            
            if (!role.children.includes(right._id))
                return res.sendResult(null, 401, '权限不足')

            // 认证通过放行
            next();
        }
    })
}