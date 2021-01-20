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
    user          : "hr",
    password      : "hr",
    connectString : ""
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////


//RUN SERVER////////////////////////////////////////////////////////////////////////////////////////////////
let server2 = app.listen(1148, function () {
    console.log("App listening with taaha at http://localhost:",1148)
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////


//ROUTES////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/insert',async function (req, res) {
    console.log("Request from client: ", req.body);
    let connection = await oracledb.getConnection(databaseAuth);
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
    await connection.close();
});

app.post('/update',async function (req, res) {
    console.log("Request from client: ", req.body);
    let connection = await oracledb.getConnection(databaseAuth);
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
    await connection.close();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/delete',async function (req, res) {
    console.log("Request from client: ", req.body);
    let connection = await oracledb.getConnection(databaseAuth);
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
    await connection.close();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/signIn',async function(req,res){
   let connection= await oracledb.getConnection(databaseAuth);
   let query="select userid,userpassword,username,userlevel,userterm,usersession,bankaccount,hallname,hallstatus,adviser_id,(select name from department d where d.code=department_code) dept from student where userid="+req.body.id+" and userpassword='"+req.body.password+"'";
   console.log(query);
   const result=await connection.execute(query);
   console.log("The results found in query: ");
   console.log(result);
   console.log("returned rows from query: ",result.rows.length);
   res.send(result);
   await connection.close();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/adviser',async function(req,res){
    let connection= await oracledb.getConnection(databaseAuth);
    let query="select name,designation,(select name from department d where d.code=department_code) dept from adviser where id="+req.body.id;
    console.log(query);
    const result=await connection.execute(query);
    console.log("The results found in query: ");
    console.log(result);
    console.log("returned rows from query: ",result.rows.length);
    res.send(result);
    await connection.close();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/contactInfo',async function(req,res){
    let connection= await oracledb.getConnection(databaseAuth);
    let query="select phone,email,address from student where userid="+req.body.id;
    console.log(query);
    const result=await connection.execute(query);
    console.log("The results found in query: ");
    console.log(result);
    console.log("returned rows from query: ",result.rows.length);
    res.send(result);
    await connection.close();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/editInfo',async function(req,res){
    let connection= await oracledb.getConnection(databaseAuth);
    let query="update student set phone='"+req.body.phone+"',email='"+req.body.email+"',address='"+req.body.address+"' where userid="+req.body.id;
    console.log(query);
    const result=await connection.execute(query);
    const result2 = await connection.execute(
        `commit`,
    );
    let query2="select phone,email,address from student where userid="+req.body.id;
    console.log(query2);
    const result3=await connection.execute(query2);
    console.log("The results found in query: ");

    console.log(result3.rows);
    res.send(result3);
    await connection.close();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/password',async function(req,res){
    let connection= await oracledb.getConnection(databaseAuth);
    let query="update student set userpassword='"+req.body.newpassword+"' where userid="+req.body.id+" and userpassword='"+req.body.password+"'";
    console.log(query);
    const result=await connection.execute(query);
    console.log("The results found in query: ");
    console.log(result);
    const result3 = await connection.execute(
        `commit`,
    );
    let query2="select userpassword from student where userid="+req.body.id;
    console.log(query2);
    const result2=await connection.execute(query2);
    console.log("The results found in query: ");
    console.log(result2);
    console.log("returned rows from query2: ",result2.rows.length);
    res.send(result2);
    console.log("password route complete");
    await connection.close();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

