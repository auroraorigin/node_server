// 引入formidable模块
const formidable = require('formidable');
// 引入路径模块
const path = require('path');
const Url = require('../../config/url')

module.exports = (req, res) => {
    // 1.创建表单解析对象
    const form = new formidable.IncomingForm();
    // 2.配置上传文件的存放位置
    form.uploadDir = path.join(__dirname, '../', '../', 'public', 'uploads');
    // 3.保留上传文件的后缀
    form.keepExtensions = true;
    // 4.解析表单
    form.parse(req, async (err, fields, files) => {
        let url = ''
        if (err)
            return res.sendResult(null, 400, '上传失败')
        
        url = Url.path + files.file.path.split('public')[1].replace(/\\/g, "/")
        
        res.sendResult(url, 200, '上传成功')
    })
}