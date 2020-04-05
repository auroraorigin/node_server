// 引入ad模块
const {
    Ad
} = require('../../model/admin/ad')
const Category = require('../../model/admin/category')
// 引入商品集合
const {
    Goods,
} = require('../../model/admin/goods')
// 引入分类集合

module.exports = async (req, res) => {
    let data = {
        swiperList: [],
        noticeList: [],
        cateList: [],
        floorList: [],
    }
    
    // json = JSON.parse(JSON.stringify(data).replace(/_id/g, "value").replace(/name/g, "label"));
    let ad = await Ad.findOne({}).lean()
    data.swiperList=ad.swiper
    data.noticeList=ad.notice
    let category = await Category.find({},{__v:0}).limit(8)
    data.cateList=category
    
    let temp = []
    for (let i = 0; i < ad.floor.length; i++) {
        temp = await Goods.find({
            _id: {
                $in: ad.floor[i].goods
            },
            state:true
        },{state:0,swiperUrl:0,urls:0,desc:0,categories:0,__v:0})
        ad.floor[i].goods = temp
    }

    data.floorList=ad.floor
    res.json({"data":data,"status":200})
}