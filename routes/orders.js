// display QR code for in store pick up
const express = require('express');
const QRCode = require('qrcode');
const keys = require('../model/keys');
const rp = require('request-promise');
const router = express.Router();

router.get('/',(req, res)=>{
    req.session.currentUrl = req.originalUrl;
    const orderId = req.params.orderId;
    if (req.user) {
        if (req.user.orderAccess  == 1) {
            // order information
            res.render('orders');

        } else {
            res.redirect('/login/google-login');
        }

    } else {
        res.redirect('/login/google-login');
    }
});

router.get('/orderId/:orderId', (req, res) => {

    // console.log(req.params.orderId);

    // display qr code
    //link: index.js
    QRCode.toDataURL('http://lalarala/orders/orderId/'+ req.params.orderId, function (err, url) {
        res.send('<img style="display: block; margin:auto; max-width: 410px; width: 100%;" src="' + url + '"/>');
    });

});


router.get('/orderPickup/orderId/:orderId', (req, res) => {
    // display pick up order information
    req.session.currentUrl = req.originalUrl;

    const orderInfoId = req.params.orderId;

    if (req.user == undefined) {
        res.redirect('/login/google-login');
    }else{
        if (req.user.orderAccess) {
            res.render('orderPickup', {orderInfoId});
        } else {
            res.send('Access denied.');
        }
    }
});


// rest api for display pick up order information
router.get('/orderInfo', (req, res) => {
    req.session.currentUrl = req.originalUrl;
    const orderId = req.params.orderId;
    if (req.user) {
        if (req.user.orderAccess  == 1) {
            // order information api
            var options = {
                // uri: key.shopifyLink.productInfo,
                uri: keys.shopifyLink.orderInfo,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };


            rp(options)
                .then(function (data) {
                    res.json(data);
                })
                .catch(function (err) {
                    // API call failed...
                    res.send('API call failed. Err: '+ err);
                });

        } else {
            res.redirect('/login/google-login');
        }

    } else {
        res.redirect('/login/google-login');
    }
    

});




router.get('/orderInfo/orderId/:orderId', (req, res) => {
    // close order
    req.session.currentUrl = req.originalUrl;
    const orderId = req.params.orderId;
    if (req.user) {
        if (req.user.orderAccess  == 1) {
            // order information api
            var options = {
                // uri: key.shopifyLink.productInfo,
                uri: keys.shopifyLink.orderPickupUrl + orderId + '.json',
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };


            rp(options)
                .then(function (data) {
                    res.json(data);
                })
                .catch(function (err) {
                    // API call failed...
                    res.send('API call failed. Err: '+ err);
                });

        } else {
            res.redirect('/login/google-login');
        }

    } else {
        res.redirect('/login/google-login');
    }


});


router.get('/orderFulfill/orderId/:orderID',(req, res)=>{
    req.session.currentUrl = req.originalUrl;
    const orderId = req.params.orderId;

    if (req.user) {

        // POST /admin/orders/#{order_id}/fulfillments.json
        if (req.user.orderAccess  == 1) {
            // order information api
            var options = {
                method: 'POST',
                uri: keys.shopifyLink.orderPickupUrl + orderId + '/close.json',
                formData: {
                  },
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };


            rp(options)
                .then(function (data) {
                    res.json(data);
                })
                .catch(function (err) {
                    // API call failed...
                    res.send('API call failed: '+ err);
                });

        } else {
            res.redirect('/login/google-login');
        }

    } else {
        res.redirect('/login/google-login');
    }
});


module.exports = router;