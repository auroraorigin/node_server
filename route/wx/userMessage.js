// 引入jsonwebtoken模块
const jwt = require('jsonwebtoken')
// 引入秘钥模块
const keys = require('../../config/key')

// 引入用户集合
const {
    User
} = require('../../model/wx/user.js');

// 引入优惠卷集合
const {
    Coupon
} = require('../../model/wx/coupon.js');

const {
    isObjEmpty
}=require('../../config/isObjEmpty')


module.exports.getMessage = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json(401, null)
        } else {
            // token验证通过，放行
            User.findOne({ openid: decode.openid }, "name mobile sex birthday region wxNumber detailAddress", function (err, data) {
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
                    //判断对象是否为空，如果为空表示未设置个人信息，返回error
                    if (!isObjEmpty(message)) {
                        return res.json({
                            "status": "error",
                            "message": "还未设置个人信息"
                        })
                    } else {
                        return res.json({
                            "status": "ok",
                            "message": message
                        });
                    }
                }
                else {
                    return res.json(404, null)
                }
            })
        }
    })
}

module.exports.messageUpdata = async (req, res) => {
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
                    User.updateOne({ openid: data.openid }, message).then(result => console.log(result));
                    return res.json({
                        "status": "ok",
                    });
                }
                else {
                    return res.json(404, null)
                }
            })
        }
    })
}

//获取优惠卷列表
module.exports.getCouponList = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json(401, null)
        } else {
            // token验证通过，放行
            if (req.body.state == 1) {//表示要获取可用优惠卷列表
                var state = "可用"
            } else if (req.body.state == 2) {
                var state = "不可用"
            };
            Coupon.find({ openid: decode.openid, state: state }, "money effective name state", (err, data) => {
                let coupon = data;
                return res.json({
                    "status": "ok",
                    "coupon": coupon
                });
            })
        }
    })
}