const express = require( "express" )

//实例
const app = express( )

//配置跨域
const cors = require( "cors" )
app.use( cors( ) )

//配置token生成和解析中间件
const token = require("./createToken/token")
app.use(token.salaryToken())

//配置解析中间件
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//配置全局错误中间件
const err = require("./middleWare/middleware").err
app.use( err )

//路由模块
const router = require( "./router/router" )
app.use( router )

//启动服务器
app.listen( 8088 , ( ) =>{
    console.log("启动");
}) 