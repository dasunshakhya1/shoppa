const express = require('express')
const morgan = require('morgan')

require('dotenv/config')



const app = express();
app.use(morgan('tiny'));
app.use(express.json())








const userRouter = require('./src/routes/user')
app.use("/users", userRouter)


app.listen(8080)