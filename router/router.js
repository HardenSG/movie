const express = require( "express" )

const router = express.Router( )

const callback = require("../routerCallback/callback")

const middleware = require("../middleWare/middleware")

//支付接口
router.post( "/pay", middleware.pay , callback.pay)

//支付结束响应接口
router.post("/api/pay",callback.payAsync)

//选票界面获取接口
router.get("/api/getSeat",callback.getSeat)

//获取电影的列表
router.get("/api/getMovie",callback.getMovie)

//按名字搜索
router.get("/api/searchMovie",callback.searchMovie)

//详细页面依靠id进行搜索
router.get("/api/getMovieDetail",callback.getMovieDetail)

//查找用户的订单
router.get("/getOrder",callback.getOrder)

//榜单
router.get("/api/getTop",callback.getTop)

//取消订单
router.post("/api/cancelOrder",callback.cancelOrder)

// 支付成功显示支付信息
router.post("/searchOrder", middleware.searchOrder, callback.searchOrder)




router.get("/api/birth",callback.birth)

//暴露
module.exports = router