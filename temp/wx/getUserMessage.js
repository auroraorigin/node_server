// 引入jsonwebtoken模块
const jwt = require('jsonwebtoken')
// 引入秘钥模块
const keys = require('../../config/key')

// 引入用户集合
const {
    User
} = require('../../model/wx/user.js');


module.exports = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json(401, null)
        } else {
            // token验证通过，放行
            User.findOne({ openid: decode.openid }, function (err, data) {
                if (data) {
                    let message = {
                        name: data.name,
                        mobile: data.mobile,
                        sex: data.sex,
                        birthday: data.birthday,
                        region: data.region,
                        wxNumber: data.wxNumber,
                        detailAddress: data.detailAddress
                    }
                    return res.json({
                        "status": "ok",
                        "message": message
                    });
                }
                else {
                    return res.json(404,null)
                }
            })
        }
    })
}