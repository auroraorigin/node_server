// 引用expess框架
const express = require('express');

module.exports = async (req, res) => {
    const {
        type
    } = req.params
    if (type == 'zhuzhuangtu') {
        var dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
        var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
        var yMax = 500;
        var dataShadow = [];

        for (var i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }

        var option = {
            xAxis: {
                data: dataAxis
            },
            series: [{
                data: dataShadow
            }, {
                data
            }]
        }

        res.sendResult(option, 200, '获取成功')
    } else if (type == 'bingzhuangtu') {
        var poption = {
            legend: {
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [{
                data: [{
                        value: 335,
                        name: '直接访问'
                    },
                    {
                        value: 310,
                        name: '邮件营销'
                    },
                    {
                        value: 234,
                        name: '联盟广告'
                    },
                    {
                        value: 135,
                        name: '视频广告'
                    },
                    {
                        value: 1548,
                        name: '搜索引擎'
                    }
                ]
            }]
        }
        res.sendResult(poption, 200, '获取成功')
    }
}