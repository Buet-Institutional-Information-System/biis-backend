//SETUP EXPRESS//////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const bodyParser=require('body-parser');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.use(bodyParser.json());
app.use(express.static('images'));
app.use(cors());

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use('/admin',adminRoutes);
app.use('/', userRoutes);
app.listen(process.env.port, function () {
    console.log("App listening with taaha at http://localhost:",process.env.port)
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////


