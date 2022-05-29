const mysql = require( "mysql" )

const db = mysql.createPool({
    host:"nfq2hztm.hk2.wknwct.top",
    port:"38430",
    user:'blog',
    password:'7ZRs4bFitfDk6bMf',
    database:'blog'
})

module.exports = db