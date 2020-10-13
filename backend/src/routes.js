require('dotenv').config();
const { Router } = require('express');
const controller = require('./controllers/Controllers');
const jwt = require('jsonwebtoken');
const routes = Router();

function authenticate(req,res,next){
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

routes.post("/create",controller.store);
routes.get("/loadAll",authenticate,authenticate,controller.load);
routes.get("/loadOne/:id",authenticate,controller.loadOne);
routes.post("/update/:id",authenticate,controller.update);
routes.get("/destroy/:id",authenticate,controller.destroy);
routes.get("/sarch",authenticate,controller.sarch);
routes.post("/createPeople",controller.storePeople);


module.exports = routes;