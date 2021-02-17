const connection = require('../database/dbPool');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');


exports.postSignIn = async (req, res, next) => {
    console.log("inside postSignIn");
    let query="select student_id,student_name,term_id,dept_id,(select lvl from academic_term a where a.term_id=s.term_id) lvl,(select trm from academic_term a where a.term_id=s.term_id) trm,(select sssn from academic_term a where a.term_id=s.term_id) sssn,hall_name,hall_status,ins_id,(select dept_name from departments d where d.dept_id=s.dept_id) dept_name from students s where student_id="+req.body.id;
    let query2="select psswrd from students where student_id="+req.body.id;
    try{
        const result2=await connection.query(query2);
        console.log("postSignIn result2: ",result2);
        let check=await  bcrypt.compare(req.body.password, result2[0].psswrd);
        console.log(check);
        if(!check){
            console.log("Password incorrect");
            return res.status(400).send({message:"Please enter valid id or password."});
        }
        const result=await connection.query(query);
        //console.log("The results found in query: ");
        //console.log(result);
        if(result.length!=0){
            const token = jwt.sign(
                {
                    id: result[0].student_id,
                    name: result[0].student_name
                },
                process.env.private_key,
            );
            result.token=token;
            console.log("postSignIn result: ",result);
            console.log("postSignIn result[0]: ",result[0]);
            let query3="update students set token='"+result.token+"' where student_id="+req.body.id;
            const result3=await connection.query(query3);
            let query4="commit";
            const result4=await connection.query(query4);
        }
        // console.log("returned rows from query: ",result.rows);
        return res.status(200).send({...result,message:"LogIn successful!"});

    }catch(e){
        console.log("postSignIn error: ",e);
        return res.status(400).send({...e,message:"Please enter valid id and passowrd."});
    }
}
exports.postLogOut=async(req,res,next)=>{
    console.log("inside postLogOut");
    let query="update students set token=null where student_id="+req.id;
    let query2="commit";
    try{
        const result=await connection.query(query);
        //console.log(result);
        const result2=await connection.query(query2);
        //console.log(result2);
        return res.status(200).send({message:"logout successful"});
    }catch(e) {
        console.log("postLogOut error: ", e);
        return res.status(400).send({...e, message: "LogOut Failed."});
    }

}
exports.getSignIn = async (req, res, next) => {
    console.log("inside getSignIn");
    //console.log("getSignIn req id: ",req.id);
    let query="select s.student_id,s.student_name,s.term_id,s.dept_id,(select lvl from academic_term a where a.term_id=s.term_id) lvl,(select trm from academic_term a where a.term_id=s.term_id) trm,(select sssn from academic_term a where a.term_id=s.term_id) sssn,s.hall_name,s.hall_status,s.ins_id,(select dept_name from departments d where d.dept_id=s.dept_id) dept_name from students s where student_id="+req.id;
    //console.log("getSignIn query: ",query);
    try{
        const result=await connection.query(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows);
        return res.status(200).send({...result,message:"Auto LogIn successful!"});
    }catch(e){
        console.log("getSignIn error: ",e);
        return res.status(400).send({...e,message:"Auto LogIn Failed."});
    }
}
exports.getAdviserInfo=async(req,res,next)=>{
    console.log("inside getAdviserInfo");
    let query="select ins_name,designation,(select dept_name from departments d where d.dept_id=i.dept_id) dept from instructors i where ins_id="+req.query.id;
    try{
        const result=await connection.query(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows.length);
        return res.status(200).send({...result,message:"Fetched Adviser Info succesfully!"});
    }catch(e){
        console.log("getAdviserInfo error: ",e);
        return res.status(400).send({...e,message:"Could not fetch Adviser Info."});
    }
}
exports.getContactInfo=async(req,res,next)=>{
    console.log("inside getContactInfo");
    let query="select mobile_number,email,contact_person_name,contact_person_number,address from students where student_id="+req.id;
    try{
        const result=await connection.query(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows.length);
        return res.status(200).send({...result,message:"Fetched Contact Info succesfully!"});
    }catch(e){
        console.log("getContactInfo error: ",e);
        return res.status(400).send({...e,message:"Could not fetch Contact Info."});
    }
};
exports.patchEditInfo=async(req,res,next)=>{
    console.log("inside patchEditInfo");
    let query="update students set mobile_number='"+req.body.phone+"',email='"+req.body.email+"',contact_person_name='"+req.body.contact_person_name+"',contact_person_number='"+req.body.contact_person_number+"',address='"+req.body.address+"' where student_id="+req.id;
    let query2="commit";
    let query3="select mobile_number,email,contact_person_name,contact_person_number,address from students where student_id="+req.id;
    try{
        const result=await connection.query(query);
        //console.log('Updating ',result);
        const result2 = await connection.query(query2);
        //console.log('Commiting ',result2);
        const result3=await connection.query(query3);
        //console.log("The results found in query: ");
        //console.log(result3.rows[0]);
        //console.log("returned rows from query3: ",result3.rows.length);
        return res.status(200).send({...result3,message:"Updated contact info successfully!"});
    }catch(e){
        console.log("patchEditInfo error: ",e);
        return res.status(400).send({...e,message:"Contact info update failed."});
    }
}
exports.patchPassword=async(req,res,next)=>{
    console.log("inside patchPassword");
    req.body.newpassword=await bcrypt.hash(req.body.newpassword, 12);
    let query="update students set psswrd='"+req.body.newpassword+"' where student_id="+req.id;
    let query2="commit";
    let query3="select psswrd from students where student_id="+req.id;
    try{
        const result3=await connection.query(query3);
        let check=await bcrypt.compare(req.body.password, result3[0].psswrd);
        if(!check){
            return res.status(400).send();
        }
        //console.log("The results found in query: ");
        //console.log(result3);
        const result=await connection.query(query);
        //console.log("The results found in query: ");
        //console.log(result);
        const result2 = await connection.query(query2);
        //console.log(result2);
        //console.log("returned rows from query2: ",result2.rows);
        return res.status(200).send({...result3,message:"Password updated successfully!"});
    }catch(e){
        console.log("patchPassword error: ",e);
        return res.status(400).send({...e,message:"Password update failed."});
    }
};
exports.getViewGrade=async(req,res,next)=>{
    console.log("inside getViewGrade");
    let query="select distinct(term_id) from registration where student_id="+req.id+" and obtained_grade_point is not null and published=1 order by term_id asc";
    try{
        const result=await connection.query(query);
        //console.log("The results found in query: ",result);
        result.forEach((row,index)=>{
            //console.log(row,index)
            result[index]=row.term_id;
        });
        //console.log("The results found in query: ",result);
        // result.rows.sort();
        //console.log(result.rows);
        //console.log("returned rows from query: ",result.rows.length);
        return res.status(200).send({...result,message:"View Grade loaded successfully!"});
    }catch(e){
        console.log("getViewGrade error: ",e);
        return res.status(400).send({...e,message:"Could not fetch View Grade."});
    }
};
exports.getShowGrade=async(req,res,next)=> {
    console.log("inside getShowGrade");
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour,(select grade from grades g where g.grade_point=r.obtained_grade_point) obtained_grade,obtained_grade_point from registration r where student_id="+req.id+" and term_id='"+req.query.term_id+"'";
    let query2="select  sum(c.credit_hour) registered_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.term_id='"+req.query.term_id+"'";
    let query3="select  sum(c.credit_hour) earned_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.term_id='"+req.query.term_id+"' and r.obtained_grade_point<>0";
    let query4="select  sum(c.credit_hour) total_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.obtained_grade_point<>0";
    let query5="select  sum(c.credit_hour*r.obtained_grade_point) gpa  from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.term_id='"+req.query.term_id+"'";
    let query6="select  sum(c.credit_hour*r.obtained_grade_point) cgpa  from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id;
    try{
        const result=await connection.query(query);
        //console.log("The results found in query: ");
        //console.log(result);
        //console.log("returned rows from query: ",result.rows.length);
        const result2=await connection.query(query2);
        //console.log(result2.rows[0].REGISTERED_CREDIT_HOURS);
        result.registered_credit_hours=result2[0].registered_credit_hours;
        const result3=await connection.query(query3);
        //console.log(result3.rows[0].EARNED_CREDIT_HOURS);
        result.earned_credit_hours=result3[0].earned_credit_hours;
        const result4=await connection.query(query4);
        //console.log(result4.rows[0].TOTAL_CREDIT_HOURS);
        result.total_credit_hours=result4[0].total_credit_hours;
        const result5=await connection.query(query5);
        //console.log(result5.rows[0].GPA);
        result.gpa=result5[0].gpa/result.earned_credit_hours;
        //console.log(result.gpa);
        const result6=await connection.query(query6);
        //console.log(result6.rows[0].CGPA);
        result.cgpa=result6[0].cgpa/result.total_credit_hours;
        //console.log(result.cgpa);
        return res.status(200).send({...result,message:"Show Grade loaded successfully!"});
    }catch(e){
        console.log("getShowGrade error: ",e);
        return res.status(400).send({...e,message:"Could not fetch Show Grade."});
    }
};
exports.getRegistration=async(req,res,next)=> {
    console.log("getRegistration req.params: ",req.params);
    console.log("inside getRegistration");
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour from registration r where student_id="+req.id+" and term_id='"+req.query.term_id+"'";
    try{
        const result=await connection.query(query);
        //console.log("returned rows from query: ",result.length);

        if(result.length===0)
        {
            let query2="select course_id,(select course_title from courses c where c.course_id=t.course_id) course_title,(select credit_hour from courses c where c.course_id=t.course_id) credit_hour from courseinterm t where term_id='"+req.query.term_id+"' and available_dept='"+req.query.available_dept+"'";
            const result2=await connection.query(query2);
            //console.log("The results found in query: ");
            result2.registration=true;
            //console.log(result2);
            let query3="select sum(c.credit_hour) total_credit_hour from courses c join courseinterm  t on(c.course_id=t.course_id) where t.term_id='"+req.query.term_id+"' and available_dept='"+req.query.available_dept+"'";
            //console.log(query3);
            const result3=await connection.query(query3);
            //console.log(result3[0].total_credit_hour);
            result2.total_credit_hour=result3[0].total_credit_hour;
            console.log("getRegistration result2: ",result2);
            return res.send({...result2});
        }
        //console.log("The results found in query: ");
        result.registration=false;
        //console.log(result);
        return res.status(200).send({...result,message:"Registration loaded successfully!"});
    }catch(e){
        console.log("getRegistration error: ",e);
        return res.status(400).send({...e,message:"Could not fetch Registration."});
    }
};
exports.getRegistrationApproval=async(req,res,next)=> {
    console.log("inside getRegistrationApproval");
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour from registration r where student_id="+req.id+" and term_id='"+req.query.term_id+"'";
    let query2="select  sum(c.credit_hour) registered_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.term_id='"+req.query.term_id+"'";
    let query3="select  sum(c.credit_hour) credit_hours_earned from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+req.id+" and r.term_id<>'"+req.query.term_id+"' and r.obtained_grade_point<>0";
    try{
        const result=await connection.query(query);
        console.log("returned result from query: ",result.length);
        console.log("The results found in query: ");
        console.log(result);
        const result2=await connection.query(query2);
        console.log(result2[0].registered_credit_hours);
        result.registered_credit_hours=result2[0].registered_credit_hours;
        const result3=await connection.query(query3);
        console.log(result3[0].credit_hours_earned);
        result.credit_hours_earned=result3[0].credit_hours_earned;
        return res.status(200).send({...result,message:"Registration Approval loaded successfully!"});
    }catch(e){
        console.log("getRegistrationApproval error: ",e);
        return res.status(400).send({...e,message:"Could not fetch Registration Approval."});
    }
};
exports.postInsertRegistration=async(req,res,next)=> {
    console.log("inside postInsertRegistration req:",req.body);
    for (const course of req.body.course_id) {
        let query = "insert into registration values(" + req.id + ",'" + course + "','" + req.body.term_id + "',NULL,0)";
        //console.log(query);
        let query2 = "commit";
        try {
            const result = await connection.query(query);
            console.log('Inserting ', result);
            const result2 = await connection.query(query2);
            console.log('Commiting ', result2);
        } catch (e) {
            console.log("postInsertRegistration error: ",e);
            return res.status(400).send({...e,message:"Sorry! registration failed."});
        }
    }
    return res.status(200).send({message:"You have successfully registered!"});
};