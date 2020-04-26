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

//引入ad集合
const {
    Ad
} = require('../../model/admin/ad.js');

//创建订单
module.exports.createOrder = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.json({
                "status": "error"
            })
        } else {
            let goods = JSON.parse(req.body.goods);
            var stateMessage = "商品上架中";
            var stockMessage = "";
            if (req.body.state == "待发货") {
                //对应商品减库存
                for (var i = 0; i < goods.length; i++) {
                    //获取数据库对应id的商品
                    let good = await Goods.findOne({ _id: goods[i]._id });
                    var specification = good.specification;
                    var state = good.state;
                    //将库存与商品数量相减
                    var stock = specification[goods[i].specificationIndex].stock - goods[i].buyNumber;
                    //如果商品处于上架状态
                    if (state == true) {
                        //判断库存是否充分，并设置对应信息
                        if (stock >= 0) {
                            specification[goods[i].specificationIndex].stock = stock;
                            Goods.updateOne({ _id: goods[i]._id }, { specification }).then();
                            stockMessage = "库存减少成功";
                        } else {
                            stockMessage = "库存不足";
                            break;
                        };
                        stateMessage = "商品上架中"
                    } else {
                        stateMessage = "商品已下架";
                        break;
                    }
                }
            } else if (req.body.state = "待付款") {
                //待付款状态则判断库存是否足够，但不减库存
                for (var i = 0; i < goods.length; i++) {
                    //获取数据库对应id的商品
                    let good = await Goods.findOne({ _id: goods[i]._id });
                    var specification = good.specification;
                    var state = good.state;
                    //将库存与商品数量相减
                    var stock = specification[goods[i].specificationIndex].stock - goods[i].buyNumber;
                    //如果商品处于上架状态
                    if (state == true) {
                        //判断库存是否充分，并设置对应信息
                        if (stock >= 0) {
                            stockMessage = "库存足够";
                        } else {
                            stockMessage = "库存不足";
                            break;
                        };
                        stateMessage = "商品上架中"
                    } else {
                        stateMessage = "商品已下架";
                        break;
                    }
                }
            }
            //如果有使用优惠卷
            if (isObjEmpty(JSON.parse(req.body.coupon)) && (stockMessage == "库存减少成功" || stockMessage == "库存足够")) {
                //计算订单实付款（包括商品价格+运费-优惠卷）
                var havedPaid = Number(req.body.totalPrice) + Number(req.body.freight) - JSON.parse(req.body.coupon).money[1];
                //创建订单文档
                const order = new Order({
                    openid: decode.openid,
                    address: JSON.parse(req.body.address),
                    state: req.body.state,
                    goods: goods,
                    totalPrice: req.body.totalPrice,
                    freight: req.body.freight,
                    coupon: JSON.parse(req.body.coupon),
                    createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    timestamp: req.body.timestamp,
                    userWord: req.body.userWord,
                    havedPaid: havedPaid
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
                    freight: req.body.freight,
                    coupon: order.coupon,
                    _id: order.get("_id"),
                    createDate: order.createDate
                }
                return res.json({
                    "status": "ok",
                    "order": orderData,
                    "stockMessage": stockMessage,
                    "stateMessage": stateMessage
                })
            } else if (!isObjEmpty(JSON.parse(req.body.coupon)) && (stockMessage == "库存减少成功" || stockMessage == "库存足够")) {
                //计算订单实付款（包括商品价格+运费）
                var havedPaid = Number(req.body.totalPrice) + Number(req.body.freight);
                //创建订单文档
                const order = new Order({
                    openid: decode.openid,
                    address: JSON.parse(req.body.address),
                    state: req.body.state,
                    goods: goods,
                    totalPrice: req.body.totalPrice,
                    freight: req.body.freight,
                    createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    timestamp: req.body.timestamp,
                    userWord: req.body.userWord,
                    havedPaid: havedPaid
                });
                order.save();
                //返回的数据
                const orderData = {
                    address: JSON.parse(req.body.address),
                    state: req.body.state,
                    goods: goods,
                    totalPrice: req.body.totalPrice,
                    freight: req.body.freight,
                    _id: order.get("_id"),
                    createDate: order.createDate
                }
                return res.json({
                    "status": "ok",
                    "order": orderData,
                    "stockMessage": stockMessage,
                    "stateMessage": stateMessage
                })
            } else if (stockMessage == "库存不足") {
                return res.json({
                    "status": "error",
                    "stockMessage": stockMessage
                })
            } else if (stateMessage == "商品已下架") {
                return res.json({
                    "status": "error",
                    "stateMessage": "存在商品下架"
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
                "status": "error"
            })
        } else {
            let id = req.body.state;
            //判断传过来的订单状态(1.全部 2.待付款 3.待发货 4.待收货 5.退款)
            if (id == 1) {
                Order.find({ openid: decode.openid },
                    "goods state totalPrice freight _id coupon havedPaid expressNumber returnReason createDate", { sort: { _id: -1 } }, (err, data) => {
                        return res.json({
                            "status": "ok",
                            "goods": data
                        })
                    })
            } else if (id == 2) {
                Order.find({ openid: decode.openid, state: "待付款" },
                    "goods state totalPrice freight _id coupon havedPaid", { sort: { _id: -1 } }, (err, data) => {
                        return res.json({
                            "status": "ok",
                            "goods": data
                        })
                    })
            } else if (id == 3) {
                Order.find({ openid: decode.openid, state: "待发货" },
                    "goods state totalPrice freight address _id coupon havedPaid", { sort: { _id: -1 } }, (err, data) => {
                        return res.json({
                            "status": "ok",
                            "goods": data
                        })
                    })
            } else if (id == 4) {
                Order.find({ openid: decode.openid, state: "待收货" },
                    "goods state totalPrice freight address _id coupon havedPaid expressNumber createDate", { sort: { _id: -1 } }, (err, data) => {
                        return res.json({
                            "status": "ok",
                            "goods": data
                        })
                    })
            } else if (id == 5) {
                Order.find({ openid: decode.openid, state: "退款中" },
                    "goods state totalPrice freight address _id coupon havedPaid expressNumber returnReason", { sort: { _id: -1 } }, (err, data) => {
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
                "status": "error"
            })
        } else {
            Order.findOne({ _id: req.body._id }, (err, data) => {
                if (data) {
                    let order = {
                        address: data.address,
                        goods: data.goods,
                        state: data.state,
                        totalPrice: data.totalPrice,
                        freight: data.freight,
                        timestamp: data.timestamp,
                        coupon: data.coupon,
                        expressNumber: data.expressNumber,
                        returnReason: data.returnReason,
                        createDate: data.createDate,
                        havedPaid: data.havedPaid
                    };
                    return res.json({
                        "status": "ok",
                        "order": order
                    });
                } else {
                    return res.json({
                        "status": "error",
                    });
                }
            })
        }
    })
}

