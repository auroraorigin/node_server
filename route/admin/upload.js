// 引入formidable模块
const formidable = require('formidable');
// 引入路径模块
const path = require('path');

module.exports = (req, res) => {
    // 1.创建表单解析对象
    const form = new formidable.IncomingForm();
    // 2.配置上传文件的存放位置
    form.uploadDir = path.join(__dirname, '../', '../', 'public', 'uploads');
    // 3.保留上传文件的后缀
    form.keepExtensions = true;
    // 4.解析表单
    form.parse(req, async (err, fields, files) => {
        if (err)
            return res.json(400, null)
        try {
            let url = path.join('127.0.0.1:8888', files.pic.path.split('public')[1])
            res.json(200, url)
        } catch (error) {
            res.json(400, null)
        }
    
    })
}