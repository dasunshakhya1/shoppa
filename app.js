require('dotenv/config') 
const express = require('express')
const morgan = require('morgan')





const app = express();
app.use(morgan('tiny'));
app.use(express.json())








const customerRoute = require('./src/routes/customer')
app.use("/customers", customerRoute)


app.listen(8080,()=>console.log("Server is running on port 8080"))