// 引入jsonwebtoken模块
const jwt = require('jsonwebtoken')
// 引入秘钥模块
const keys = require('../../config/key')

// 引入优惠卷中心集合
const {
    CouponCenter
} = require('../../model/wx/couponCenter.js');

// 引入优惠卷集合
const {
    Coupon
} = require('../../model/wx/coupon.js');

//获取优惠卷中心列表
module.exports.getCouponCenter = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json(401, null)
        } else {
            CouponCenter.find().select("name effective money number").lean().then(async result => {
                if (result) {
                    let couponList = result;
                    couponList.forEach(item => {
                        item.isActive = false;
                    });
                    let coupon = await Coupon.find({ openid: decode.openid });
                    for (var i = 0; i < result.length; i++) {
                        for (var j = 0; j < coupon.length; j++) {
                            if (result[i]._id==coupon[j].couponCenterId)
                                couponList[i].isActive = true;
                        }
                    }
                    return res.json({
                        "status": "ok",
                        "couponList": couponList
                    })
                } else {
                    return res.json({
                        "status": "error",
                        "message": "暂无可领取优惠卷"
                    })
                }
            })
        }
    })
}

//获取优惠卷
module.exports.getCoupon = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json(401, null)
        } else {
            //获取传递过来的参数
            const { id, number } = req.body;
            CouponCenter.findOne({ _id: id }, (err, data) => {
                if (data) {
                    const coupon = new Coupon({
                        money: data.money,
                        effective: data.effective,
                        state: "可用",
                        name: data.name,
                        couponCenterId:id,
                        openid: decode.openid
                    });
                    coupon.save();
                } else {
                    return res.json({
                        "status": "error",
                        "message": "领取优惠卷出错"
                    })
                }
            })
            if (number == 1) {
                CouponCenter.deleteOne({ _id: id }).then(result => console.log(result));
                return res.json({
                    "status": "ok",
                    "message": "领取优惠卷成功"
                })
            } else if (number >= 1) {
                CouponCenter.updateOne({ _id: id }, { number: number - 1 }, (err, data) => {
                    if (data) {
                        return res.json({
                            "status": "ok",
                            "message": "领取优惠卷成功"
                        })
                    } else {
                        return res.json({
                            "status": "error",
                            "message": "领取优惠卷失败"
                        })
                    }
                })
            } else {
                return res.json({
                    "status": "error",
                    "message": "领取优惠卷失败"
                })
            }
        }
    })
}