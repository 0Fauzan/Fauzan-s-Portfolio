const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const fs = require("fs");
const path = require("path");

app.get("/api/data", (req, res) => {
    fs.readFile(path.join(__dirname, "data.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read data" });
        }
        res.json(JSON.parse(data));
    });
});

app.post("/api/contact", (req, res) => {

    const { name, email, message } = req.body;

    console.log(name, email, message);

    res.status(200).json({
        success: true,
        message: "Message Sent"
    });

});

app.listen(5000, () => {
    console.log("Server Running");
});