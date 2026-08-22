const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const User = require("./models/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));


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
// LOGIN - MONGODB
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
// TEST MONGODB USER
// ======================================

app.get("/test-user", async (req, res) => {

    try {

        const user = await User.create({
            username: "testuser",
            password: "1234"
        });

        res.json(user);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Running on Port ${PORT}`);
});