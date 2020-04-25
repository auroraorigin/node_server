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
        var order = await Order.find({
            state: '交易成功'
        })
        var dataAxis = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < order.length; i++) {
            let month = Number(order[i].createDate.split('-')[1])
            data[month - 1] += Number(order[i].havedPaid)
        }
        var yMax = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] > yMax)
                yMax = data[i]

        }
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
                data: []
            },
            series: [{
                data: []
            }]
        }

        var order = await Order.find({
            state: '交易成功'
        })
        for (let i = 0; i < order.length; i++) {
            if(order[i].address.region_name.split('省')[0]=='广东')
            {
                let region = order[i].address.region_name.split('省')[1].split('市')[0]
                if(!poption.legend.data.includes(region))
                {
                    poption.legend.data.push(region)
                    poption.series[0].data.push({value:1,name:region})
                }
                else
                {
                    for (let j = 0; j < poption.series[0].data.length; j++) {
                        if(poption.series[0].data[j].name==region)
                        {
                            poption.series[0].data[j].value++
                            break;
                        }
                        
                    }
                }
            }
            else
            {
                if(!poption.legend.data.includes('省外'))
                {
                    poption.legend.data.push('省外')
                    poption.series[0].data.push({value:1,name:'省外'})
                }
                else
                {
                    for (let j = 0; j < poption.series[0].data.length; j++) {
                        if(poption.series[0].data[j].name=='省外')
                        {
                            poption.series[0].data[j].value++
                            break;
                        }
                        
                    }
                }
            }
        }

        res.sendResult(poption, 200, '获取成功')
    }
}