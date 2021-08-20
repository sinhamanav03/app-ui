const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

const state ={
    components: [
        {
            id: "c1",      // unique identifier for first box created
            name: "Source", // name of the box/component
        },
        {
            id: "c2",
            name: "Destination"
        }
    ],
    links: [
        {
            src: "c1",    // source of the link
            dest: "c2"    // destination
        }
    ]
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Authorization"
    );
    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET POST PUT DELETE PATCH");
      return res.status(200).json();
    }
    next();
  });
  

app.use("/api/state",(req,res,next)=>{
    res.status(200).json(state);
});


app.use("/api/state/cache",(req,res,next)=>{
    res.status(204).json({message:"Succesful"});
});

app.listen(port);