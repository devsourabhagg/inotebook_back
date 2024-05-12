const express = require('express');
const router = express.Router();

router.get('/get',(req,res)=>{
    obj ={
      a : 'Sourabh',
      number: 34,
    }
    res.json(obj);

})

module.exports = router