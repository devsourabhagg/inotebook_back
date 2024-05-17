const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { query, validationResult, body } = require('express-validator');


//create a user using post "/api/auth" -> This API does not require auth

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
    user = await Userd.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    
    // .then(sourabh => res.json(sourabh))
    //   .catch(err => {console.log(err)
    //   res.json({error: 'Please Enter a unique value for email',message : err.message})}
    //   );
    res.send(user);
  }
  catch(error){
     console.error(error.message);
     res.status(500).send("Some Error Occured");
  }

})

module.exports = router