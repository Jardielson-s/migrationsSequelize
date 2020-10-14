const jwt = require('jsonwebtoken');

class CreateToken{

create_token(params) {
    return jwt.sign( { params },process.env.SECRET_ENV,{
        expiresIn:86500
    });
 } 

}

module.exports = new CreateToken();