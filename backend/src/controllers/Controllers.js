require('dotenv').config();
const { User , People } = require('../app/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { secret } = require('../utils/secret.json');
const { HTTP_CREATED, HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_NOT_FOUND } = require('../utils/codesHttp');

const { Op } = require('sequelize');

function create_token(params) {
    return jwt.sign( { params },process.env.SECRET_ENV,{
        expiresIn:300
    });
 } 

 function authenticate(req,res,next){
  
    console.log("middleware");

    next();
 }

class  controllersRouter{

     async store(req,res){
         const {name,email,password } = req.body;

         const hash = bcrypt.hashSync(password,10);

         const findEmail = await User.findOne({where:{
             email
         }});

         if(!findEmail){
          try{
          const users = await User.create({
              name,
              email,
              password:hash,           
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

    async storePeople(req,res){
        const { cpf,number_account,balence,location,phone} = req.body;
        
        const peoples = await People.create({
            cpf,
            number_account,
            balence,
            location,
            phone
        })
        .then(function(peoples){
            
          return res.status(HTTP_CREATED).json(peoples);

        })
        .catch((err)=>{
            console.log(err);
            return res.status(HTTP_BAD_REQUEST).json({message:"don't possible create People" });
        })
         

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

   async sarch(req,res){
      const { name } = req.query;
      
    try{
      const foundName = await User.findAll({where:{
          [Op.or]:[{ name }]
      }})
      .then(function(foundName){
         if(!foundName)
            return res.status(HTTP_BAD_REQUEST).json({message:'user not found'});
        
         return res.status(HTTP_CREATED).json(foundName);
      })
      .catch((err)=>{
          return res.status(HTTP_BAD_REQUEST).json();
      })
    }
    catch(err){
        console.log(err);
        return res.status(HTTP_INTERNAL_ERROR).json({message:"don'n connect with database"});
    }
   }

}


module.exports = new controllersRouter();