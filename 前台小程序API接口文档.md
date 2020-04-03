# 1. 前台小程序 API 接口文档

## 1.1. API V1 接口说明

- 后台管理系统接口基准地址：`http://127.0.0.1:8888/wx/`
- 服务端已开启 CORS 跨域支持
- API V1 认证统一使用 Token 认证
- 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
- 使用 HTTP Status Code 标识状态
- 数据返回格式统一使用 JSON

### 1.1.1. 支持的请求方法

- GET（SELECT）：从服务器取出资源（一项或多项）。
- POST（CREATE）：在服务器新建一个资源。
- PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
- DELETE（DELETE）：从服务器删除资源。
- HEAD：获取资源的元数据。
- OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。

### 1.1.2. 通用返回状态说明

| _状态码_ | _含义_                | _说明_                                              |
| -------- | --------------------- | --------------------------------------------------- |
| 200      | OK                    | 请求成功                                            |
| 201      | CREATED               | 创建成功                                            |
| 204      | DELETED               | 删除成功                                            |
| 400      | BAD REQUEST           | 请求的地址不存在或者包含不支持的参数                |
| 401      | UNAUTHORIZED          | 未授权                                              |
| 403      | FORBIDDEN             | 被禁止访问                                          |
| 404      | NOT FOUND             | 请求的资源不存在                                    |
| 422      | Unprocesable entity   | [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误 |
| 500      | INTERNAL SERVER ERROR | 内部错误                                            |
|          |                       |                                                     |

---

## 1.2. 登录

### 1.2.1. 登录验证接口

- 请求路径：checkUser
- 请求方法：post
- 请求参数

| 参数名 | 参数说明                                       | 备注     |
| ------ | ---------------------------------------------- | -------- |
| code   | wx.login()获得，用于换取 openid 和 session_key | 不能为空 |

- 响应参数

| 参数名 | 参数说明 | 备注            |
| ------ | -------- | --------------- |
| token  | 令牌     | 基于 jwt 的令牌 |

- 响应数据

```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiMDMzOVhvS3ExY1hWd2kwb1p5S3ExNVVDS3ExOVhvSzEiLCJvcGVuaWQiOiJvdlVyXzQ2YmFwSnBiZmgybUtfQzVGTkxUOE9ZIiwic2Vzc2lvbl9rZXkiOiJNOXZVQWhueE9nWEVuc3lzMUF6ZkpnPT0iLCJpYXQiOjE1ODQ5MzU1NzgsImV4cCI6MTU4NDkzOTE3OH0.-pDtC5BpW_xILEHAJ-corbueT7kkvNvyOMOyeR5TAok"
```

- 返回状态

```
200
```

## 1.3. 用户管理

### 1.3.1. 加载用户个人信息

- 请求路径：getUserMessage
- 请求方法：get
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |

- 响应参数

| 参数名        | 参数说明     | 备注 |
| ------------- | ------------ | ---- |
| name          | 用户姓名     |      |
| mobile        | 用户电话     |      |
| sex           | 用户性别     |      |
| birthday      | 用户生日     |      |
| region        | 用户所在地区 |      |
| wxNumber      | 用户微信号   |      |
| detailAddress | 用户详细地址 |      |

- 响应数据

```json
{
  "message": [
    {
      "_id": "5e77220c7ec7bf1cb4af8904",
      "openid": "ovUr_46bapJpbfh2mK_C5FNLT8OY",
      "__v": 0,
      "birthday": "2017-01-23",
      "detailAddress": "广东省广州市广州大学",
      "mobile": "15920186893",
      "name": "user",
      "region": "天津市 天津市 河东区",
      "sex": "女",
      "wxNumber": "lin1808522274"
    }
  ]
}
```

- 返回状态

```
 200
```

### 1.3.2. 更新用户个人信息

- 请求路径：userMessageUpdata
- 请求方法：put
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |

- 响应参数

  无

- 响应数据

  无

- 返回状态

```
 200
```

### 1.3.3. 加载用户地址列表

- 请求路径：getAddressList
- 请求方法：get
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |

- 响应参数

| 参数名         | 参数说明 | 备注 |
| -------------- | -------- | ---- |
| addressList    | 地址列表 |      |
| defaultAddress | 默认地址 |      |

- 响应数据

```json
{
  "addressList": [
    {
      "consignee": "李四",
      "mobile": "15920186893",
      "region_name": "北京市北京市东城区",
      "detail_address": "广州大学是灿灿创蓝筹",
      "isActive": true
    },
    {
      "consignee": "张三",
      "detail_address": "新港中路397号",
      "mobile": "020-81167888",
      "region_name": "广东省广州市海珠区"
    }
  ],
  "defaultAddress": {
    "consignee": "李四",
    "mobile": "15920186893",
    "region_name": "北京市北京市东城区",
    "detail_address": "广州大学是灿灿创蓝筹",
    "isActive": true
  }
}
```

- 返回状态

```
 200
```

### 1.3.4. 更新地址列表

- 请求路径：saveAddressList
- 请求方法：put
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |

- 响应参数

  无

- 响应数据

  无

- 返回状态

```
 200
```

### 1.3.5. 获取默认地址

- 请求路径：getDefaultAddress
- 请求方法：get
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |

- 响应参数

| 参数名          | 参数说明             | 备注 |
| --------------- | -------------------- | ---- |
| consignee       | 收货人               |      |
| mobile          | 收货人电话           |      |
| region_name     | 地区                 |      |
| detaile_address | 详细地址             |      |
| isActive        | 为 true 时为默认地址 |      |

- 响应数据

```json
  defaultAddress: {
    "consignee": "李四",
    "mobile": "15920186893",
    "region_name": "北京市北京市东城区",
    "detail_address": "广州大学是灿灿创蓝筹",
    "isActive": true
  },
```

- 返回状态

```
 200
```

### 1.3.6. 加载已拥有优惠卷列表

- 请求路径：getCouponList
- 请求方法：post
- 请求参数

| 参数名        | 参数说明                     | 备注     |
| ------------- | ---------------------------- | -------- |
| Authorization | token 令牌                   | 不能为空 |
| tabIndex      | 优惠卷状态（即可用与不可用） | 不能为空 |

- 响应参数

| 参数名    | 参数说明                   | 备注 |
| --------- | -------------------------- | ---- |
| money     | 满足要求的价格，减免的价格 |      |
| effective | 开始日期与截至日期         |      |
| state     | 优惠卷状态                 |      |
| name      | 优惠卷名称                 |      |

- 响应数据

```json
coupon:{
  "money":[
    "100",
    "10"
  ],
  "effective":[
  "2020.1.1",
  "2020.3.3"
  ],
  "state":"可用",
  "name":"海鲜商城"
}
```
- 返回状态

```
 200
```

## 1.4. 订单管理

### 1.4.1. 创建订单

- 请求路径：createOrder
- 请求方法：post
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |
| address       | 收货地址   | 不能为空 |
| state         | 订单状态   | 不能为空 |
| goods         | 商品       | 不能为空 |
| totalPrice    | 总价格     | 不能为空 |
| datetimeTo    | 未支付订单关闭时间    | 可以为空 |

- 响应参数

  无

- 响应数据

  无

- 返回状态

```
 200
```

### 1.4.2. 加载订单列表

- 请求路径：getOrder
- 请求方法：post
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |
| state         | 订单状态   | 不能为空 |

- 响应参数

| 参数名     | 参数说明 | 备注 |
| ---------- | -------- | ---- |
| goods      | 商品     |      |
| state      | 订单状态 |      |
| totalPrice | 总价格   |      |
| freight    | 运费     |      |
| \_id       | 订单 id  |      |

- 响应数据

```json
[
  {
    "goods": [[Object], [Object]],
    "_id": "5e79d96e5b8bf03444ff53ee",
    "state": "待发货",
    "totalPrice": 1050,
    "freight": 20
  },
  {
    "goods": [[Object]],
    "_id": "5e79ebe2d535c6051028e0c9",
    "state": "待付款",
    "totalPrice": 100,
    "freight": 20
  },
  {
    "goods": [[Object]],
    "_id": "5e79ec00d535c6051028e0ca",
    "state": "退款",
    "totalPrice": 100,
    "freight": 20
  },
  {
    "goods": [[Object], [Object]],
    "_id": "5e79ec51d535c6051028e0cc",
    "state": "待收货",
    "totalPrice": 850,
    "freight": 20
  },
  {
    "goods": [[Object], [Object], [Object]],
    "_id": "5e7b2ffcadb7432a64f88f5e",
    "state": "待收货",
    "totalPrice": 3950,
    "freight": 20
  }
]
```

- 返回状态

```
 200
```

### 1.4.3. 加载订单详情

- 请求路径：getOrderDetail
- 请求方法：post
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |
| \_id          | 订单状态   | 不能为空 |

- 响应参数

| 参数名     | 参数说明 | 备注 |
| ---------- | -------- | ---- |
| goods      | 商品     |      |
| state      | 订单状态 |      |
| totalPrice | 总价格   |      |
| freight    | 运费     |      |
| address    | 收货地址 |      |
| datetimeTo    | 订单关闭时间 |    可以返回空  |

- 响应数据

```json
  {
  "address": {
    "consignee": "李四",
    "mobile": "15920186893",
    "region_name": "北京市北京市东城区",
    "detail_address": "广州大学是灿灿创蓝筹",
    "isActive": true
  },
  "goods":
  [
   {
     "name":"商品名称",
     "src":"../../images/homePage/floor.jpg",
     "specifiation":"三斤",
     "buyNumber":3,
     "message":"三天无理由退款",
     "unitPrice":"200.00",
     "goodPrice":600
   },
  {
    "name":"商品名称",
    "src":"../../images/detail/3.jpg",
    "specifiation":"两斤",
    "buyNumber":3,
    "message":"三天无理由退款",
    "unitPrice":"150.00",
    "goodPrice":450
   }
  ],
  "state": "待发货",
  "totalPrice": 1050,
  "freight": 20
  },
```

- 返回状态

```
 200
```

### 1.4.4. 删除订单

- 请求路径：deleteOrder
- 请求方法：post
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |
| \_id          | 订单状态   | 不能为空 |

- 响应参数

  无

- 响应数据

  无

- 返回状态

```
 200
```

## 1.5. 优惠卷管理

### 1.5.1. 加载优惠卷中心列表
- 请求路径：getCouponCenter
- 请求方法：get
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |

- 响应参数

| 参数名     | 参数说明 | 备注 |
| ---------- | -------- | ---- |
| money     | 满足要求的价格，减免的价格     |      |
| effective      | 开始日期，截至日期 |      |
| name | 优惠卷名称  |      |
| number    | 优惠卷余量     |      |
| isActive    | 该用户是否已领此优惠卷的标记 |      |

- 响应数据

```json
couponList:[
  {
    "money": "[ '100', '10' ]",
    "effective": "[ '2020.1.1', '2020.3.3' ]",
    "name": "海鲜商城",
    "number": "80",
    "isActive": "true"
  },
]
```

- 返回状态

```
 200
```

### 1.5.2. 领取优惠卷
- 请求路径：getCoupon
- 请求方法：post
- 请求参数

| 参数名        | 参数说明   | 备注     |
| ------------- | ---------- | -------- |
| Authorization | token 令牌 | 不能为空 |
| id | 优惠卷id | 不能为空 |
| number | 优惠卷余量 | 不能为空 |

- 响应参数

无

- 返回状态

```
200
```