const db = require("./mysql")
 
exports.insert = ( str , callback ) => {
    return new Promise( (reslove,reject) => {
        db.query( str , (err,result) => {
            if ( err ) {
                console.log( err );
            }else{
                reslove( callback && callback( result ) )
            }
        })
    })
} 
exports.searchOrder = async ( email ) => {
    
    let str = ` SELECT status FROM movie_order where email = "${ email }" and status = "未支付"`

    return await this.insert( str ,( result ) =>{
        //存在未支付订单，所以返回1
        if( result.length == 0 ) {
            return 0
        }else{
            return 1
        }
    })
}

exports.searchSeat = async ( array ) => {
    const arr = JSON.parse( array )

    let b = []
    
    for (let index = 0; index < arr.length; index++) {
        b.push( arr[index] )
    }

    const params = b.join(",")

    let seat = `SELECT status from seat where seatId in (${ params })`

    return await this.insert( seat , ( result ) =>{

        const flag = result.filter( items => items.status == 2 )

        if( flag.length == 0){
            return 0
        }else{
            return 1
        }
            
    } )

}