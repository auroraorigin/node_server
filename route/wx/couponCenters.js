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
            return res.json({
                "status": "error"
            })
        } else {
            var timestamp = Date.parse(new Date());
            var date = new Date(timestamp);
            //获取年份  
            var Y = date.getFullYear();
            //获取月份  
            var M = Number((date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1));
            //获取当日日期 
            var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            CouponCenter.find().select("name effective money number").lean().then(async result => {
                if (result) {
                    let couponList = result;
                    couponList.forEach(item => {
                        //isActive表示用户是否已领取优惠卷，false表示未领取，true表示已领取
                        item.isActive = false;
                        //effectiveState表示是否已到领取日期false表示未到或已过，true表示可以领取
                        item.effectiveState = true;
                        //将开始日期年月日分离
                        var arr = item.effective[0].split(".");
                        //未到领取日期
                        if ((Number(arr[0]) > Y) || ((Number(arr[0]) == Y) && (Number(arr[1]) > M)) || ((Number(arr[0]) == Y) && Number(arr[1]) == M &&
                            Number(arr[2]) > D)) {
                            item.effectiveState = false
                        }
                        //将截至日期年月日分离
                        var arr1 = item.effective[1].split(".");
                        //超过领取日期
                        if ((Number(arr1[0]) < Y) || ((Number(arr1[0]) == Y) && (Number(arr1[1]) < M)) || ((Number(arr1[0]) == Y) && Number(arr1[1]) == M &&
                            Number(arr1[2]) < D)) {
                            item.effectiveState = false
                        }
                    });
                    let coupon = await Coupon.find({ openid: decode.openid });
                    for (var i = 0; i < result.length; i++) {
                        for (var j = 0; j < coupon.length; j++) {
                            if (result[i]._id == coupon[j].couponCenterId)
                                if (couponList[i].effective == true)
                                    couponList[i].isActive = true;
                        }
                    }
                    console.log(couponList)
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
            return res.json({
                "status": "error"
            })
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
                        couponCenterId: id,
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
                CouponCenter.deleteOne({ _id: id }).then(result => { });
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