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
                        name: req.body.name,
                        mobile: req.body.mobile,
                        sex: req.body.sex,
                        birthday: req.body.birthday,
                        region: req.body.region,
                        wxNumber: req.body.wxNumber,
                        detailAddress: req.body.detailAddress
                    };
                    User.updateOne({openid:data.openid}, message).then(result=>console.log(result));
                    return res.json({
                        "status": "ok",
                    });
                }
                else {
                    return res.json(404,null)
                }
            })
        }
    })
}