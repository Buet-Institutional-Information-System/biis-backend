//SETUP EXPRESS//////////////////////////////////////////////////////////////////////////////////////////////
let express = require('express');
const bodyParser=require('body-parser');
let app = express();
const biis = require('./biisdatabase');

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



//RUN SERVER////////////////////////////////////////////////////////////////////////////////////////////////
let server = app.listen(1148, function () {
    console.log("App listening with taaha at http://localhost:",1148)
});
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


app.post('/signIn',async function(req,res){

    let result = await biis.signIn(req.body.id,req.body.password);

    res.send(result);

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/adviser/:id',async function(req,res){
    let query="select ins_name,designation,(select dept_name from departments d where d.dept_id=i.dept_id) dept from instructors i where ins_id="+req.params.id;
    //console.log(query);
    try{
        const result=await connection.execute(query);
        console.log("The results found in query: ");
        console.log(result);
        console.log("returned rows from query: ",result.rows.length);
        res.send(result);
    }catch(e){
        console.log(e);
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/contactInfo/:id',async function(req,res){
    let query="select mobile_number,contact_person_name,contact_person_number,address from students where student_id="+req.params.id;
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
    console.log(req);
    let query="update students set mobile_number='"+req.body.phone+"',contact_person_name='"+req.body.contact_person_name+"',contact_person_number='"+req.body.contact_person_number+"',address='"+req.body.address+"' where student_id="+req.body.id;
    let query2="commit";
    let query3="select mobile_number,contact_person_name,contact_person_number,address from students where student_id="+req.body.id;
    //console.log(query);
    //console.log(query3);
    try{
        const result=await connection.execute(query);
        console.log('Updating ',result);
        const result2 = await connection.execute(query2);
        console.log('Commiting ',result2);
        const result3=await connection.execute(query3);
        console.log("The results found in query: ");
        console.log(result3.rows[0]);
        console.log("returned rows from query3: ",result3.rows.length);
        res.send(result3);
    }catch(e){
        console.log(e);
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.patch('/password',async function(req,res){

    let query="update students set psswrd='"+req.body.newpassword+"' where student_id="+req.body.id+" and psswrd='"+req.body.password+"'";
    let query2="commit";
    let query3="select psswrd from students where student_id="+req.body.id;
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
app.get('/viewGrade/:id',async function(req,res){
    let query="select distinct(term_id) from registration where student_id="+req.params.id+"and obtained_grade_point is not NULL";
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
app.get('/showGrade',async function(req,res){
    console.log(req.query);
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour,(select grade from grades g where g.grade_point=r.obtained_grade_point) obtained_grade,obtained_grade_point from registration r where student_id="+req.query.id+"and term_id='"+req.query.term_id+"'";
    //console.log(query);
    let query2="select  sum(c.credit_hour) registered_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.query.id+"and r.term_id='"+req.query.term_id+"'";
    let query3="select  sum(c.credit_hour) earned_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.query.id+"and r.term_id='"+req.query.term_id+"' and r.obtained_grade_point<>0";
    let query4="select  sum(c.credit_hour) total_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.query.id+" and r.obtained_grade_point<>0";
    let query5="select  sum(c.credit_hour*r.obtained_grade_point) gpa  from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.query.id+"and r.term_id='"+req.query.term_id+"'";
    let query6="select  sum(c.credit_hour*r.obtained_grade_point) cgpa  from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.query.id;
    try{
        const result=await connection.execute(query);
        console.log("The results found in query: ");
        console.log(result);
        console.log("returned rows from query: ",result.rows.length);
        const result2=await connection.execute(query2);
        console.log(result2.rows[0].REGISTERED_CREDIT_HOURS);
        result.registered_credit_hours=result2.rows[0].REGISTERED_CREDIT_HOURS;
        const result3=await connection.execute(query3);
        console.log(result3.rows[0].EARNED_CREDIT_HOURS);
        result.earned_credit_hours=result3.rows[0].EARNED_CREDIT_HOURS;
        const result4=await connection.execute(query4);
        console.log(result4.rows[0].TOTAL_CREDIT_HOURS);
        result.total_credit_hours=result4.rows[0].TOTAL_CREDIT_HOURS;
        const result5=await connection.execute(query5);
        console.log(result5.rows[0].GPA);
        result.gpa=result5.rows[0].GPA/result.earned_credit_hours;
        console.log(result.gpa);
        const result6=await connection.execute(query6);
        console.log(result6.rows[0].CGPA);
        result.cgpa=result6.rows[0].CGPA/result.total_credit_hours;
        console.log(result.cgpa);
        res.send(result);
    }catch(e){
        console.log(e);
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/registration',async function(req,res){
    console.log(req.query);
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour from registration r where student_id="+req.query.id+"and term_id='"+req.query.term_id+"'";
    //console.log(query);
    try{
        const result=await connection.execute(query);
        console.log("returned rows from query: ",result.rows.length);

        if(result.rows.length==0)
        {

            let query2="select course_id,(select course_title from courses c where c.course_id=t.course_id) course_title,(select credit_hour from courses c where c.course_id=t.course_id) credit_hour from courseinterm t where term_id='"+req.query.term_id+"' and available_dept='"+req.query.available_dept+"'";
            const result2=await connection.execute(query2);
            console.log("The results found in query: ");
            result2.registration=true;
            console.log(result2);
            let query3="select sum(c.credit_hour) total_credit_hour from courses c join courseinterm  t on(c.course_id=t.course_id) where t.term_id='"+req.query.term_id+"' and available_dept='"+req.query.available_dept+"'";
            console.log(query3);
            const result3=await connection.execute(query3);
            console.log(result3.rows[0].TOTAL_CREDIT_HOUR);
            result2.total_credit_hour=result3.rows[0].TOTAL_CREDIT_HOUR;
            return res.send(result2);
        }
        console.log("The results found in query: ");
        result.registration=false;
        console.log(result);
        res.send(result);
    }catch(e){
        console.log(e);
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/registrationApproval',async function(req,res){
    console.log("registrationApproval ",req.query);
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour from registration r where student_id="+req.query.id+"and term_id='"+req.query.term_id+"'";
    //console.log(query);
    let query2="select  sum(c.credit_hour) registered_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.query.id+"and r.term_id='"+req.query.term_id+"'";
    let query3="select  sum(c.credit_hour) credit_hours_earned from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.query.id+" and r.term_id<>'"+req.query.term_id+"'and r.obtained_grade_point<>0";
    try{
        const result=await connection.execute(query);
        console.log("returned rows from query: ",result.rows.length);
        console.log("The results found in query: ");
        console.log(result);
        const result2=await connection.execute(query2);
        console.log(result2.rows[0].REGISTERED_CREDIT_HOURS);
        result.registered_credit_hours=result2.rows[0].REGISTERED_CREDIT_HOURS;
        const result3=await connection.execute(query3);
        console.log(result3.rows[0].CREDIT_HOURS_EARNED);
        result.credit_hours_earned=result3.rows[0].CREDIT_HOURS_EARNED;
        res.send(result);
    }catch(e){
        console.log(e);
        res.send(e);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/insertRegistration',async function (req, res) {
    console.log("Request from client: ", req.body);
    for (const course of req.body.course_id) {
        let query="insert into registration values("+req.body.id+",'"+course+"','"+req.body.term_id+"',NULL)";
        console.log(query);
        let query2="commit";
        try{
            const result=await connection.execute(query);
            console.log('Inserting ',result);
            const result2 = await connection.execute(query2);
            console.log('Commiting ',result2);
        }catch(e){
            console.log(e);
            res.send(e);
            break;
        }
    }
    res.status(200).send();
});