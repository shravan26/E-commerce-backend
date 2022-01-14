const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
dotenv.config();

const port = 3000 || process.env.PORT;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);

mongoose.connect(process.env.DB_USER)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => console.error(err));

app.listen(port, () => {
    console.log('Server running in port ', port);
});