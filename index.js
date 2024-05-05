const connectToMongo = require('./db');
const express = require('express');

connectToMongo();

const app = express();
const port = 3000;


app.get('/getName',(req,res)=> {
    res.send('Hello Sourabh');
})

app.listen(port,()=>{
    console.log(`listening ${port}`);
})