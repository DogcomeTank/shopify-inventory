const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    req.session.currentUrl = req.originalUrl;

    if (req.user == undefined) {
        res.redirect('/login/google-login');
    }else{
        if (req.user.accessLevel) {
            res.render('index');
        } else {
            res.redirect('/login/google-login');
        }
    }


});

router.get('/orders/orderId/:orderId', (req, res) => {
    req.session.currentUrl = req.originalUrl;

    const orderInfoId = req.params.orderId;

    if (req.user == undefined) {
        res.redirect('/login/google-login');
    }else{
        if (req.user.accessLevel) {
            res.render('orderPickup', {orderInfoId});
        } else {
            res.redirect('/login/google-login');
        }
    }


});




module.exports = router;