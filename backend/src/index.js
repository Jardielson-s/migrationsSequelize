const express = require('express');
const { User } = require('./app/models')
const app = express();

app.use(express.json());

app.post("/create",async(req,res)=>{
  // const {name,email,password} = req.body;
    try{
    const users = await User.create(req.body);

    return res.send(users);
    }
    catch(err){
        console.log(err);
        return res.send(err);
    }
});



app.listen(8081);