// 引入mongoose模块
const mongoose = require('mongoose');

// 创建权限集合规则
const adSchema = new mongoose.Schema({
    swiper: {
        type: [String],
        required: true
    },
    notice: {
        type: [{name:String}],
        required: true
    },
    floor: {
        type: [{
            url: String,
            goods: []
        }],
        required: true
    },
    cate:{
        type: [{
            name: String,
            goods: []
        }],
        required: true
    },
    detail:[String],
    discount:Number
    
})

// 创建权限集合
const Ad = mongoose.model('ad', adSchema);

// Ad.create({
//     swiper:["http://127.0.0.1:8888/uploads/upload_4eaceda3e10c674b195969820de17af1.jpg","http://127.0.0.1:8888/uploads/upload_d92409b79c53859ed0013a788d629926.jpg"],
//     notice:[{name:"测试公告"},{name:"公告示例"},{name:"公告显示"}],
//     floor:[{url:"http://127.0.0.1:8888/uploads/upload_2766c081b3cc6a3a33b5621da227059a.jpg",goods:['5e75dc502fce220784b68850','5e7835f6672c4c1eb4c3937c']},{url:"http://127.0.0.1:8888/uploads/upload_2766c081b3cc6a3a33b5621da227059a.jpg",goods:['5e75dc502fce220784b68850','5e7835f6672c4c1eb4c3937c']}],
//     cate:[{name:"推荐",goods:['5e75dc502fce220784b68850','5e7835f6672c4c1eb4c3937c']}]
// })

module.exports = {
    Ad
}