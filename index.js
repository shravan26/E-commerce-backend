const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = 3000 || process.env.PORT;

mongoose.connect(process.env.DB_USER)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => console.error(err));

app.listen(port, () => {
    console.log('Server running in port ', port);
})