require('dotenv').config();
const { User , Document } = require('../app/models');
const bcrypt = require('bcrypt');
const CreateToken = require('./Jwt');
const { HTTP_CREATED, HTTP_BAD_REQUEST, HTTP_OK, HTTP_INTERNAL_ERROR, HTTP_NOT_FOUND } = require('../utils/codesHttp');

const { Op } = require('sequelize');



class  controllersRouter{

     async store(req,res){
         const {name,email,password,cpf,number_account,balance,location,phone} = req.body;

         const hash = bcrypt.hashSync(password,10);

         const findEmail = await User.findOne({where:{
             email
         }});
         
         const findCpf = await Document.findOne({where:{
             cpf
         }});

         const findAccount = await Document.findOne({where:{
             number_account
         }});

         if(!findEmail){
          if(!findCpf){
           if(!findAccount){
             try{
                const users = await User.create({
                          name,
                          email,
                          password:hash,           
                    })
                     .then(users => {


                         const id = users.id;
            
                         const token =  CreateToken.create_token(id);
            
                        const documents =  Document.create({
                               cpf,
                               number_account,
                               balance,
                               location,
                               phone
                     })
                     .then(async function(documents){
               
                        await documents.setUser(users.id);

                        return res.status(HTTP_CREATED).send({users,token,documents});
                     })
                    .catch((err)=>{
                        return  res.status(HTTP_BAD_REQUEST).json({err});
                    });  
                   })
                   .catch((err)=>{
                     return  res.status(HTTP_BAD_REQUEST).json({message:"don't possible registrer user"+err});
                   });
                   }
                   catch(err){              
                         return res.status(HTTP_BAD_REQUEST).json(err);
                    }
                   }
               else{
                    return res.status(HTTP_BAD_REQUEST).json({message:"account already exist"});
                   }
               }
               else{
                    return res.status(HTTP_BAD_REQUEST).json({message:"cpf already exist"});
               }
              }
                else{
                    return res.status(HTTP_BAD_REQUEST).json({message:"email already exist"});
              }
   
    }

    async login(req,res){
  
         const {email,password} = req.body;
         const hash  = bcrypt.hashSync(password,10);
         

         const findEmail = await User.findOne({where:{email},include:'Document'});
         
        
        
         if(!findEmail.email)
           return res.status(HTTP_NOT_FOUND).json({message:"email invalid"});
        
        
        
        const passCompare = bcrypt.compareSync(password,findEmail.password);
        
        if(passCompare === false)
         return res.status(HTTP_NOT_FOUND).json({message:"password invalid"});
        



        const token = CreateToken.create_token(findEmail.id);
        return res.status(HTTP_OK).json({findEmail,token});

    }


        async load(req,res){
        try{
          const data =  User.findAll({
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

          const {name,email,password} = req.body;

          const { cpf,number_account,balance,location,phone} = req.body;

          const findEmail = await User.findOne({where:{
            email
           }});

           const findAccount = await Document.findOne({where:{
                      number_account
           }});

           const findCpf = await Document.findOne({where:{
                cpf
           }});
           //return console.log(data.email,findEmail.email);

           //if(findEmail.email == data.email)
           //     return;// console.log(data.email,findEmail.email);

           if(findEmail)
           {
              if(findEmail.email == data.email)
              {
                 
              }
              else 
              {
                  return res.status(HTTP_BAD_REQUEST).json({message:"email already exixts"});
              }
           }

           if(findAccount)
              return res.status(HTTP_BAD_REQUEST).json({message:"account already exists"});
            
           if(findCpf)
              return res.status(HTTP_BAD_REQUEST).json({message:"cpf already exists"});
            
          
               if(data){
                            
                       const hash = bcrypt.hashSync(password,10);         
                       data.update({      
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
               console.log(err);
               return res.status(HTTP_INTERNAL_ERROR).json({message:"don't connect with database"})
           }
    }

    async destroy(req,res){
       
        try{
          const data = await User.findByPk(req.params.id)
          
          if(data){
            
              data.destroy({where:{
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
      const foundName = User.findAll({include:['Document']},{where:{
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

   async tranfer(req,res){
    
      const id = req.params.id;
      const  { valueTransfer,number_account }  = req.body;
      const data = await Document.findByPk(id)
      
      if(data)
       {
        if(valueTransfer == 0)
           return res.status(HTTP_BAD_REQUEST).json({message:"don't possible do tranference of 0"});
          
           const dataToReceve = await Document.findOne({where:{
              number_account
          }});
         
          if(!dataToReceve)
            return res.status(HTTP_BAD_REQUEST).json({message:"account not found"});

          if(data.number_account == number_account)
            return res.status(HTTP_BAD_REQUEST).json({message:"you cannot transfer to your own account"});
            
          if(data.balance <= 0)
            return res.status(HTTP_BAD_REQUEST).json({message:"you have no balance"});
          
          if(data.balance < valueTransfer)
            return res.status(HTTP_BAD_REQUEST).json({message:"not enough balance"});
            
            const result = data.balance - valueTransfer;
            
            await data.update({
                balance: result
            });
           
            const  soma  = dataToReceve.balance - (-valueTransfer);
              await dataToReceve.update({
                balance: soma
              }).catch(err => {return console.log(err)});
          
              
              return res.status(HTTP_OK).json({message:"value was transferred"});
            }
            else 
            {
                return res.status(HTTP_NOT_FOUND).json({message:"user not found"})
            }
       
  
   }  
  
}  
  

module.exports = new controllersRouter();
