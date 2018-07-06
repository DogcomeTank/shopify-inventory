const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nonce = require('nonce')();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const request = require('request-promise');
const mongoose = require('mongoose');
const keys = require('./model/keys');



// view engine setup
app.set('view engine', 'ejs');

//middleware
app.use(bodyParser.json()); // parse client request data to json format
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: keys.sessionSecrete.mySecrete,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //only set this to true if you are in HTTPS connection
}));

app.set('views', path.join(__dirname, 'views'));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/')));
app.use(express.static(path.join(__dirname, 'public')));

// admin1pass

// connect mongoDB
mongoose.connect(keys.mongoose.link, { });
mongoose.Promise = global.Promise

//user authentication local
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('remember-me'));

const index = require('./routes/index');
const Products = require('./routes/Products');
const qrCode = require('./routes/qrcode');
const login = require('./routes/login');

app.use('/login', login);
app.use('/', index);
app.use('/products', Products);
app.use('/qrcode', qrCode);



app.listen(8080, () => {
  console.log('http://localhost:8080 -- "Ctrl + C to exit."');
});