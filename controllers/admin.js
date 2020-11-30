const oracledb = require('oracledb');
const database = require('../database/dbPool').database;
const bcrypt = require('bcryptjs');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
let connection;
const initialize=async function(){
    try{
        await database();
        connection=await oracledb.getConnection();
    }
    catch(e)
    {
        console.log("error");
    }
}
initialize();
exports.postStudent=async(req,res,next)=>{
    req.body.password=await bcrypt.hash(req.body.password, 12);
    console.log(req.body.password);
    let query="insert into students values("+req.body.id+",'"+req.body.name+"','"+req.body.dept+"','"+req.body.term+"',"+req.body.ins+",'"+req.body.hall+"','"+req.body.hallStatus+"','N/A','N/A','N/A','N/A','N/A','"+req.body.password+"','N/A')";
    console.log(query);
    let query2="commit";
    try{
        const result=await connection.execute(query);
        console.log('insert ',result);
        const result2=await connection.execute(query2);
        console.log(result2);
        res.status(200).send();
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.patchUpdateGrade=async(req,res,next)=>{
    let query="update registration set obtained_grade_point="+req.body.grade+" where student_id="+req.body.id+" and term_id='"+req.body.term_id+"' and course_id='"+req.body.course_id+"'";
    let query2="commit";
    try{
        const result=await connection.execute(query);
        console.log(result);
        const result2=await connection.execute(query2);
        console.log(result2);
        res.status(200).send();
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.deleteStudent=async(req,res,next)=>{
    let query="delete from registration where student_id="+req.body.id;
    let query2="delete from students where student_id="+req.body.id;
    let query3="commit";
    //console.log(query);
    try{
        const result=await connection.execute(query);
        console.log('delete ',result);
        const result2=await connection.execute(query2);
        console.log(result2);
        const result3=await connection.execute(query3);
        console.log(result3);
        res.status(200).send();
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.postTeacher=async(req,res,next)=>{
    let query="insert into instructors values("+req.body.id+",'"+req.body.name+"','"+req.body.dept+"','"+req.body.designation+"','N/A')";
    console.log(query);
    let query2="commit";
    try{
        const result=await connection.execute(query);
        console.log('insert ',result);
        const result2=await connection.execute(query2);
        console.log(result2);
        res.status(200).send();
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.patchUpdateDesignation=async(req,res,next)=>{
    let query="update instructors set designation='"+req.body.designation+"' where ins_id="+req.body.id;
    let query2="commit"
    try{
        const result=await connection.execute(query);
        console.log(result);
        const result2=await connection.execute(query2);
        console.log(result2);
        res.status(200).send();
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.deleteTeacher=async(req,res,next)=>{
    console.log(req.body);
    let query="delete from instructors where ins_id="+req.body.id;
    let query2="commit";
    try{
        const result=await connection.execute(query);
        console.log('delete ',result);
        const result2=await connection.execute(query2);
        console.log(result2);
        res.status(200).send();
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.getEngDepts=async(req,res,next)=>{
    let query="select dept_id from departments where dept_name like '%Engineering'"
    try{
        const result=await connection.execute(query);
        console.log(result.rows.length);
        result.rows.forEach((c,id)=> result.rows[id]=c['DEPT_ID']);
        result.rows.sort();
        res.send(result.rows);
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.getDepts=async(req,res,next)=>{
    let query="select dept_id from departments"
    try{
        const result=await connection.execute(query);
        console.log(result.rows.length);
        result.rows.forEach((row,id)=> result.rows[id]=row.DEPT_ID);
        result.rows.sort();
        res.send(result.rows);
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
exports.getTerms=async(req,res,next)=>{
    let query="select term_id from academic_term where term_id like '%/1-1' "
    try{
        const result=await connection.execute(query);
        result.rows.forEach((row,id)=> result.rows[id]=row.TERM_ID);
        result.rows.sort().reverse();
        result.rows=result.rows.slice(0,4);
        console.log(result.rows.length);
        console.log(result.rows);
        res.send(result.rows);
    }catch(e){
        console.log(e);
        res.send(e);
    }
}
