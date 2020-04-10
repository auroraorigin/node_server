// 引用expess框架
const express = require('express');
// 创建订单管理模块路由对象
const router = express.Router();
// 导入 request 模块
const request = require('request')
// 引入数据库
const mongoose = require('mongoose')
// 引入订单集合
const {
  Order
} = require('../../model/wx/order');

// 自动匹配运单号所属的物流公司
function autoComNumber(orderno) {
  const url = `https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${orderno}`
  return new Promise(function(resolve, reject) {
    request(url, (err, response, body) => {
      if (err) return reject({ status: 500, msg: err.message })
      // resolve(body)
      // console.log(body.num)
      body = JSON.parse(body)
      console.log(body)
      if (body.auto.length <= 0) return reject({ status: 501, msg: '无对应的物流公司' })
      resolve({ status: 200, msg: body.auto[0], comCode: body.auto[0].comCode })
    })
  })
}

// 获取订单列表
router.get('/', async (req, res) => {
  const {
    query,
    pagenum,
    pagesize
  } = req.query

  // 判断参数是否合法
  if (!pagenum || !pagesize || pagenum < 1)
    return res.sendResult(null, 400, '参数不合法')

  var response = {}
  try {
    if (!query) {
      // 获取订单列表
      response.data = await Order.find({}, {
        __v: 0
      }).skip((pagenum - 1) * pagesize).limit(Number(pagesize));

      // 获取订单数据总数
      response.totalpage = await Order.estimatedDocumentCount()

    } else {
      let isID
      try {
        mongoose.Types.ObjectId(query)
        isID = true
      } catch (error) {
        isID = false
      }

      if (isID) { 
        // 获取与查询信息相关的订单数据列表
        response.data = await Order.find({
          _id: query
        }, {
          __v: 0
        }).skip((pagenum - 1) * pagesize).limit(Number(pagesize))
        // 获取与查询信息相关的管理员数据总数
        response.totalpage = await Order.find({
          _id: query
        }).countDocuments()
      }else
      {
        // 获取与查询信息相关的订单数据列表
        response.data = await Order.find({
          openid: query
        }, {
          __v: 0
        }).skip((pagenum - 1) * pagesize).limit(Number(pagesize))
        // 获取与查询信息相关的管理员数据总数
        response.totalpage = await Order.find({
          openid: query
        }).countDocuments()
      }
    }
  } catch (error) {
    return res.sendResult(response, 400, '查询结果不存在')
  }

  res.sendResult(response, 200, '获取订单列表成功')
})

// 更新订单状态
router.put('/:_id/:operation', async (req, res) => {
  try {
    if (req.params.operation === 'send') {
      let time = parseInt(Date.now()/1000)+60*60*24*7
      await Order.updateOne({
        _id: req.params._id
      }, {
        state: '待收货',
        expressNumber: req.body.expressNumber,
        timestamp:time
      })
    } else if (req.params.operation === 'close') {
      await Order.updateOne({
        _id: req.params._id
      }, {
        state: '交易关闭'
      })
    }
  } catch (error) {
    return res.sendResult(null, 400, '参数不合法')
  }
  res.sendResult(null, 200, '更新订单状态成功')
})

// 修改订单基本信息
router.put('/:_id', async (req, res) => {
  try {
    var address = {
      consignee: req.body.consignee,
      detail_address: req.body.detail_address,
      mobile: req.body.mobile,
      region_name: req.body.region_name
    }
    await Order.updateOne({
      _id: req.params._id
    }, {
      address,
      expressNumber: req.body.expressNumber
    })
  } catch (error) {
    return res.sendResult(null, 400, '参数不合法')
  }
  res.sendResult(null, 200, '修改成功')
})

// 获取物流信息
router.get('/:orderno/kuaidi', async (req, res) => {
  const result = await autoComNumber(req.params.orderno)

  if (result.status !== 200) {
    return {
      meta: {
        status: 500,
        message: '获取物流信息失败！'
      }
    }
  }

  const dataUrl = `https://www.kuaidi100.com/query?type=${result.comCode}&postid=${req.params.orderno}&temp=0.2595247267684455`
  request(dataUrl, (err, response, body) => {
    if (err) {
      return res.send({
        meta: {
          status: 501,
          message: '获取物流信息失败！'
        }
      })
    }
    // 获取物流信息成功
    return res.send({
      meta: {
        status: 200,
        message: '获取物流信息成功！'
      },
      data: (JSON.parse(body)).data
    })
  })
})

module.exports = router;