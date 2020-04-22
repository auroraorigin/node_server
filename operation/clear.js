const {
	Ad
} = require('../model/admin/ad')
const Category = require('../model/admin/category')
const {
	Goods
} = require('../model/admin/goods')

const fs = require("fs");
const Url = require('../config/url')
const {
	Order
  } = require('../model/wx/order');

module.exports = async ()=>{
	
	console.log('清理无效图片模块激活')
	//设置根目录
	var root = './public/uploads';

	//获取此文件夹下所有的文件(数组)
	var files = fs.readdirSync(root);
	var url = Url.path + '/uploads/'
	var arr = [];

	var ad = await Ad.findOne({}).lean()
	for (let i = 0; i < ad.swiper.length; i++) {
		arr.push(ad.swiper[i].split(url)[1])
	}
	for (let i = 0; i < ad.floor.length; i++) {
		arr.push(ad.floor[i].url.split(url)[1])
	}

	var category = await Category.find().lean()
	for (let i = 0; i < category.length; i++) {
		arr.push(category[i].url.split(url)[1])
	}

	var goods = await Goods.find().lean()
	for (let i = 0; i < goods.length; i++) {
		arr.push(goods[i].url.split(url)[1])

		for (let j = 0; j < goods[i].swiperUrl.length; j++) {
			arr.push(goods[i].swiperUrl[j].split(url)[1])
		}

		for (let j = 0; j < goods[i].urls.length; j++) {
			arr.push(goods[i].urls[j].split(url)[1])
		}
	}

	var order = await Order.find().lean()
	for (let i = 0; i < order.length; i++) {
		for (let j = 0; j < order[i].goods.length; j++) {
			arr.push(order[i].goods[j].url.split(url)[1])		
		}
	}


	console.log('开始清理无效图片')
	var sum = 0
	for (let i = 0; i < files.length; i++) {
		if (!arr.includes(files[i])) {
			sum++
			fs.unlink(`./public/uploads/${files[i]}`, function (error) {
				if (error) {
					console.log(error);
					return false;
				}
			})
		}
	}
	console.log('清理完毕')
	console.log(`共清理${sum}张无效图片`)
	
}
