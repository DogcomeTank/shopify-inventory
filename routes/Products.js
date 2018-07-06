const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const key = require('../model/keys');

router.get("/", (req, res)=>{
    req.session.currentUrl = req.originalUrl;

    if(req.user.accessLevel == undefined){
        res.redirect('/login//google-login');
    }

    if(req.user.accessLevel == 1){
        const shopifyAPISelection = 'products.json';

        var options = {
            uri: key.shopifyLink.productInfo + shopifyAPISelection,
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
                res.send('API call failed..');
        });
    }else{
        res.redirect('/login/google-login');
    }

    

});

router.get("/productInfo", (req, res)=>{
    // res.render

});



module.exports = router;