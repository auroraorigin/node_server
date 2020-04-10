// 引用expess框架
const express = require('express');
// 引入订单集合
const {
    Order
  } = require('../../model/wx/order');

module.exports = async (req, res) => {
    const {
        type
    } = req.params
    if (type == 'zhuzhuangtu') {
        var dataAxis = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149];
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
                data: ['省外', '茂名', '阳江', '珠海', '广州']
            },
            series: [{
                data: [{
                        value: 335,
                        name: '阳江'
                    },
                    {
                        value: 310,
                        name: '广州'
                    },
                    {
                        value: 234,
                        name: '珠海'
                    },
                    {
                        value: 135,
                        name: '省外'
                    },
                    {
                        value: 1548,
                        name: '茂名'
                    }
                ]
            }]
        }
        res.sendResult(poption, 200, '获取成功')
    }
}