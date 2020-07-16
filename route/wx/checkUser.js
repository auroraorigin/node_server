//erpress
const express = require('express');

//处理node request请求
const request = require('request');

//微信小程序设置
const wx = require('../../config/wxconfig.json'); //文件中存储了appid 和 secret

//token
const jwt = require('jsonwebtoken');

// 引入秘钥模块
const keys = require('../../config/key')

//引入mongoose
const mongoose = require('mongoose')

// 引入用户集合
const {
    User
} = require('../../model/wx/user.js');


module.exports = async (req, res) => {
    //拿到前台给的code后，发送请求
    if (req.body.code) {
        let options = {
            method: 'GET',
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${wx.appid}&secret=${wx.appsecret}&js_code=${req.body.code}&grant_type=authorization_code`
        };
        request(options, (error, response, body) => {
            if (error) {
                //请求异常时，返回错误信息
                return res.json({
                    "status":"error"
                })
            } else {
                //返回值的字符串转JSON
                let _data = JSON.parse(body);
                const payload = {
                    code: req.body.code,
                    openid: _data.openid,
                    session_key: _data.session_key
                }
                const secretOrKey = keys.secretOrKey;
                //根据返回值创建token
                let token = jwt.sign(payload, secretOrKey);
                User.findOne({ openid: _data.openid }, function (err, data) {
                    //当数据库中查询到openid时，更新token
                    if (data) {
                        // console.log('请求成功，正在签发token')
                        //return res.status(200).json(token);
                        return res.json({
                            "status": "ok",
                            "token": token
                        })
                    } else {
                        //当数据库中没有该openid时，插入。
                        const user = new User({
                            openid: _data.openid,
                        });
                        user.save();
                        // console.log('没有查询到对应openid，已插入用户信息,并签发token')
                        return res.json({
                            "status": "ok",
                            "token": token
                        })
                    }
                })
            }
        })
    }
}