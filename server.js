const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello devs');
})

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));