//取消订单
module.exports.deleteOrder = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.json({
                "status": "error"
            })
        } else {
            //获取该订单的优惠卷
            var order = await Order.findOne({ _id: req.body._id });
            var orderCoupon = order.coupon;
            //如果用户使用了优惠卷
            if (orderCoupon) {
                //删除该用户的已使用优惠卷标志
                Coupon.deleteOne({ openid: decode.openid, couponCenterId: orderCoupon.couponCenterId }, (err, data) => {});
                //将该用户的优惠卷返还给他
                const coupon = new Coupon({
                    money: orderCoupon.money,
                    effective: orderCoupon.effective,
                    state: orderCoupon.state,
                    name: orderCoupon.name,
                    couponCenterId: orderCoupon.couponCenterId,
                    openid: decode.openid
                });
                coupon.save();
            }
            //删除该订单
            Order.deleteOne({ _id: req.body._id }, (err, data) => {
                if (data) {
                    return res.json({
                        "status": "ok",
                        "message": "删除成功!"
                    })
                } else {
                    return res.json({
                        "status": "error"
                    })
                }
            })
        }
    })
}

//订单状态转换
module.exports.changeOrderState = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.json({
                "status": "error"
            })
        } else {
            var state = req.body.state;
            //待付款转待发货
            if (state == "待付款转待发货") {
                //获取数据库的该订单数据
                let order = await Order.findOne({ _id: req.body._id });
                let goods = order.goods;
                var stateMessage = "商品上架中";
                var stockMessage = "";
                //对应商品减库存
                for (var i = 0; i < goods.length; i++) {
                    //获取数据库对应id的商品
                    let good = await Goods.findOne({ _id: goods[i]._id });
                    var specification = good.specification;
                    var state = good.state;
                    //将库存与商品数量相减
                    var stock = specification[goods[i].specificationIndex].stock - goods[i].buyNumber;
                    //如果商品处于上架状态
                    if (state == true) {
                        //判断库存是否充分，并设置对应信息
                        if (stock >= 0) {
                            specification[goods[i].specificationIndex].stock = stock;
                            Goods.updateOne({ _id: goods[i]._id }, { specification }).then();
                            stockMessage = "库存减少成功";
                        } else {
                            stockMessage = "库存不足";
                            break;
                        };
                        stateMessage = "商品上架中"
                    } else {
                        stateMessage = "商品已下架";
                        break;
                    }
                }
                if (stockMessage == "库存减少成功" && stateMessage == "商品上架中") {
                    Order.updateOne({ _id: req.body._id }, { state: "待发货" }, (err, data) => {
                        return res.json({
                            "status": "ok",
                            "stockMessage": stockMessage,
                            "stateMessage": stateMessage
                        })
                    })
                } else if (stockMessage == "库存不足" || stateMessage == "商品已下架") {
                    return res.json({
                        "status": "error",
                        "stockMessage": stockMessage,
                        "stateMessage": stateMessage
                    })
                }
            }
            //待付款超时转交易关闭
            else if (state == "待付款转交易关闭") {
                //获取该订单的优惠卷
                var order = await Order.findOne({ _id: req.body._id });
                if (order.coupon)
                    var orderCoupon = order.coupon;
                //如果用户使用了优惠卷
                if (orderCoupon) {
                    //删除该用户的已使用优惠卷标志
                    Coupon.deleteOne({ openid: decode.openid, couponCenterId: orderCoupon.couponCenterId }, (err, data) => { });
                    //将该用户的优惠卷返还给他
                    const coupon = new Coupon({
                        money: orderCoupon.money,
                        effective: orderCoupon.effective,
                        state: orderCoupon.state,
                        name: orderCoupon.name,
                        couponCenterId: orderCoupon.couponCenterId,
                        openid: decode.openid
                    });
                    coupon.save();
                }
                Order.updateOne({ _id: req.body._id }, { state: "交易关闭" }, (err, data) => {
                    return res.json({
                        "status": "ok"
                    })
                })
            } else if (state == "待收货转交易成功") {//待收货超时转交易成功
                Order.updateOne({ _id: req.body._id }, { state: "交易成功" }, (err, data) => {
                    return res.json({
                        "status": "ok"
                    })
                })
            } else if (state == "申请退款") {//待发货||待收货申请退款转退款中
                Order.updateOne({ _id: req.body._id },
                    { state: "退款中", $set: { returnReason: req.body.returnReason } }, (err, data) => {
                        return res.json({
                            "status": "ok",
                            "createDate": data.createDate
                        })
                    })
            } else if (state == "取消退款") {//退款中转待发货或待收货
                Order.updateOne({ _id: req.body._id }, { state: req.body.toState }, (err, data) => {
                    return res.json({
                        "status": "ok"
                    })
                })
            }
        }
    })
}

//获取满减金额
module.exports.getDiscount = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, async (err, decode) => {
        if (err) {
            return res.json({
                "status": "error"
            })
        } else {
            //引入部分地区满包邮的价格
            const ad = await Ad.findOne().then();
            var discount = ad.discount;
            res.json({
                "status": "ok",
                "discount": discount
            })
        }
    })
}