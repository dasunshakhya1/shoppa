const express = require('express')
const router = express.Router()
const User = require('../models/User')




router.get("/", (req, res) => {
    User.find().then(users => {
        res.status(200).json(users)
    }).catch(err => {
        console.log(err);
        res.json({ message: err })
    })

})

router.post("/new", (req, res) => {
    const { email, firstName, lastName, contactNumber } = req.body
    const user = new User({ email, firstName, lastName, contactNumber })

    user.save()
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            console.log(err);
            res.json({ message: err })
        })

})

router.get("", (req, res) => {

})


module.exports = router