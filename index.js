const sqlite3 = require('sqlite3');
const express = require('express');
const crypto = require('crypto');
require("dotenv").config();

// init sqlite db + express server
const db = new sqlite3.Database("./main.db");
const app = express()
app.use(express.urlencoded({ extended: false }));

// link shortener
app.get("/:id", (req,res) => {
    db.serialize(() => {
        let stmt = db.prepare("SELECT redirect FROM urls WHERE id = ?")
        stmt.get(req.params.id, (err,row) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Failed to retrieve URL from database"
                })
            } else {
                return res.redirect(row.redirect)
            }
        })

        stmt.finalize()
    })
})

app.post("/create", ensureSecretIsValid, (req,res) => {
    if (!req.query || !req.query.url) {
        return res.status(400).json({
            status: 400,
            message: "Missing redirection URL"
        })
    } else {
        const uuid = crypto.randomBytes(5).toString('hex')
        db.serialize(() => {
            let stmt = db.prepare("INSERT INTO urls VALUES (?, ?)")
            stmt.run(uuid, req.query.url)
            stmt.finalize()
        })

        return res.status(200).json({
            status: 200,
            message: "Created URL!",
            id: uuid
        })
    }
})

app.delete("/:id", ensureSecretIsValid, (req,res) => {
    db.serialize(() => {
        let stmt = db.prepare("DELETE FROM urls WHERE id = ?")
        stmt.run(req.params.id)
        stmt.finalize()
    })

    return res.status(200).json({
        status: 500,
        message: "Deleted URL"
    })
})

// global catch-all
app.all("*", (req,res) => {
    return res.status(404).json({
        status: 404,
        message: "No resource found"
    })
})

app.listen(process.env.PORT || 3000, () => {
    // create tables
    console.log("Initializing database tables..")
    db.run("CREATE TABLE IF NOT EXISTS urls (id varchar(5), redirect varchar(255))")

    // server is started
    console.log("Server has started on port " + (process.env.PORT || 3000))
})

// secret middleware
function ensureSecretIsValid(req,res,next) {
    if (!req.query || !req.query.secret || !process.env.SECRET) {
        return res.status(400).json({
            status: 400,
            message: "No secret set or provided"
        })
    } else {
        if (req.query.secret === process.env.SECRET) {
            return next()
        } else {
            return res.status(401).json({
                status: 401,
                message: "Invalid secret provided"
            })
        }
    }
}