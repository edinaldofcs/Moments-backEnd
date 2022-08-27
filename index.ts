const express = require('express')
const cors = require('cors')
// const  authToken  = require('./helper/authToken')
const config = require("./config/firebase-config");

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use(authToken.decodedToken)
const instantRoutes = require("./routes/instantRoutes");

app.use("/instant", instantRoutes.routes);


app.listen(config.port,()=>{
    console.log("Listening on port 5000");
})