const db = require( "../database/query" )

const alipay = require("../pay/pay")

/**发起请求的接口函数
 * @param { url , money , subject , content } req 请求体内容 
 * @param {*} res 
 */
exports.pay = async ( req ,  res ) => {
    
    //解构出变量
 const { url , money , subject , content  , email , movieId } = req.message

 //查询此人是否还有其他未支付的订单
 const orderFlag = await db.searchOrder( email )

 //订单存在，返回数据库的订单url
 if( orderFlag == 1 ) {
     res.send({
         status: 300,
         msg: "你有未支付的订单"     
     })

     //退出
     return
 }

 const seat = await db.searchSeat( content )

 //查询所选座椅是否有被选的情况
 if( seat == 1 ){
     res.send({
         status: 301,
         msg: "座位已被选中"     
     })
     return 
 }

 let strCount = ` SELECT COUNT(*) as num FROM movie_order `

 const orderId = await db.insert( strCount , ( result ) => {
     return ++result[0].num
 } )
 
 let addHots = `UPDATE filmManage SET hots = hots + 1 WHERE movieId = ${ movieId }`

 db.insert( addHots ,( result ) =>{
     // console.log(result);
 })

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
 let str = `INSERT INTO movie_order ( orderId, content, subject,url,status,email,filmId) VALUES( "${order.orderId }",'${ order.content }',"${ order.subject }","${ order.url }" ,"${ order.status }","${ order.email }",${ movieId } )`

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
* @param { 状态码 , 订单号 } req 
* @param {*} res 
*/
exports.payAsync = ( req , res ) => {
 

 const { trade_status , out_trade_no, body} = req.body

 if( trade_status == 'TRADE_SUCCESS' ){

    let time = new Date( ).toLocaleDateString() +"-"+ new Date( ).toLocaleTimeString()

     let str = ` UPDATE movie_order SET status = "已支付" , orderTime = "${ time }" WHERE orderId = "${ out_trade_no }"`
      
     const arr = JSON.parse( body )
     
     let b = []
 
     for (let index = 0; index < arr.length; index++) {
         b.push( arr[index] )
     }
 
     const params = b.join(",")
 
     let lockSeat = `UPDATE seat SET status = 2 WHERE status != 0 and seatId IN (${ params })`
 
     db.insert( lockSeat , ( result ) => {
         console.log(result)
     })
   

     db.insert( str , ( result ) =>{
         console.log(result);
     } )

 }

}

/**
 * 获取座位
 * @param { agencyId } req 
 * @param { status , arr , row } res 
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
 * 获取排期表电影的数据
 * @param { index } req   limit 索引 
 * @param {*} res 
 */
exports.getMovie = async ( req , res ) => {

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

    let str = ` SELECT * FROM john_movie WHERE name LIKE "%${ movie }%" LIMIT 0 , 10`
    
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
 * @param { id } req 
 * @param { status  , arr } res 
 */
exports.getMovieDetail = ( req , res ) => {
    
    const { id } = req.query

    let str = `SELECT * FROM ( SELECT * FROM filmManage WHERE movieId = ${ id }) f INNER JOIN john_movie movie ON f.movieId = movie.id `

    db.insert( str ,( result ) =>{
        res.send({
            status:200,
            arr:result[0]
        })
    })

}

/**
 * 获取订单接口
 * @param { 请求体获取email } req 
 * @param { status , 对象数组 } res 
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

/**
 * 获取前十榜单
 * @param {*} req 
 * @param { status , 对象数组 } res 
 */
exports.getTop = ( req , res ) => {

    let str = ` SELECT f.*,movie.name , movie.img , movie.time as movieTime from ( SELECT * FROM filmManage order BY hots DESC LIMIT 0 ,10 ) f INNER JOIN john_movie movie ON f.movieId = movie.id `

    db.insert( str ,( result ) =>{

        res.send({
            status:200,
            arr:result
        })
    })

}

/**
 * 取消订单接口
 * @param { url ： 订单的url } req 
 * @param { status , msg } res 
 */
exports.cancelOrder = ( req , res ) =>{

    const { url } = req.body

    let str = ` UPDATE movie_order SET status = "已取消" WHERE url = "${ url }" `

    db.insert( str , ( result ) =>{
        if( result.changedRows ){
            res.send({
                status:200,
                msg:"取消成功"
            })
        }
    } )

}

/**
 * 查询订单是否已被支付并返回信息
 * @param { email , orderId } req 
 * @param { status , 订单信息 } res 
 */
exports.searchOrder = ( req , res ) =>{

    const { email , orderId } = req.message

    let str = `SELECT * from (SELECT * from movie_order WHERE orderId = ${ orderId }) order1 INNER JOIN filmManage f ON order1.filmId = f.movieId`
    
    db.insert( str , ( result ) =>{
        if( result[0].email  == email){
            res.send({
                status:200,
                arr:result[0]
            })
        }else{
            res.send({
                status:403,
                msg:"伪造了订单信息"
            })
        }
    })
}

/**
 * 获取评论接口
 * @param { filmId } req 
 * @param { status , 评论的对象数组 } res 
 */
exports.getComment = async ( req , res ) =>{

    // 解构出filmId
    const { filmId } = req.query

    let str = ` SELECT * from (SELECT * from comments WHERE filmId = ${ filmId } AND orignId = -1) c INNER JOIN users u ON c.email = u.user_email ORDER BY commentId DESC `

    const orign = await db.insert( str , ( result ) =>{
        return result
    })

    let ChildStr

    // await orign.map( async ( e , i ) =>{
    //     //取出当前的commentId

    //     ChildStr = ` SELECT * FROM comments WHERE filmId = ${ filmId } and orignId = ${ e.commentId }`

    //     e.childComment = await db.insert( ChildStr , result  =>{
    //         return result
    //     })

    //     console.log(e === orign[i]);

    // })

    // const MAP = async ( e ) =>{

    //         ChildStr = ` SELECT * FROM comments WHERE filmId = ${ filmId } and orignId = ${ e.commentId }`
    
    //         e.childComment = await db.insert( ChildStr , result  =>{
    //             return result
    //         })

    //         console.log(e.childComment);
    
    //         console.log("e === orign[i]");
        
    // }

    // orign.map( item =>{
    //      MAP( item )
    // })

    // console.log("orign");

    //性能低，要重构
    for (let i = 0; i < orign.length; i++ ) {

        ChildStr = ` SELECT * from (SELECT * from comments WHERE filmId = ${ filmId } AND orignId  = ${ orign[i].commentId } ) c INNER JOIN users u ON c.email = u.user_email`
        
        orign[i].childComment = await db.insert( ChildStr , result  =>{
            return result
        })

    }

    res.send({
        status:200,
        arr:orign
    })

}

/**
 * 发送评论
 * @param { email , content ,  time , filmId , originId } req 
 * @param { status , msg } res 
 */
exports.sendComment = async ( req , res ) =>{

    //解构出值
    const { email , content ,  time , filmId , originId } = req.message

    let count = `SELECT commentId as num FROM comments ORDER BY commentId DESC`

    const num = await db.insert( count ,result =>{
        return ++result[0].num
    })
    
    let str = ` INSERT INTO comments VALUES ( ${ filmId } , "${ email }" , "${ time }","${ content }",${ originId },${ num })` 
    
    db.insert( str ,result =>{
        if( result.affectedRows ){
            res.send({
                status:200,
                msg:"发布成功!"
            })
        }
    })

}

/**
 * 删除评论的接口
 * @param { 评论的id } req 
 * @param { status,msg } res 
 */
exports.dropComment = ( req, res ) =>{

    const { id } = req.body

    let str = `DELETE FROM comments WHERE commentId = ${ id }`

    db.insert( str , result =>{
        console.log(result);
        res.send({
            status:200,
            msg:"删除成功"
        })
    })
}



exports.birth = ( req , res ) => {
    // let str ;
    // let j = 1
    // for( let i = 901 ; i < 1001 ; i++ ){
    //     str = ` insert into seat values( ${ i } , 1 , 10, "${j}排${ i % 10 == 0 ? 10 : i % 10 }列" ) `
    //     db.insert( str ,( result ) =>{
    //         console.log(result);
    //     })
    //     if ( i % 10 == 0) {
    //         j++
    //     }
    // }
    res.send({
        time: new Date( ).toLocaleDateString() +"-"+ new Date( ).toLocaleTimeString()
    })
}












