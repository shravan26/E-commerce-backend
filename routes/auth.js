const router = require('express').Router();
const User = require('../models/User');
const {generatePassword,validatePassword} = require('../utils/passwordUtils')
router.post('/register', async (req,res) => {
    const encryptedPassword = generatePassword(req.body.password).encry_password;
    const salt = generatePassword(req.body.password).salt;
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : encryptedPassword,
        isAdmin : req.body.admin,
        salt : salt,
    });
    try {
        const savedUser = await newUser.save();
        res.status(200).json({
            user : savedUser,
        });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({
            error : err,
        })
    }
});

router.post('/login', async (req,res) => {
    try{
        const existingUser = await User.findOne({username : req.body.username});
        if(existingUser) {
            if(validatePassword(req.body.password,existingUser.password,existingUser.salt)){
                console.log('User logged in');
                res.status(200).json({
                    message : "User successfully signed in",
                })
            } 
            else {
                console.log('Wrong Credentials');
                res.status(400).json({
                    message : "Wrong Credentials",
                })
            }
        }
        else {
            console.log('User does not exist');
            res.status(401).json({
                error : "User does not exist",
            })
        }
    }
    catch(err) {
        console.log(err.message);
        res.status(500).json({
            error : err.message,
        });
    }
})

module.exports = router;