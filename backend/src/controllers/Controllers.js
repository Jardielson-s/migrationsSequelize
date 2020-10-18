require('dotenv').config();
const { User , Document } = require('../app/models');
const bcrypt = require('bcrypt');
const CreateToken = require('./Jwt');
const { HTTP_CREATED, HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_NOT_FOUND } = require('../utils/codesHttp');

const { Op } = require('sequelize');



class  controllersRouter{

     async store(req,res){
         const {name,email,password,cpf,number_account,balence,location,phone} = req.body;

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
          .then(async function(users){


            const id = users.id;
            
            const token =  CreateToken.create_token(id);
            
            const documents = await Document.create({
                cpf,
                number_account,
                balence,
                location,
                phone
            })
            .then(async function(documents){
               
                await documents.setUser(users.id);

                return res.status(HTTP_CREATED).send({users,token,documents});
            })
            .catch((err)=>{
                res.status(HTTP_BAD_REQUEST).json({err});
            });
            

            
          })
          .catch((err)=>{
              console.log(err);
              return  res.status(HTTP_BAD_REQUEST).json({message:"don't possible registrer user"+err});
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
          const data = await User.findAll({
              include:[{
                  model: Document,
                  as: 'Document',
                  through:{attributes: []},

              }]
          })
          .then(function(data){
              return res.status(HTTP_OK).json(data);
          })
          .catch((err)=>{
              console.log(err);
              return res.status(HTTP_INTERNAL_ERROR).json({message:"error to load users"});
          })
        }
        catch(err){
            console.log(err);
            return res.status(HTTP_INTERNAL_ERROR).json({message:"don't connect with database"})
        }
    }

    async loadOne(req,res){
       
        try{
          const data = await User.findByPk(req.params.id,{
              include:[{
                  model: Document,
                  as: 'Document',
                  through: {attributes:[]},
              }]
          })
          
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
          const data = await User.findByPk(req.params.id);

          const { cpf,number_account,balance,location,phone} = req.body;
          console.log(cpf,number_account,balance,location,phone);
          
          if(data){
              const {name,email,password} = req.body;
              const hash = bcrypt.hashSync(password,10);

              await data.update({
                  name,
                  email,
                  password:hash
              })
              .then(async function(data){
                  const {id} = data;
                
                  const document = await Document.findByPk(id);

                  await document.update({
                      cpf,
                      number_account,
                      balance,
                      location,
                      phone
                  })
                  .catch((err)=>{
                      res.status(HTTP_BAD_REQUEST).send({err});
                  });
                  const datas = await User.findByPk(req.params.id,{include:['Document']});
                  return res.status(HTTP_OK).json(datas);
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
                  
                  Document.destroy({where:{
                      id: data.id
                  }})
                  .catch((err)=> {
                      res.status(HTTP_NOT_FOUND).json({err});
                  })
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
      const foundName = await User.findAll({include:['Document']},{where:{
          [Op.or]:[{ name }]
      }})
      .then(function(foundName){
         if(!foundName)
            return res.status(HTTP_BAD_REQUEST).json({message:'user not found'});
        
         return res.status(HTTP_CREATED).json(foundName);
      })
      .catch((err)=>{
          return res.status(HTTP_BAD_REQUEST).json(err);
      })
    }
    catch(err){
        console.log(err);
        return res.status(HTTP_INTERNAL_ERROR).json({message:"don'n connect with database"});
    }
   }

}


module.exports = new controllersRouter();