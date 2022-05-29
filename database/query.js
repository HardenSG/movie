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
exports.searchOrder = async ( orderId ) => {
    
    let str = ` SELECT * FROM movie_order where orderId = "${ orderId }"`

    return await this.insert( str ,( result ) =>{
        if( !result.length ) {
            return 1
        }else{
            return result[0].url
        }
    })
}