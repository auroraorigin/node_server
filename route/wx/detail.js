// 引入商品集合
const {
    Goods,
} = require('../../model/admin/goods')


module.exports = async (req, res) => {
    let { id }= req.query
    let temp = JSON.parse(id)
    let{_id}=temp
    
    const data = await Goods.findOne({_id},{categories:0,state:0,__v:0})

    res.json({"data":data,"status":200})
}