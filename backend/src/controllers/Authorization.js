const jwt = require('jsonwebtoken');


class Authorization{


     authenticate(req,res,next){
        var token = req.headers['x-access-token'];
      
        if(!token)
          return res.status(500).json({auth: false,message: 'no token provide'});
       
        jwt.verify(token,process.env.SECRET_ENV,function(err,decoded){
        if(err)
           return res.status(500).json({auth: false,message: 'failed to authenticate token'});
         
        req.userId = decoded.id;
      
        next();
          
          })
      
       }

}

module.exports = new Authorization();