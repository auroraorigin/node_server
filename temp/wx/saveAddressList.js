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
                    //更新所有地址，微信地址和默认地址
                    let userAddress = {
                        addressList:JSON.parse(req.body.addressList),
                        wxAddress:JSON.parse(req.body.wechatAddress),
                        defaultAddress:JSON.parse(req.body.defaultAddress)
                    };
                    Address.updateOne({ openid: decode.openid }, userAddress).then(result => console.log(result));
                    return res.json({
                        "status": "ok",
                    });
                }
                else {
                    //如果查询不到，则表示第一次保存地址，插入文档
                    const address=new Address({
                        openid:decode.openid,
                        addressList:JSON.parse(req.body.addressList),
                        wxAddress:JSON.parse(req.body.wechatAddress),
                        defaultAddress:JSON.parse(req.body.defaultAddress)
                    });
                    address.save();
                    return res.json({
                        "status": "ok",
                    })
                }
            })
        }
    })
}