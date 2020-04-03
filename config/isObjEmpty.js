var isEmpty = function isEmpty(obj) {
    var flag = 0;//标记是否所有对象为空
    var length = 0;//记录对象的属性个数
    for (var key in obj) {
        if (!obj[key])
            flag = flag + 1;
        length = length + 1;
    }
    if (flag == length)
        return false;
    else
        return true;
}

module.exports.isObjEmpty = isEmpty;