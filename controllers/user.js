const oracledb = require('oracledb');
const database = require('../database/dbPool').database;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
let connection;
const initialize=async function(){
    try{
        await database();
        connection=await oracledb.getConnection();
    }
    catch(e)
    {
        console.log("error user");
    }
}
initialize();
exports.postSignIn = async (req, res, next) => {
    console.log("inside postSignIn");
    let query="select student_id,student_name,term_id,dept_id,(select lvl from academic_term a where a.term_id=s.term_id) lvl,(select trm from academic_term a where a.term_id=s.term_id) trm,(select sssn from academic_term a where a.term_id=s.term_id) sssn,hall_name,hall_status,ins_id,(select dept_name from departments d where d.dept_id=s.dept_id) dept_name from students s where student_id="+req.body.id;
    let query2="select psswrd from students where student_id="+req.body.id;
    try{
        const result2=await connection.execute(query2);
        console.log(result2);
        let check=await  bcrypt.compare(req.body.password, result2.rows[0].PSSWRD);
        //console.log(check);
        if(!check){
            console.log("Password incorrect");
            return res.status(400).send();
        }
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        //console.log(result);
        if(result.rows.length!=0){
            const token = jwt.sign(
                {
                    id: result.rows[0].STUDENT_ID,
                    name: result.rows[0].STUDENT_NAME
                },
                'biis',
            );
            result.token=token;
            //console.log("token: ",token);
            let query3="update students set token='"+result.token+"' where student_id="+req.body.id;
            const result3=await connection.execute(query3);
           // console.log(result3)
            let query4="commit";
            const result4=await connection.execute(query4);
            //console.log(result4);
        }
        //console.log("returned rows from query: ",result.rows);
        res.send(result);
    }catch(e){
        console.log("postSignIn error: ",e);
        res.send(e);
    }
}
exports.postLogOut=async(req,res,next)=>{
    console.log("inside postLogOut");
    let query="update students set token=null where student_id="+req.id;
    let query2="commit";
    try{
        const result=await connection.execute(query);
        //console.log(result);
        const result2=await connection.execute(query2);
        //console.log(result2);

        res.status(200).send("logout");
        console.log("logout successful");
    }catch(e){
        console.log("postLogOut error: ",e);
        res.send(e);
    }finally{

    }

}
exports.getSignIn = async (req, res, next) => {
    console.log("inside getSignIn");
    let query="select student_id,student_name,term_id,dept_id,(select lvl from academic_term a where a.term_id=s.term_id) lvl,(select trm from academic_term a where a.term_id=s.term_id) trm,(select sssn from academic_term a where a.term_id=s.term_id) sssn,hall_name,hall_status,ins_id,(select dept_name from departments d where d.dept_id=s.dept_id) dept_name from students s where student_id="+req.id;
    try{
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows);
        res.send(result);
    }catch(e){
        console.log("getSignIn error: ",e);
        res.send(e);
    }
}
exports.getAdviserInfo=async(req,res,next)=>{
    console.log("inside getAdviserInfo");
    let query="select ins_name,designation,(select dept_name from departments d where d.dept_id=i.dept_id) dept from instructors i where ins_id="+req.query.id;
    try{
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows.length);
        res.send(result);
    }catch(e){
        console.log("getAdviserInfo error: ",e);
        res.send(e);
    }
}
exports.getContactInfo=async(req,res,next)=>{
    console.log("inside getContactInfo");
    let query="select mobile_number,email,contact_person_name,contact_person_number,address from students where student_id="+req.id;
    try{
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows.length);
        res.send(result);
    }catch(e){
        console.log("getContactInfo error: ",e);
        res.send(e);
    }
};
exports.patchEditInfo=async(req,res,next)=>{
    console.log("inside patchEditInfo");
    let query="update students set mobile_number='"+req.body.phone+"',email='"+req.body.email+"',contact_person_name='"+req.body.contact_person_name+"',contact_person_number='"+req.body.contact_person_number+"',address='"+req.body.address+"' where student_id="+req.id;
    let query2="commit";
    let query3="select mobile_number,email,contact_person_name,contact_person_number,address from students where student_id="+req.body.id;
    try{
        const result=await connection.execute(query);
        //console.log('Updating ',result);
        const result2 = await connection.execute(query2);
        //console.log('Commiting ',result2);
        const result3=await connection.execute(query3);
        //console.log("The results found in query: ");
        //console.log(result3.rows[0]);
        //console.log("returned rows from query3: ",result3.rows.length);
        res.send(result3);
    }catch(e){
        console.log("patchEditInfo error: ",e);
        res.send(e);
    }
}
exports.patchPassword=async(req,res,next)=>{
    console.log("inside patchPassword");
    req.body.newpassword=await bcrypt.hash(req.body.newpassword, 12);
    let query="update students set psswrd='"+req.body.newpassword+"' where student_id="+req.id;
    let query2="commit";
    let query3="select psswrd from students where student_id="+req.id;
    try{
        const result3=await connection.execute(query3);
        let check=await bcrypt.compare(req.body.password, result3.rows[0].PSSWRD);
        if(!check){
            return res.status(400).send();
        }
        //console.log("The results found in query: ");
        //console.log(result3);
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        //console.log(result);
        const result2 = await connection.execute(query2);
        //console.log(result2);
        //console.log("returned rows from query2: ",result2.rows);
        res.send(result3);
    }catch(e){
        console.log("patchPassword error: ",e);
        res.send(e);
    }
};
exports.getViewGrade=async(req,res,next)=>{
    console.log("inside getViewGrade");
    let query="select distinct(term_id) from registration where student_id="+req.id+"and obtained_grade_point is not NULL and published=1 order by term_id asc";
    try{
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        result.rows.forEach((row,index)=>{
            result.rows[index]=row.TERM_ID;
        });/*
        result.rows.sort();*/
        //console.log(result.rows);
        //console.log("returned rows from query: ",result.rows.length);
        res.send(result);
    }catch(e){
        console.log("getViewGrade error: ",e);
        res.send(e);
    }
};
exports.getShowGrade=async(req,res,next)=> {
    console.log("inside getShowGrade");
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour,(select grade from grades g where g.grade_point=r.obtained_grade_point) obtained_grade,obtained_grade_point from registration r where student_id="+req.id+"and term_id='"+req.query.term_id+"'";
    let query2="select  sum(c.credit_hour) registered_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+"and r.term_id='"+req.query.term_id+"'";
    let query3="select  sum(c.credit_hour) earned_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+"and r.term_id='"+req.query.term_id+"' and r.obtained_grade_point<>0";
    let query4="select  sum(c.credit_hour) total_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.obtained_grade_point<>0";
    let query5="select  sum(c.credit_hour*r.obtained_grade_point) gpa  from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+"and r.term_id='"+req.query.term_id+"'";
    let query6="select  sum(c.credit_hour*r.obtained_grade_point) cgpa  from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id;
    try{
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows.length);
        const result2=await connection.execute(query2);
        //console.log(result2.rows[0].REGISTERED_CREDIT_HOURS);
        result.registered_credit_hours=result2.rows[0].REGISTERED_CREDIT_HOURS;
        const result3=await connection.execute(query3);
        //console.log(result3.rows[0].EARNED_CREDIT_HOURS);
        result.earned_credit_hours=result3.rows[0].EARNED_CREDIT_HOURS;
        const result4=await connection.execute(query4);
        //console.log(result4.rows[0].TOTAL_CREDIT_HOURS);
        result.total_credit_hours=result4.rows[0].TOTAL_CREDIT_HOURS;
        const result5=await connection.execute(query5);
        //console.log(result5.rows[0].GPA);
        result.gpa=result5.rows[0].GPA/result.earned_credit_hours;
        //console.log(result.gpa);
        const result6=await connection.execute(query6);
        //console.log(result6.rows[0].CGPA);
        result.cgpa=result6.rows[0].CGPA/result.total_credit_hours;
        //console.log(result.cgpa);
        res.send(result);
    }catch(e){
        console.log("getShowGrade error: ",e);
        res.send(e);
    }
};
exports.getRegistration=async(req,res,next)=> {
    console.log("inside getRegistration");
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour from registration r where student_id="+req.id+"and term_id='"+req.query.term_id+"'";
    try{
        const result=await connection.execute(query);
        //console.log("returned rows from query: ",result.rows.length);

        if(result.rows.length==0)
        {

            let query2="select course_id,(select course_title from courses c where c.course_id=t.course_id) course_title,(select credit_hour from courses c where c.course_id=t.course_id) credit_hour from courseinterm t where term_id='"+req.query.term_id+"' and available_dept='"+req.query.available_dept+"'";
            const result2=await connection.execute(query2);
            //console.log("The results found in query: ");
            result2.registration=true;
            //console.log(result2);
            let query3="select sum(c.credit_hour) total_credit_hour from courses c join courseinterm  t on(c.course_id=t.course_id) where t.term_id='"+req.query.term_id+"' and available_dept='"+req.query.available_dept+"'";
            //console.log(query3);
            const result3=await connection.execute(query3);
            //console.log(result3.rows[0].TOTAL_CREDIT_HOUR);
            result2.total_credit_hour=result3.rows[0].TOTAL_CREDIT_HOUR;
            return res.send(result2);
        }
        //console.log("The results found in query: ");
        result.registration=false;
        //console.log(result);
        res.send(result);
    }catch(e){
        console.log("getRegistration error: ",e);
        res.send(e);
    }
};
exports.getRegistrationApproval=async(req,res,next)=> {
    console.log("inside getRegistrationApproval");
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour from registration r where student_id="+req.id+"and term_id='"+req.query.term_id+"'";
    let query2="select  sum(c.credit_hour) registered_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+"and r.term_id='"+req.query.term_id+"'";
    let query3="select  sum(c.credit_hour) credit_hours_earned from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.term_id<>'"+req.query.term_id+"'and r.obtained_grade_point<>0";
    try{
        const result=await connection.execute(query);
        //console.log("returned rows from query: ",result.rows.length);
        //console.log("The results found in query: ");
        //console.log(result);
        const result2=await connection.execute(query2);
        //console.log(result2.rows[0].REGISTERED_CREDIT_HOURS);
        result.registered_credit_hours=result2.rows[0].REGISTERED_CREDIT_HOURS;
        const result3=await connection.execute(query3);
        //console.log(result3.rows[0].CREDIT_HOURS_EARNED);
        result.credit_hours_earned=result3.rows[0].CREDIT_HOURS_EARNED;
        res.send(result);
    }catch(e){
        console.log("getRegistrationApproval error: ",e);
        res.send(e);
    }
};
exports.postInsertRegistration=async(req,res,next)=> {
    console.log("inside postInsertRegistration");
    for (const course of req.body.course_id) {
        let query = "insert into registration values(" + req.id + ",'" + course + "','" + req.body.term_id + "',NULL,0)";
        //console.log(query);
        let query2 = "commit";
        try {
            const result = await connection.execute(query);
            //console.log('Inserting ', result);
            const result2 = await connection.execute(query2);
            //console.log('Commiting ', result2);
            res.status(200).send();
        } catch (e) {
            console.log("postInsertRegistration error: ",e);
            res.send(e);
        }
    }
};