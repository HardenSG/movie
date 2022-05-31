//发起支付的中间件
exports.pay = ( req , res , next ) => {
    req.message = {
        url:req.body.url,
        money:req.body.money,
        subject:req.body.subject,
        content:req.body.content,
        email:req.user.user_email,
        movieId:req.body.filmId
    }
    next( )
}

exports.searchOrder = ( req , res , next ) => {
    req.message = {
        email:req.user.user_email,
        orderId:req.body.orderId
    }
    next( )
}

exports.sendComment = ( req , res , next ) =>{
    req.message = {
        email : req.user.user_email ,
        content: req.body.content ,
        time: req.body.time ,
        filmId: req.body.filmId ,
        originId:req.body.originId
    }
    next( )
}

exports.err = ( err , req , res , next ) => {
    if( err ) res.send({
        code:500,
        msg:"服务器出现问题"
    })
}


