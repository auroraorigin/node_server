const mongoose = require('mongoose');
const {Ad} = require('../model/admin/ad')
const Category = require('../model/admin/category')
const {Goods} = require('../model/admin/Goods')

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/database', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(async () => {
        console.log('清理模块激活')
		let temp = []
		await Ad.findOne({})
        
    })
    .catch(() => console.log('数据库连接失败'))
    