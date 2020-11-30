//SETUP EXPRESS//////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.use(bodyParser.json());
app.use(express.static('images'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use('/admin',adminRoutes);
app.use('/', userRoutes);
app.listen(1148, function () {
    console.log("App listening with taaha at http://localhost:",1148)
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////


