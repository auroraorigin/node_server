// 引入商品集合
const {
    Goods,
} = require('../../model/admin/goods')
const {
    Ad
} = require('../../model/admin/ad')

module.exports = async (req, res) => {
    let { _id }= req.query
    let temp = JSON.parse(_id)
    
    let goods = await Goods.findOne({_id:temp._id},{categories:0,state:0,__v:0})
    let ad = await Ad.findOne({})
    let detail = ad.detail
    let discount = ad.discount
    res.json({"data":{goods,detail,discount},"status":200})
}