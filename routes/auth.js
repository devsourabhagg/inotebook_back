const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { query, validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'f464495afd6ef3e42b642420cad6ba6c';

//Route 1 : create a user using post "/api/auth" -> This API does not require auth

router.post('/createuser',[
   body('name','Enter a valid name').isLength({min:3}),
   body('email','Enter a valid email').isEmail(),
   body('password').isLength({min:5}),
],async (req,res)=>{
  // console.log(req.body);
  // const user = User(req.body);
  // user.save();
  // res.send(req.body);
  // if there are errors then return the bad request and the errors
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors : errors.array()});
  }
  //check whether the email exits already 
  try{
    let user =  await User.findOne({email:req.body.email})
    if(user){
      return res.status(400).json({error : "Sorry a User with this Email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });

    const data = {
      user: {
        id : user.id
      }
    }
    
    const authToken = jwt.sign(data,JWT_SECRET);
    console.log(`this is the jwtdata - ${authToken}`);

    
    // .then(sourabh => res.json(sourabh))
    //   .catch(err => {console.log(err)
    //   res.json({error: 'Please Enter a unique value for email',message : err.message})}
    //   );
    //res.send(jwtData);
    res.json({authToken});

  }
  catch(error){
     console.error(error.message);
     res.status(500).send("Some Error Occured");
  }

})

//Route 2: user login 

router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password Can not be blank').exists(),
],async (req,res) =>{

  //if there are errors then return bad request and errors

  const errors = validationResult(req);
  if(!errors.isEmpty){
    return res.status(400).json({errors : errors.array()});
  }

  const {email,password} = req.body;

  try{
      let user = await User.findOne({email});
       if(!user){
        return res.status(400).json({error : "Please try to login with correct credentials"});
       }
       const comparePassword = await bcrypt.compare(password,user.password);
       if(!comparePassword){
        return res.status(400).json({error : "Please try to login with correct credentials"});
       }

       const data ={
        user:{
          id : user.id
        }
       }
       const authToken = jwt.sign(data,JWT_SECRET);
       res.send({authToken});

  }
  catch(e){
    console.log(e);
    console.log(`Erro in login Api - ${e.message}`);
  }

})

module.exports = router