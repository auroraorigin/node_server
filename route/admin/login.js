// 引入管理员集合
const {
    Admin,
    validateAdmin
} = require('../../model/admin/admin.js');
// 导入bcrypt模块
const bcrypt = require('bcrypt');
// 引入jwt模块
const jwt = require('jsonwebtoken')
// 引入秘钥模块
const keys = require('../../config/key')

module.exports = async (req, res) => {
    const {
        name,
        password
    } = req.body;

    // 判断参数是否存在
    if (!name || !password)
        return res.json(400, null)

    // 判断参数是否合法
    try {
        await validateAdmin(req.body)
    } catch (err) {
        return res.json(400, null)
    }

    // 判断用户账号是否存在
    let admin = await Admin.findOne({
        name
    })
    if (admin) {
        let isValid = await bcrypt.compare(password, admin.password)
        if (isValid) {
            // 账号密码正确，签发token
            const payload = {
                _id: admin._id
            }
            const secretOrKey = keys.secretOrKey;
            const token = jwt.sign(payload, secretOrKey, {
                // 有效期一天
                expiresIn: 60 * 60 * 24
            })
            return res.json(200, token)
        }
    }
    res.json(400, null)
}