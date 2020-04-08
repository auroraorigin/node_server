// 引入商品集合
const {
    Goods,
} = require('../../model/admin/goods')
// 引入ad模块
const {
    Ad
} = require('../../model/admin/ad')


module.exports = async (req, res) => {
   const ad= await Ad.findOne({})
   let data=[]

    for (let i = 0; i < ad.floor.length; i++) {
      let temp = await Goods.find({_id:{$in:ad.floor[i].goods}},{name:1}).lean()
      
      for (let j = 0; j < temp.length; j++) {
        if(!data.includes(temp[j].name))
        data.push(temp[j].name)
      }
    }

    for (let i = 0; i < ad.cate.length; i++) {
      let temp = await Goods.find({_id:{$in:ad.cate[i].goods}},{name:1}).lean()
      
      for (let j = 0; j < temp.length; j++) {
        if(!data.includes(temp[j].name))
        data.push(temp[j].name)
      }
    }


   res.json({"data":data,"status":200})
}