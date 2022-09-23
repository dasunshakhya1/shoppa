const express = require('express')
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv/config')

app.use(morgan('tiny'));
app.use(express.json())
const userRouter = require('./src/routes/user')






app.use("/users", userRouter)


mongoose.connect(process.env.DB_URL, () => console.log("Connected To DB")).catch(err => {
    console.log(err);
})




app.listen(8080)