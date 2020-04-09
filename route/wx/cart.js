// 引入商品集合
const {
    Goods,
} = require('../../model/admin/goods')


module.exports = async (req, res) => {
   const {cart} = req.query
    
   let goods = JSON.parse(cart)
   let data=[]
   for (let i = 0; i < goods.length; i++) {
       let temp = await Goods.findOne({_id:goods[i]._id}).lean()
       if(!temp||!temp.state||!temp.specification[goods[i].specificationIndex]||temp.specification[goods[i].specificationIndex].stock===0)
        continue

        let maxPrice = temp.specification[0].price
        let minPrice = temp.specification[0].price
        let maxFreight = temp.specification[0].freight
        let minFreight = temp.specification[0].freight
        let stock = temp.specification[0].stock
        
        for (let k = 1; k < temp.specification.length; k++) {
            if(Number(maxPrice)<Number(temp.specification[k].price))
              maxPrice=temp.specification[k].price
            if(Number(minPrice)>Number(temp.specification[k].price))
              minPrice=temp.specification[k].price
            if(Number(maxFreight)<Number(temp.specification[k].freight))
              maxFreight=temp.specification[k].freight
            if(Number(minFreight)>Number(temp.specification[k].freight))
              minFreight=temp.specification[k].freight
            stock+=temp.specification[k].stock
          }
        
        temp.maxPrice=maxPrice
        temp.minPrice=minPrice
        temp.maxFreight=maxFreight
        temp.minFreight=minFreight
        temp.stock=stock
        temp.buyNumber=goods[i].buyNumber
        temp.specificationIndex=goods[i].specificationIndex
        temp.checked=goods[i].checked

       if(temp.buyNumber>temp.specification[temp.specificationIndex].stock)
            temp.buyNumber=temp.specification[temp.specificationIndex].stock
            
        data.push(temp)
   } 
   res.json({"data":data,"status":200})
}