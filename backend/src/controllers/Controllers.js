require('dotenv').config();
const { User } = require('../app/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { secret } = require('../utils/secret.json');
const { HTTP_CREATED, HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_NOT_FOUND } = require('../utils/codesHttp');



function create_token(params) {
    return jwt.sign( { params },process.env.SECRET_ENV,{
        expiresIn:300
    });
 } 

class  controllersRouter{

     async store(req,res){
         const {name,email,password} = req.body;

         const hash = bcrypt.hashSync(password,10);

         const findEmail = await User.findOne({where:{
             email
         }});

         if(!findEmail){
          try{
          const users = await User.create({
              name,
              email,
              password:hash
          })
          .then(function(users){
            const id = users.id;
            
            const token =  create_token(id);


            return res.status(HTTP_CREATED).json({users,token});
          })
          .catch((err)=>{
              console.log(err);
              return  res.status(HTTP_BAD_REQUEST).json({message:"don't possible registrer user"});
          })
      
          
          }
          catch(err){
              console.log(err);
              return res.status(HTTP_BAD_REQUEST).json(err);
          }
        }
        else{
            return res.status(HTTP_BAD_REQUEST).json({message:"email already exist"});
        }
   
    }

    async load(req,res){
        try{
          const data = await User.findAll()
          .then(function(data){
              return res.status(HTTP_OK).json(data);
          })
          .catch((err)=>{
              return res.status(HTTP_INTERNAL_ERROR).json({message:"don't connect with database"});
          })
        }
        catch(err){
            return res.status(HTTP_INTERNAL_ERROR).json({message:"don't connect with database"})
        }
    }

    async loadOne(req,res){
       
        try{
          const data = await User.findByPk(req.params.id)
          
          if(data){
              return res.status(HTTP_OK).json(data);
          }
          else{
              return res.status(HTTP_NOT_FOUND).json({message:"user not found"});
          }
        
        }
        catch(err){
            return res.status(HTTP_INTERNAL_ERROR).json({message:"don't connect with database"})
        }
    }

    async update(req,res){
       
        try{
          const data = await User.findByPk(req.params.id)
          
          if(data){
              const {name,email,password} = req.body;
              const hash = bcrypt.hashSync(password,10);

              await data.update({
                  name,
                  email,
                  password:hash
              })
              .then(function(data){
                  return res.status(HTTP_OK).json(data);
              })
              .catch((err)=>{
                  return res.status(HTTP_BAD_REQUEST).json({message:"don't possible update datas"});
              })
          }
          else{
              return res.status(HTTP_NOT_FOUND).json({message:"user not found"});
          }
        
        }
        catch(err){
            return res.status(HTTP_INTERNAL_ERROR).json({message:"don't connect with database"})
        }
    }

    async destroy(req,res){
       
        try{
          const data = await User.findByPk(req.params.id)
          
          if(data){
            
              await data.destroy({where:{
                  id:data
              }})
              .then(function(data){
                  return res.status(HTTP_OK).json({message:"user deleted with sucess"});
              })
              .catch((err)=>{
                  return res.status(HTTP_BAD_REQUEST).json({message:"don't possible delete datas"});
              })
          }
          else{
              return res.status(HTTP_BAD_REQUEST).json({message:"user not found"});
          }
        
        }
        catch(err){
            return res.status(HTTP_INTERNAL_ERROR).json({message:"don't connect with database"})
        }
    }


}


module.exports = new controllersRouter();