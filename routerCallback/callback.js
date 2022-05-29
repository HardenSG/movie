const db = require( "../database/query" )

const alipay = require("../pay/pay")

/**发起请求的接口函数
 * @param { url , money , subject , content } req 请求体内容 
 * @param {*} res 
 */
exports.pay = async ( req ,  res ) => {

    //解构出变量
    const { url , money , subject , content  , email , seatId , orderId } = req.message
    
    //查询出该订单是否存在
    const orderFlag = await db.searchOrder( orderId )

    //订单存在，返回数据库的订单url
    if( orderFlag != 1 ) {
        res.send({
            status: 200,
            msg: "支付发起",        
            url:JSON.stringify( orderFlag )
        })

        //退出
        return
    }

    // let strCount = ` SELECT COUNT(*) FROM movie_order `

    // const orderId = await db.insert( strCount , ( result ) => {
    //     return result[0]
    // } )

    //订单不存在，创建支付请求，返回url
    const result = await alipay.exec( url , money , subject , content ,orderId)

    //订单不存在，创建订单对象并存入数据库
    const order = {
        subject ,
        content ,
        email , 
        status:"未支付",
        url: result,
        orderId
    }

    //插入数据字符串
    let str = `INSERT INTO movie_order ( orderId, content, subject,url,status,email) VALUES( "${order.orderId }",'${ order.content }',"${ order.subject }","${ order.url }" ,"${ order.status }","${ order.email }" )`

    //操作数据库
    db.insert( str , ( resu ) => {
        if( resu ) {
            //将返回的url，作为值进行返回
            res.send({
                status: 200,
                msg: "支付发起",
                url:JSON.stringify( result )
            })
        }else{
            res.send({
                status:500,
                msg:"订单号已存在"
            })
        }
    } )
    
}

/**
 * 接受支付宝返回内容并进行数据的操作
 * @param { 状态码 ， 订单号 } req 
 * @param {*} res 
 */
exports.payAsync = ( req , res ) => {

    console.log(req.body);

    const { trade_status , out_trade_no , body} = req.body

    if( trade_status == 'TRADE_SUCCESS' ){

        let str = ` UPDATE movie_order SET status = "已支付" WHERE orderId = ${ out_trade_no }`

        const arr  = JSON.parse( body )

        db.insert( str , ( result ) =>{
            console.log(result);
        } )

    }

}

/**
 * 
 * @param {  } req 
 * @param {*} res 
 */
exports.getSeat = async ( req , res ) => {

    const { agencyId } = req.query

    let rowStr = ` SELECT row FROM  agency WHERE id = ${ agencyId } `

    const row = await db.insert( rowStr ,( result ) => {
        return result[0]
    })

    let str = `SELECT * FROM seat WHERE agencyId = ${ agencyId } GROUP BY seatId`

    db.insert( str , ( result ) => {
        res.send({
            status:200,
            arr:result,
            colomn:row
        })
    })
}

/**
 * 获取数据库电影的数据
 * @param { index } req   limit 索引 
 * @param {*} res 
 */
exports.getMovie = async ( req , res ) => {

    const { index } = req.query

    // let str = ` SELECT * FROM john_movie LIMIT ${ index } , 20`
    let str = ` SELECT * FROM filmManage f INNER JOIN john_movie movie ON f.movieId = movie.id `

    await db.insert( str , ( result ) => {
        res.send({
            resu:result
        })
    } )
}

/**
 * 获取模糊搜索的电影
 * @param { movie } req 模糊搜索字段
 * @param {*} res 
 */
exports.searchMovie = async ( req , res ) => {

    //解构出变量
    const { movie } = req.query

    let str = ` SELECT * FROM john_movie WHERE name LIKE "%${ movie }%" `
    
    await db.insert( str , ( result ) =>{
        if( result ) {
            res.send({
                status:200,
                result
            })
        }else{
            res.send({
                status:500,
                result:[ ]
            })
        }
    })
}

/**
 * 获取详细电影信息
 * @param {*} req 
 * @param {*} res 
 */
exports.getMovieDetail = ( req , res ) => {
    
    const { id } = req.query

    let addHots = `UPDATE filmManage SET hots = 2 WHERE movieId = ${ id }`

    db.insert( addHots ,( result ) =>{
        console.log(result);
    })

    let str = `SELECT * FROM (SELECT * FROM filmManage WHERE movieId = ${ id }) f INNER JOIN john_movie movie ON f.movieId = movie.id `

    db.insert( str ,( result ) =>{
        res.send({
            status:200,
            arr:result[0]
        })
    })

}

/**
 * 订单接口
 * @param {*} req 
 * @param {*} res 
 */
exports.getOrder = ( req , res ) => {

    //从token中取出email
    const { user_email } = req.user

    let str = ` SELECT * FROM movie_order WHERE  email = "${ user_email }" `

    db.insert( str ,( result ) =>{
        res.send({
            status:200,
            arr:result
        })
    })

}

exports.birth = ( req , res ) => {
    let str ;
    let j = 1
    for( let i = 101 ; i < 201 ; i++ ){
        str = ` insert into seat values( ${ i } , 1 , 2 , "${j}排${ i % 10 == 0 ? 10 : i % 10 }列" ) `
        db.insert( str ,( result ) =>{
            console.log(result);
        })
        if ( i % 10 == 0) {
            j++
        }
    }
}












