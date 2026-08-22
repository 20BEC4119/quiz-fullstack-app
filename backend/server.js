const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());


// ======================================
// MONGODB CONNECTION
// ======================================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });


// ======================================
// MYSQL CONNECTION
// KEEPING MYSQL FOR QUESTIONS FOR NOW
// ======================================

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQLDATABASE
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection error:", err);
        return;
    }

    console.log("MySQL Connected");
});


// ======================================
// LOGIN - USING MONGODB
// ======================================

app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({
            username: username,
            password: password
        });

        if (user) {

            res.json({
                success: true
            });

        } else {

            res.json({
                success: false
            });

        }

    } catch (err) {

        console.log("Login error:", err);

        res.status(500).json({
            error: err.message
        });
    }
});


// ======================================
// QUESTIONS - STILL USING MYSQL
// ======================================

app.get("/questions", (req, res) => {

    db.query("SELECT * FROM questions", (err, result) => {

        if (err) {

            console.log("Questions error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });

});


// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});