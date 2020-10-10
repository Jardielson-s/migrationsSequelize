const { User } = require('../app/models');
const bcrypt = require('bcrypt');

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

            return res.status(200).json(users);
          })
          .catch((err)=>{
              console.log(err);
              res.status(500).json({message:"don't possible registrer user"});
          })
      
          
          }
          catch(err){
              console.log(err);
              return res.send(err);
          }
        }
        else{
            return res.status(404).json({message:"email already exist"});
        }
   
    }

    async load(req,res){
        try{
          const data = await User.findAll()
          .then(function(data){
              return res.status(200).json(data);
          })
          .catch((err)=>{
              return res.status(500).json({message:"don't connect with database"});
          })
        }
        catch(err){
            return res.status(500).json({message:"don't connect with database"})
        }
    }

    async loadOne(req,res){
       
        try{
          const data = await User.findByPk(req.params.id)
          
          if(data){
              return res.status(200).json(data);
          }
          else{
              return res.status(500).json({message:"user not found"});
          }
        
        }
        catch(err){
            return res.status(500).json({message:"don't connect with database"})
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
                  return res.status(200).json(data);
              })
              .catch((err)=>{
                  return res.status(400).json({message:"don't possible update datas"});
              })
          }
          else{
              return res.status(500).json({message:"user not found"});
          }
        
        }
        catch(err){
            return res.status(500).json({message:"don't connect with database"})
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
                  return res.status(200).json({message:"user deleted with sucess"});
              })
              .catch((err)=>{
                  return res.status(400).json({message:"don't possible delete datas"});
              })
          }
          else{
              return res.status(500).json({message:"user not found"});
          }
        
        }
        catch(err){
            return res.status(500).json({message:"don't connect with database"})
        }
    }


}


module.exports = new controllersRouter();