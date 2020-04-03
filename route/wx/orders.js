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


//创建订单
module.exports.createOrder = async (req, res) => {
    // 判断token是否有效
    const token = req.get("Authorization");
    const secretOrKey = keys.secretOrKey;
    jwt.verify(token, secretOrKey, (err, decode) => {
        if (err) {
            return res.json(401, null)
        } else {
            //如果订单总价格小于100，免邮费
            if (req.totalPrice < 100)
                var freight = 0;
            else
                var freight = 20;
            //创建订单文档
            const order = new Order({
                openid: decode.openid,
                address: JSON.parse(req.body.address),
                state: req.body.state,
                goods: JSON.parse(req.body.goods),
                totalPrice: req.body.totalPrice,
                freight: freight,
                creatDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                updateDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                datetimeTo:req.body.datetimeTo
            });
            //返回的数据
            const orderData={
                address: JSON.parse(req.body.address),
                state: req.body.state,
                goods: JSON.parse(req.body.goods),
                totalPrice: req.body.totalPrice,
                freight: freight,
            }
            order.save();
            return res.json({
                "status": "ok",
                "order":orderData
            })
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
            return res.json(401, null)
        } else {
            let id = req.body.state;
            //判断传过来的订单状态(1.全部 2.待付款 3.待发货 4.待收货 5.退款)
            if (id == 1) {
                Order.find({ openid: decode.openid }, "goods state totalPrice freight _id ", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 2) {
                Order.find({ openid: decode.openid, state: "待付款" }, "goods state totalPrice freight _id ", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 3) {
                Order.find({ openid: decode.openid, state: "待发货" }, "goods state totalPrice freight address _id ", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 4) {
                Order.find({ openid: decode.openid, state: "待收货" }, "goods state totalPrice freight address _id ", (err, data) => {
                    return res.json({
                        "status": "ok",
                        "goods": data
                    })
                })
            } else if (id == 5) {
                Order.find({ openid: decode.openid, state: "退款" }, "goods state totalPrice freight address _id ", (err, data) => {
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
            return res.json(401, null)
        } else {
            Order.findOne({ _id: req.body._id }, (err, data) => {
                if (data) {
                    let order = {
                        address: data.address,
                        goods: data.goods,
                        state: data.state,
                        totalPrice: data.totalPrice,
                        freight: data.freight,
                        datetimeTo:data.datetimeTo
                    };
                    return res.json({
                        "status": "ok",
                        "order": order
                    });
                } else {
                    return res.json(400, null)
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
            return res.json(401, null)
        } else {
            Order.deleteOne({ _id: req.body._id }, (err, data) => {
                if (data) {
                    return res.json({
                        "status": "ok",
                        "message": "删除成功!"
                    })
                }else{
                    return res.json(400, null)
                }
            })
        }
    })
}