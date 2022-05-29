// lead into the create the token string's module
const jwt = require("jsonwebtoken")

//lead into the salary the token's package
const expressJWT = require("express-jwt")

// create the token Object.
const token = {}

const secretKey = 'ydqsecret_blog'

/** cretae a token 
 * firstly:define a string for the secret key to entryption token
 * after you define this secret key, you can call this API called sign() by jwt 
 * this API receive three parameter 1. you message 2. the secret key 3. configuration items for example time of useful
*/
token.createToken = (param) => {
    return jwt.sign(param,secretKey,{expiresIn:'1000d'})
}

/** salary a token
 *  firstly : the express-JWT is a third party of middleware ,so you need app.use() ,so we need create a object and return this object by this function
 *  the API called expressJWT({})
 *  the parameter :
 *      1. a object the aim is secret
 */
token.salaryToken = () => {
    return expressJWT({
        secret:secretKey,
        algorithms:['HS256']
    }).unless({path:[/^\/api\//]})  
}

// exports the token Object
module.exports = token



