// 引入jsonwebtoken模块
const jwt = require('jsonwebtoken')
// 引入秘钥模块
const keys = require('../../config/key')

// 引入用户集合
const {
    Address
} = require('../../model/wx/address.js');

module.exports = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json(401, null)
        } else {
            // token验证通过，放行
            Address.findOne({ openid: decode.openid }, function (err, data) {
                if (data) {
                    let address = {
                        addressList:data.addressList,
                        wxAddress:data.wxAddress,
                        defaultAddress:data.defaultAddress,
                    }
                    //将获取到的地址返回
                    return res.json({
                        "status": "ok",
                        "address": address
                    });
                }else{
                    return res.json(404,null)
                }
            })
        }
    })
}