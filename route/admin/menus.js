const {
    Right
} = require('../../model/admin/right.js');

module.exports = async (res, req) => {
    
    let data = await Right.find({
        pid: []
    }, {
        __v: 0,
        pid: 0
    }).lean();

    for (let i = 0, len = data.length; i < len; i++) {
        data[i].children = await Right.find({
            pid: [data[i]._id]
        }, {
            __v: 0,
            pid: 0
        }).lean()
    }

    req.json(200, data)
}