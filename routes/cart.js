const Cart = require('../models/Cart');
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('../middleware/middleware');
const router = require('express').Router();

//Create cart 

router.post('/create', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json({
            message: "Created new cart",
            cart: savedCart
        })
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Update cart
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body,
        }, {
            new: true
        });
        if (updatedCart) {
            res.status(200).json({
                message: "Updated cart successfully",
                cart: updatedCart
            });
        } else {
            res.status(400).json({
                message: "Cannot find cart",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Delete cart
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedCart = await Cart.findOneAndDelete({
            _id: req.params.id
        });
        if (deletedCart) {
            res.status(200).json({
                message: "Deleted cart successfully",
                cart: deletedCart
            });
        } else {
            res.status(400).json({
                message: "Cannot find cart",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Get specific user cart 
router.get('/find/:userId',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.userId
        });
        if (cart) {
            res.status(200).json({
                message: "Fetched cart successfully",
                cart: cart,
            });
        } else {
            res.status(400).json({
                message: "Cannot find cart",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

// //Get all carts
router.get('/allCarts',verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        if(carts.length > 0) {
            res.status(200).json({
                message : "Fetched all user carts",
                carts : carts
            });
        }
        else{
            res.status(400).json({
                message : "No carts found",
            });
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
});

module.exports = router;