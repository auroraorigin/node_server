// 引入商品集合
const {
    Goods,
} = require('../../model/admin/goods')


module.exports = async (req, res) => {
   const {query}= req.query
    
   const data = await Goods.find({
    name: {
        $regex: new RegExp("" + query + "")
    },
    state:true
    },{state:0,swiperUrl:0,urls:0,desc:0,categories:0,__v:0})
    console.log(data)
   res.json({"data":data,"status":200})
}