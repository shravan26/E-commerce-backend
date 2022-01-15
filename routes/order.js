const Order = require('../models/Order');
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('../middleware/middleware');
const router = require('express').Router();

//Create order

router.post('/create', verifyTokenAndAuthorization, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json({
            message: "Created new order",
            order: savedOrder
        })
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Update order
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body,
        }, {
            new: true
        });
        if (updatedOrder) {
            res.status(200).json({
                message: "Updated order successfully",
                order: updatedOrder
            });
        } else {
            res.status(400).json({
                message: "Cannot find order",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Delete order
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({
            _id: req.params.id
        });
        if (deletedOrder) {
            res.status(200).json({
                message: "Deleted order successfully",
                order: deletedOrder
            });
        } else {
            res.status(400).json({
                message: "Cannot find order",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Get specific user order 
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findOne({
            userId: req.params.userId
        });
        if (order) {
            res.status(200).json({
                message: "Fetched order successfully",
                order: order,
            });
        } else {
            res.status(400).json({
                message: "Cannot find order",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

// //Get all order
router.get('/allOrders', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        if (orders.length > 0) {
            res.status(200).json({
                message: "Fetched all user orders",
                orders: orders
            });
        } else {
            res.status(400).json({
                message: "No orders found",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Get monthly income
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([{
                $match: {
                    createdAt: {
                        $gte: previousMonth
                    }
                }
            },
            {
                $project: {
                    month: {
                        $month: "$createdAt"
                    },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: "$sales"
                    },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;