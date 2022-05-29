//发起支付的中间件
exports.pay = ( req , res , next ) => {
    req.message = {
        url:req.body.url,
        money:req.body.money,
        subject:req.body.subject,
        content:req.body.content,
        email:req.user.user_email,
        seatId:req.body.seatId,
        movieId:req.body.filmId
    }
    next( )
}

exports.err = ( err , req , res , next ) => {
    if( err ) res.send({
        code:500,
        msg:"服务器出现问题"
    })
}

