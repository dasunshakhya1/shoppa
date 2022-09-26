const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connection = require("../utils/db");


router.get('/customers', (req, res) => {
    const query = 'Select * from customer'
    connection.query(query, (e, r) => {
        if (e) { res.status(500).json({ error: e }) }
        else {
            if (r.length > 0) {
                let customers = []
                r.forEach(element => {
                    let { firstName, lastName, email, contactNumber } = element;
                    const customer = { firstName, lastName, email, contactNumber }
                    customers.push(customer)
                });
                res.status(200).json({ customers })
            } else {
                res.status(404).json({ error: "User Not Found" })
            }
        }
    })
})


router.get('/:customerId', (req, res) => {
    const customerId = req.params.customerId
    const query = `Select * from customer where customerId=${customerId}`

    connection.query(query, (e, r) => {
        if (e) {
            res.status(500).json({ error: e })
        } else {
            if (r.length > 0) {
                const { firstName, lastName, email, contactNumber } = r[0];
                res.status(200).json({ user: { firstName, lastName, email, contactNumber } })
            } else {
                res.status(404).json({ error: "User Not Found" })
            }
        }
    })
})






router.post("/login", async (req, res) => {
    const { username, password } = req.body
    const query = `Select * from customer where username = '${username}'`
    connection.query(query, async (e, r) => {
        if (e) {
            res.status(500).json({ error: e })
        } else {
            if (r.length > 0) {
                try {
                    const savedPassword = r[0]["password"]
                    const access_toke = generateToken(username)
                    const isValidPassword = await bcrypt.compare(password, savedPassword)
                    if (isValidPassword) {
                        res.status(200).json({
                            message: "success", access_toke
                        })
                    } else {
                        res.status(403).send()
                    }
                } catch (error) {

                }
            } else {
                res.status(404).json({ message: "User Not Found" })
            }
        }
    })
})








router.post("/new", (req, res) => {
    const { firstName, lastName, email, username, password, contactNumber } =
        req.body;
    const getQuery = `Select * from customer where username = '${username}' and contactNumber ='${contactNumber}' and email ='${email}'`;
    connection.query(getQuery, (e, r) => {
        if (e) {
            res.status(500).json({ error: e })
        } else {
            if (r.length > 0) {
                res.status(409).json({ message: "User Already Exist" })
            } else {
                saveUser(connection, req, res, firstName, lastName, email, username, password, contactNumber)
            }
        }
    })
});

const saveUser = async (connection, req, res, firstName, lastName, email, username, password, contactNumber) => {
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const query = `Insert into customer(firstName, lastName, email, username, password, contactNumber) 
                   values ('${firstName}','${lastName}','${email}','${username}','${hashPassword}','${contactNumber}')`;
        connection.query(query, (e, r) => {
            if (e) {
                const { sqlMessage } = e
                res.status(500).json({ error: sqlMessage })
            } else {
                const { insertId } = r
                console.log({ message: "User Created", email, insertId });
                res.json({
                    message: `User Created`,
                    user: { firstName, lastName, id: insertId }
                }).status(201)
            }
        })
    } catch (error) {
        res.status(500).json({ error: e })
    }
}

const generateToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

const authenticateToken = (req, res, next) => {
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    if (token == null) {
        res.sendStatus(401)
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (e, u) => {
            if (e) { res.sendStatus(403) }
            else {
                req.user = u
                next()
            }
        })
    }
}

module.exports = router;
