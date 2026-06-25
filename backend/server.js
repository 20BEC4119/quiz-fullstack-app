require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQLDATABASE
});
db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Database Connected");
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});

app.get("/questions", (req, res) => {
    db.query("SELECT * FROM questions", (err, result) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        res.json(result);
    });
});