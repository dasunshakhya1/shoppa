const express = require('express')
const router = express.Router()
const connection = require('../utils/db')




router.get("/", (req, res) => {
    const query = 'Select * from user'
    connection.connect((err) => {
        if (err) {
            console.log(err);
        }
        else {
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({ err })
                }
                if (result.lenght > 0) {
                    res.status(200).json(result)
                } else {
                    res.status(400).json({ message: `Empty Database` })
                }
            })
        }
        connection.end();
    })

})

router.post("/new", (req, res) => {
    const { email, firstName, lastName, contactNumber } = req.body


})


router.route("/:id").get((req, res) => {
    const id = req.params.id
    const query = `Select * from user where id = ${id}`
    connection.connect((err) => {
        if (err) {
            console.log(err);
        }
        else {
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({ err })
                }
                if (result.lenght > 0) {
                    res.status(200).json(result)
                } else {
                    res.status(400).json({ message: `User with ID ${id} not found` })
                }
            })
        }
        connection.end();
    })

    console.log(connection.state);

})



module.exports = router