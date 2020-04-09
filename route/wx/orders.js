//引入moment日期格式化模板
const moment = require('moment')
// 引入jsonwebtoken模块
const jwt = require('jsonwebtoken')
// 引入秘钥模块
const keys = require('../../config/key')
// 引入订单集合
const {
    Order
} = require('../../model/wx/order.js');

//引入判断对象是否为空的函数
const {
    isObjEmpty
} = require('../../config/isObjEmpty');

// 引入优惠卷集合
const {
    Coupon
} = require('../../model/wx/coupon.js');

//引入商品集合
const {
    Goods
} = require('../../model/admin/goods.js');

//创建订单
module.exports.createOrder = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.json({
                "status":"error"
            })
        } else {
            //如果订单总价格小于100，免邮费
            if (req.totalPrice < 100)
                var freight = 0;
            else
                var freight = 20;
            //对应商品减库存
            let goods = JSON.parse(req.body.goods);
            for (var i = 0; i < goods.length; i++) {
                //获取数据库对应id的商品
                let good = await Goods.findOne({ _id: goods[i]._id });
                var specification = good.specification;
                //将库存与商品数量相减
                var stock = specification[goods[i].specificationIndex].stock - goods[i].buyNumber;
                //判断库存是否充分，并设置对应信息
                if (stock >= 0) {
                    specification[goods[i].specificationIndex].stock = stock;
                    Goods.updateOne({ _id: goods[i]._id }, { specification }).then();
                    var stockMessage="库存减少成功";
                }else{
                    var stockMessage="库存不足";
                    break;
                }
            }
            //如果有使用优惠卷
            if (isObjEmpty(JSON.parse(req.body.coupon))&&stockMessage=="库存减少成功") {
                //创建订单文档
                const order = new Order({
                    openid: decode.openid,
                    address: JSON.parse(req.body.address),
                    state: req.body.state,
                    goods: goods,
                    totalPrice: req.body.totalPrice,
                    freight: freight,
                    coupon: JSON.parse(req.body.coupon),
                    creatDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    datetimeTo: req.body.datetimeTo
                });
                order.save();
                //删除用户使用的优惠卷
                Coupon.deleteOne({ _id: order.coupon._id, openid: decode.openid }, (err, data) => { });
                //再次创建文档，且只插入openid和couponCenterID，用于标记用户已经领取过该优惠卷并且使用掉了
                const coupon = new Coupon({
                    openid: decode.openid,
                    couponCenterId: order.coupon.couponCenterId
                });
                coupon.save();
                //返回的数据
                const orderData = {
                    address: JSON.parse(req.body.address),
                    state: req.body.state,
                    goods: goods,
                    totalPrice: req.body.totalPrice,
                    freight: freight,
                    coupon: order.coupon
                }
                return res.json({
                    "status": "ok",
                    "order": orderData,
                    "stockMessage":stockMessage
                })
            } else if(!isObjEmpty(JSON.parse(req.body.coupon))&&stockMessage=="库存减少成功") {
                //创建订单文档
                const order = new Order({
                    openid: decode.openid,
                    address: JSON.parse(req.body.address),
                    state: req.body.state,
                    goods: goods,
                    totalPrice: req.body.totalPrice,
                    freight: freight,
                    creatDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    datetimeTo: req.body.datetimeTo
                });
                order.save();
                //返回的数据
                const orderData = {
                    address: JSON.parse(req.body.address),
                    state: req.body.state,
                    goods: goods,
                    totalPrice: req.body.totalPrice,
                    freight: freight,
                }
                return res.json({
                    "status": "ok",
                    "order": orderData,
                    "stockMessage":stockMessage
                })
            }else if(stockMessage=="库存不足"){
                return res.json({
                    "status": "error",
                    "stockMessage":stockMessage
                })
            }
        }
    })
}

//加载订单
module.exports.getOrder = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json({
                "status":"error"
            })
        } else {
            let id = req.body.state;
            //判断传过来的订单状态(1.全部 2.待付款 3.待发货 4.待收货 5.退款)
            if (id == 1) {
                Order.find({ openid: decode.openid }, "goods state totalPrice freight _id coupon", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 2) {
                Order.find({ openid: decode.openid, state: "待付款" }, "goods state totalPrice freight _id coupon", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 3) {
                Order.find({ openid: decode.openid, state: "待发货" }, "goods state totalPrice freight address _id coupon", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 4) {
                Order.find({ openid: decode.openid, state: "待收货" }, "goods state totalPrice freight address _id coupon", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 5) {
                Order.find({ openid: decode.openid, state: "退款" }, "goods state totalPrice freight address _id coupon", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else {
                return res.json({
                    "status": "error",
                    "message": "查无此订单列表"
                })
            }
        }
    })
}

//获取订单详情
module.exports.getOrderDetail = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json({
                "status":"error"
            })
        } else {
            Order.findOne({ _id: req.body._id }, (err, data) => {
                if (data.coupon) {
                    let order = {
                        address: data.address,
                        goods: data.goods,
                        state: data.state,
                        totalPrice: data.totalPrice,
                        freight: data.freight,
                        datetimeTo: data.datetimeTo,
                        coupon: data.coupon
                    };
                    return res.json({
                        "status": "ok",
                        "order": order
                    });
                } else {
                    let order = {
                        address: data.address,
                        goods: data.goods,
                        state: data.state,
                        totalPrice: data.totalPrice,
                        freight: data.freight,
                        datetimeTo: data.datetimeTo,
                    };
                    return res.json({
                        "status": "ok",
                        "order": order
                    });
                }
            })
        }
    })
}

//删除订单
module.exports.deleteOrder = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json({
                "status":"error"
            })
        } else {
            Order.deleteOne({ _id: req.body._id }, (err, data) => {
                if (data) {
                    return res.json({
                        "status": "ok",
                        "message": "删除成功!"
                    })
                } else {
                    return res.json(400, null)
                }
            })
        }
    })
}