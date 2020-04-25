// 导入 request 模块
const request = require('request')

//自动匹配运单号所属的物流公司
function autoComNumber(expressNumber) {
    const url = `https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${expressNumber}`
    return new Promise(function(resolve, reject) {
      request(url, (err, response, body) => {
        if (err) return resolve({ status: 500, msg: err.message })
        // resolve(body)
        // console.log(body.num)
        body = JSON.parse(body)
        if (body.auto.length <= 0) return resolve({ status: 501, msg: '无对应的物流公司' })
        resolve({ status: 200, msg: body.auto[0], comCode: body.auto[0].comCode })
      })
    })
}

module.exports = async (req, res) => {
    const result = await autoComNumber(req.params.expressNumber)
    if (result.status !== 200) {
      return res.send({
        meta: {
          status: 500,
          message: '获取物流信息失败！'
        }
      })
    }
  
    const dataUrl = `https://www.kuaidi100.com/query?type=${result.comCode}&postid=${req.params.expressNumber}&temp=0.2595247267684455`
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
  
    // let requestData = "{'OrderCode':'','ShipperCode':'HTKY','LogisticCode':'73504320078945'}";
    // let cba = requestData + "8eab6239-bb47-486a-aa39-deb662c17240";
    // let abc = md5(cba);
    // let base = Buffer.from(abc).toString('base64');
    // let result = encodeURIComponent(base);
    // let body = encodeURIComponent(requestData);
  
    // request({
    //   url: "http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx?EBusinessID=1633347&RequestType=1002&DataSign=" + result + "&RequestData=" + body,
    //   method: "POST",
    //   json: true,
    //   headers: {
    //     "content-type": "application/x-www-form-urlencoded;charset=utf-8"
    //   }
    // }, function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body) // 请求成功的处理逻辑
    //   }
    // })
  
  }