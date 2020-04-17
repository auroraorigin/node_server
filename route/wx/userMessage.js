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

//引入判断对象是否为空的函数
const {
    isObjEmpty
} = require('../../config/isObjEmpty')


module.exports.getMessage = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json({
                "status":"error"
            })
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
                    return res.json({
                        "status":"error"
                    })
                }
            })
        }
    })
}

//更新个人信息
module.exports.messageUpdata = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json({
                "status":"error"
            })
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
                    User.updateOne({ openid: data.openid }, message).then(result => {});
                    return res.json({
                        "status": "ok",
                    });
                }
                else {
                    return res.json({
                        "status":"error"
                    })
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
            return res.json({
                "status":"error"
            })
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

//获取优惠状态
module.exports.cheapState = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.json({
                "status":"error"
            })
        } else {
            let coupon = await Coupon.find({ openid: decode.openid },"name money state effective couponCenterId");
            //可使用优惠卷数组
            let canUseCoupon = [];
            //将满足满减的优惠卷数组进行拼接
            if (coupon.length!=0) {
                for (var i = 0; i < coupon.length; i++) {
                    if (Number(coupon[i].money[0]) <= Number(req.body.totalMoney))
                        canUseCoupon=canUseCoupon.concat(coupon[i])
                }
                //如果可用优惠卷为true
                if(canUseCoupon.length!=0){
                    return res.json({
                        "status":"ok",
                        "canUseCoupon":canUseCoupon,
                        "state":"有可用优惠卷"
                    })
                }else{
                    return res.json({
                        "status":"ok",
                        "state":"无可用优惠卷"
                    })
                }
            }else{
                return res.json({
                    "status":"error",
                    "message":"用户未拥有任何优惠卷",
                    "state":"无可用优惠卷"
                })
            }
        }
    })
}