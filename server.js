const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

app.use("/",(req,res,next)=>{
    res.json({
        message:"dummy api",
    });
});

app.listen(port);