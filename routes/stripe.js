const router = require('express').Router();
const stripe = require('stripe')('sk_test_51KIK4mSBXtp2yyWJccf4Z8Ss4lq0hGopdsBdYuBYHqDuoMSWQqh74gEG8BNpKDkCBZz12HtBKC2dqIHBt0l6T2EN00hsB4chgE');
//Make stripe payment
router.post('/payment', (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json(stripeErr);
        } else {
            res.status(200).json(stripeRes);
        }
    })
})

module.exports = router;