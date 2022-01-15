const Product = require('../models/Product');
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('../middleware/middleware');
const router = require('express').Router();

//Create Product 

router.post('/create', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json({
            message: "Created new product",
            product: savedProduct
        })
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Update product
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body,
        }, {
            new: true
        });
        if (updatedProduct) {
            res.status(200).json({
                message: "Updated product successfully",
                product: updatedProduct
            });
        } else {
            res.status(400).json({
                message: "Cannot find product",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Delete product
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({
            _id: req.params.id
        });
        if (deletedProduct) {
            res.status(200).json({
                message: "Deleted product successfully",
                product: deletedProduct
            });
        } else {
            res.status(400).json({
                message: "Cannot find product",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Get specific product 
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id
        });
        if (product) {
            res.status(200).json({
                message: "Fetched product successfully",
                product: product,
            });
        } else {
            res.status(400).json({
                message: "Cannot find product",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

//Get all products
router.get('/allProducts', async (req, res) => {
    const newQuery = req.query.new;
    const categoryQuery = req.query.category;
    let products;
    try {
        if (newQuery) {
            products = await Product.find().sort({
                createdAt: -1
            }).limit(5);
            res.status(200).json({
                message: "Fetched all products successfully",
                products: products,
            });
        } else if (categoryQuery) {
            products = await Product.find({
                categories: {
                    $in: [categoryQuery],
                },
            });
            res.status(200).json({
                message: "Fetched all products successfully",
                products: products,
            });
        } else {
            products = await Product.find();
            if (products.length > 0) {
                res.status(200).json({
                    message: "Fetched all products successfully",
                    products: products,
                });
            } else {
                res.status(400).json({
                    message: "No products found",
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});


//Product stats 
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await Product.aggregate([{
                $match: {
                    createdAt: {
                        $gte: lastYear
                    },
                },
            },
            {
                $project: {
                    month: {
                        $month: "$createdAt",
                    }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: 1
                    }
                }
            }
        ]);
        res.status(200).json({
            message: "Fetched product stats successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
});

module.exports = router;