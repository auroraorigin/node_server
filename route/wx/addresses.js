// 引入jsonwebtoken模块
const jwt = require('jsonwebtoken') 
// 引入秘钥模块
const keys = require('../../config/key')

// 引入用户集合
const {
    Address
} = require('../../model/wx/address.js');

module.exports.getAddress = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json({
                "status": "error"
            })
        } else {
            // token验证通过，放行
            Address.findOne({ openid: decode.openid }, function (err, data) {
                if (data) {
                    let address = {
                        addressList: data.addressList,
                        defaultAddress: data.defaultAddress,
                    }
                    //将获取到的地址返回
                    return res.json({
                        "status": "ok",
                        "address": address
                    });
                } else {
                    return res.json({
                        "status": "error",
                        "message": "还未添加地址"
                    })
                }
            })
        }
    })
}

module.exports.addressUpdate = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json({
                "status": "error"
            })
        } else {
            // token验证通过，放行
            Address.findOne({ openid: decode.openid }, function (err, data) {
                if (data) {
                    //更新所有地址，微信地址和默认地址
                    let userAddress = {
                        addressList: JSON.parse(req.body.addressList),
                        defaultAddress: JSON.parse(req.body.defaultAddress)
                    };
                    Address.updateOne({ openid: decode.openid }, userAddress).then(result => {});
                    return res.json({
                        "status": "ok",
                    });
                }
                else {
                    //如果查询不到，则表示第一次保存地址，插入文档
                    const address = new Address({
                        openid: decode.openid,
                        addressList: JSON.parse(req.body.addressList),
                        defaultAddress: JSON.parse(req.body.defaultAddress)
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

module.exports.getDefaultAddress = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.json({
                "status": "error"
            })
        } else {
            // token验证通过，放行
            Address.findOne({ openid: decode.openid }, function (err, data) {
                if (data) {
                    let defaultAddress = data.defaultAddress;
                    //将获取到的地址返回
                    return res.json({
                        "status": "ok",
                        "defaultAddress": defaultAddress,
                    });
                } else {
                    return res.json({
                        "status": "error"
                    })
                }
            })
        }
    })
}