//SETUP EXPRESS//////////////////////////////////////////////////////////////////////////////////////////////
let express = require('express');
const bodyParser=require('body-parser');
let app = express();
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


//SETUP ORACLE /////////////////////////////////////////////////////////////////////////////////////////////
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
let databaseAuth={
    user          : "biis",
    password      : "biis",
    connectString : ""
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////


//RUN SERVER////////////////////////////////////////////////////////////////////////////////////////////////
let server = app.listen(1148, function () {
    console.log("App listening with taaha at http://localhost:",1148)
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

//database connection/////////////////////////////////////////////////////////////////////////////////////////

// let connection = await oracledb.getConnection(databaseAuth);
let connection;
const database=async function(){
    try{
        let pool= await  oracledb.createPool(databaseAuth);
        connection=await pool.getConnection();
        console.log("Connection to database established");
    }catch(err){
        console.log("Error ",err);
    }
}
database();
// let connection;
// oracledb.getConnection(databaseAuth)
//     .then((res)=>{
//         console.log("Connection to database established");
//         connection = res;
//     })
//     .catch((e)=>{
//         console.log("Error");
//     });

////////////////////////////////////////////////////////////////////////////////////////////////////////////


//ROUTES////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/insert',async function (req, res) {
    console.log("Request from client: ", req.body);
    //let connection = await oracledb.getConnection(databaseAuth);
    let query="insert into regions values("+req.body.id+",'"+req.body.name+"')";
    console.log(query);
    const result = await connection.execute(query);
    console.log("The results found in query: ");
    console.log(result);
    const result2 = await connection.execute(
        `commit`,
    );
    console.log('The result found from coomit: ',result2);

    res.send(result);
    //await connection.close();
});

app.patch('/update',async function (req, res) {
    console.log("Request from client: ", req.body);
    //let connection = await oracledb.getConnection(databaseAuth);
    let query="update regions set region_name='"+req.body.uname+"' where region_name='"+req.body.name+"'";
    console.log(query);
    const result = await connection.execute(query);
    console.log("The results found in query: ");
    console.log(result);
    const result2 = await connection.execute(
        `commit`,
    );
    console.log('The result found from coomit: ',result2);

    res.send(result);
    //await connection.close();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.delete('/delete',async function (req, res) {
    console.log("Request from client: ", req.body);
    //let connection = await oracledb.getConnection(databaseAuth);
    let query="delete regions where region_name='"+req.body.name+"'";
    console.log(query);
    const result = await connection.execute(query);
    console.log("The results found in query: ");
    console.log(result);
    const result2 = await connection.execute(
        `commit`,
    );
    console.log('The result found from coomit: ',result2);

    res.send(result);
    //await connection.close();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Project /////////////////////////////////////////////////////////////////////////////////////////


app.post('/signIn',async function(req,res){
    let query="select userid,userpassword,username,userlevel,userterm,usersession,bankaccount,hallname,hallstatus,adviser_id,(select name from department d where d.code=department_code) dept from student where userid="+req.body.id+" and userpassword='"+req.body.password+"'";
    console.log(query);
    //let query='select userid,userpassword,username,userlevel,userterm,usersession,bankaccount,hallname,hallstatus,adviser_id,(select name from department d where d.code=department_code) dept from student where userid=? and userpassword=?';
    try{ console.log('Hello');
        const result=await connection.execute(query);
        console.log("The results found in query: ");
        console.log(result);
        console.log("returned rows from query: ",result.rows.length);
        res.send(result);
    }catch(e){
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/adviser/:id',async function(req,res){
    let query="select name,designation,(select name from department d where d.code=department_code) dept from adviser where id="+req.params.id;
    //console.log(query);
    try{
        const result=await connection.execute(query);
        console.log("The results found in query: ");
        console.log(result);
        console.log("returned rows from query: ",result.rows.length);
        res.send(result);
    }catch(e){
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/contactInfo/:id',async function(req,res){
    let query="select phone,email,address from student where userid="+req.params.id;
    //console.log(query);
    try{
        const result=await connection.execute(query);
        console.log("The results found in query: ");
        console.log(result);
        console.log("returned rows from query: ",result.rows.length);
        res.send(result);
    }catch(e){
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.patch('/editInfo',async function(req,res){

    let query="update student set phone='"+req.body.phone+"',email='"+req.body.email+"',address='"+req.body.address+"' where userid="+req.body.id;
    let query2="commit";
    let query3="select phone,email,address from student where userid="+req.body.id;
    //console.log(query);
    //console.log(query3);
    try{
        const result=await connection.execute(query);
        const result2 = await connection.execute(query2);
        const result3=await connection.execute(query3);
        console.log("The results found in query: ");
        console.log(result3);
        console.log("returned rows from query3: ",result3.rows.length);
        res.send(result3);
    }catch(e){
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.patch('/password',async function(req,res){

    let query="update student set userpassword='"+req.body.newpassword+"' where userid="+req.body.id+" and userpassword='"+req.body.password+"'";
    let query2="commit";
    let query3="select userpassword from student where userid="+req.body.id;
    //console.log(query);
    try{
        const result=await connection.execute(query);
        console.log("The results found in query: ");
        console.log(result);
        const result2 = await connection.execute(query2);
        console.log(query2);
        const result3=await connection.execute(query3);
        console.log("The results found in query: ");
        console.log(result3);
        console.log("returned rows from query2: ",result3.rows.length);
        res.send(result3);
    }catch(e){
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
