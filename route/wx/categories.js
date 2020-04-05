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
    let data = await Ad.findOne({}, {
        _id: 0,
        swiper: 0,
        notice: 0,
        floor: 0,
        __v: 0
    }).lean()
    for (let i = 0; i < data.cate.length; i++) {
        let temp = await Goods.find({
            _id: {
                $in: data.cate[i].goods
            },
            state:true
        },{state:0,swiperUrl:0,urls:0,desc:0,categories:0,__v:0}).lean()
        data.cate[i].goods = temp
    }

    let temp = await Category.find({},{__v:0,url:0}).lean()
    for (let i = 0; i < temp.length; i++) {
        var goods = await Goods.find({
            categories:temp[i]._id,
            state:true
        },{state:0,swiperUrl:0,urls:0,desc:0,categories:0,__v:0}).lean()
        temp[i].goods=goods
    }
    
    res.json({
        "data": data.cate.concat(temp),
        "length":data.cate.length,
        "status": 200
    })
}