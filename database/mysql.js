//lead into the mysql 
const mysql = require( "mysql" )

//create the mysql connection pool
const db = mysql.createPool({
    // host:"192.168.31.131",
    host:"nfq2hztm.hk2.wknwct.top",
    port:"38430",
    user:'blog',
    password:'7ZRs4bFitfDk6bMf',
    database:'blog'
})

module.exports = db