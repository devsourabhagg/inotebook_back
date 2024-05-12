const express = require('express');
const router = express.Router();
const User = require('../models/User');


//create a user using post "/api/auth" -> This API does not require auth

router.post('/createuser',(req,res)=>{
  console.log(req.body);
  const user = User(req.body);
  user.save();
  res.send(req.body);

})

module.exports = router