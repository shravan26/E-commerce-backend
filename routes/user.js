const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('../middleware/middleware');
const User = require('../models/User');
const router = require('express').Router();
const crypto = require('crypto');
const { generatePassword } = require('../utils/passwordUtils');
const { removeAllListeners } = require('process');

//Update user
router.put('/:id',verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        const encryptedPassword = generatePassword(req.body.password);
        req.body.password = encryptedPassword.encry_password;
        await User.findOneAndUpdate(req.params.id, {
            $set : {
                salt : encryptedPassword.salt,
            }
        })
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set : req.body
        },{new : true}); 
        res.status(200).json({
            message : "Updates successfully",
            user : updatedUser
        })
    }
    catch (err) {
        res.status(500).json({error: err});
    }
});

//Delete user
router.delete('/:id', verifyTokenAndAuthorization, async (req,res) => {
    try {
        const deletedUser = await User.findOneAndDelete({_id : req.params.id});
        if(deletedUser) {
            res.status(200).json({
                message : "Deleted successfully",
                user : deletedUser
            });
        }
        else {
            res.status(400).json({
                message : "User does not exist",
            });
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
});

//Get user with id
router.get('/find/:id', verifyTokenAndAdmin, async (req,res) => {
    try {
        const returnedUser = await User.findById({_id : req.params.id});
        if(returnedUser) {
            res.status(200).json({
                message : "Fetched successfully",
                user : returnedUser
            });
        }
        else {
            res.status(400).json({
                message : "User does not exist",
            });
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
});

//Get all users 
router.get('/', verifyTokenAndAdmin, async (req,res) => {
    try {
        const query = req.params.query;
        const allUsers = query ? await User.find().sort({_id : -1}).limit(5) : await User.find();
        console.log(allUsers);
        if(allUsers.length > 0) {
            res.status(200).json({
                message : "Fetched successfully",
                users : allUsers
            });
        }
        else {
            res.status(400).json({
                message : "No users found",
            });
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
});

//Get User Stats 
router.get('/stats',verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            {
                $match : {
                    createdAt : {$gte : lastYear}
                }
            },
            {
                $project : {
                    month : {$month : "$createdAt"}
                }
            },
            {
                $group : {
                    _id : "$month",
                    total : {$sum : 1}
                }
            }
        ]);
        res.status(200).json({
            data : data
        })
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

module.exports = router;