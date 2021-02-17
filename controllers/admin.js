// const oracledb = require('oracledb');
const connection = require('../database/dbPool');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs=require('fs');
const connect=require('../database/dbPool');
const clearImage= filePath => {
    //filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
exports.postStudent=async(req,res,next)=>{
    console.log("inside postStudent");
    req.body.password=await bcrypt.hash(req.body.password, 12);
    //console.log(req.body.password);
    let query="insert into students values("+req.body.id+",'"+req.body.name+"','"+req.body.dept+"','"+req.body.term_id+"',"+req.body.ins+",'"+req.body.hall+"','"+req.body.hallStatus+"','N/A','N/A','N/A','N/A','N/A','"+req.body.password+"',null)";
    console.log(query);
    let query2="commit";
    try{
        const result=await connection.query(query);
        //console.log('insert ',result);
        const result2=await connection.query(query2);
        //console.log(result2);
        return res.status(200).send({message:"Insertion done!"});
    }catch(e){
        console.log("postStudent error: ",e);
        return res.status(400).send({...e,message:"Insertion failed."});
    }
}
exports.patchUpdateGrade=async(req,res,next)=>{
    console.log("inside patchUpdateGrade");
    let query="update registration set obtained_grade_point="+req.body.grade+" where student_id="+req.body.id+" and term_id='"+req.body.term_id+"' and course_id='"+req.body.course_id+"'";
    let query2="commit";
    try{
        const result=await connection.query(query);
        //console.log(result);
        const result2=await connection.query(query2);
        //console.log(result2);
        return res.status(200).send({message:"Update done!"});
    }catch(e){
        console.log("patchUpdateGrade error: ",e);
        return res.status(400).send({...e,message:"Update failed."});
    }
}
exports.patchUpdatePublish=async(req,res,next)=>{
    console.log("inside patchUpdatePublish");
    let query="update registration set obtained_grade_point=0  where obtained_grade_point is null";
    let query3="update registration set published=1";
    let query2="commit";
    try{
        const result=await connection.query(query);
        //console.log(result);
        const result3=await connection.query(query3);
        //console.log(result3);
        const result2=await connection.query(query2);
        //console.log(result2);
        return res.status(200).send({message:"Published!"});
    }catch(e){
        console.log("patchUpdatePublish error:",e);
        return res.status(400).send({...e,message:"Publish failed."});
    }
}
exports.deleteStudent=async(req,res,next)=>{
    console.log("inside deleteStudent");
    let query="delete from registration where student_id="+req.body.id;
    let query2="delete from students where student_id="+req.body.id;
    let query3="commit";
    try{
        const result=await connection.query(query);
        //console.log('delete ',result);
        const result2=await connection.query(query2);
        //console.log(result2);
        const filePath=path.join(__dirname, '..','images','student',req.body.id.toString()+'.jpg')
        clearImage(filePath);
        const result3=await connection.query(query3);
        //console.log(result3);
        return res.status(200).send({message:"Deletion done!"});
    }catch(e){
        console.log("deleteStudent error:",e);
        return res.status(400).send({...e,message:"Deletion failed."});
    }
}
exports.postTeacher=async(req,res,next)=>{
    console.log("inside postTeacher");
    let query="insert into instructors values("+req.body.id+",'"+req.body.name+"','"+req.body.dept+"','"+req.body.designation+"')";
    let query2="commit";
    try{
        const result=await connection.query(query);
        //console.log('insert ',result);
        const result2=await connection.query(query2);
        //console.log(result2);
        return res.status(200).send({message:"Insertion done!"});
    }catch(e){
        console.log("postTeacher error:",e);
        return res.status(400).send({...e,message:"Insertion failed."});
    }
}
exports.patchUpdateDesignation=async(req,res,next)=>{
    console.log("inside patchUpdateDesignation");
    let query="update instructors set designation='"+req.body.designation+"' where ins_id="+req.body.id;
    let query2="commit"
    try{
        const result=await connection.query(query);
        //console.log(result);
        const result2=await connection.query(query2);
        //console.log(result2);
        return res.status(200).send({message:"Update successful!"});
    }catch(e){
        console.log("patchUpdateDesignation error:",e);
        return res.status(400).send({...e,message:"Update failed."});
    }
}
exports.deleteTeacher=async(req,res,next)=>{
    console.log("inside deleteTeacher");
    console.log(req.body);
    let query="delete from instructors where ins_id="+req.body.id;
    let query2="commit";
    try{
        const result=await connection.query(query);
        //console.log('delete ',result);
        const result2=await connection.query(query2);
        //console.log(result2);
        const filePath=path.join(__dirname, '..','images','adviser',req.body.id.toString()+'.jpg')
        clearImage(filePath);
        return res.status(200).send({message:"Deletion successful!"});
    }catch(e){
        console.log("deleteTeacher error:",e);
        return res.status(400).send({...e,message:"Deletion failed."});
    }
}
exports.getEngDepts=async(req,res,next)=>{
    console.log("inside getEngDepts");
    let query="select dept_id from departments where dept_name like '%Engineering'"
    try{
        const result=await connection.query(query);
        // console.log(result);
        result.forEach((c,id)=> result[id]=c['dept_id']);
        result.sort();
        // console.log(result);
        return res.status(200).send(result);
    }catch(e){
        console.log("getEngDepts error:",e);
        return res.status(400).send({...e,message:"Could not fetch engineering dept."});
    }
}
exports.getDepts=async(req,res,next)=>{
    console.log("inside getDepts");
    let query="select dept_id from departments"
    try{
        const result=await connection.query(query);
        //console.log(result.rows.length);
        result.forEach((c,id)=> result[id]=c.dept_id);
        result.sort();
        return res.status(200).send(result);
    }catch(e){
        console.log("getDepts error:",e);
        return res.status(400).send({...e,message:"Could not fetch dept."});
    }
}
exports.getTerms=async(req,res,next)=>{
    console.log("inside getTerms");
    let query="select term_id from academic_term where term_id like '%/1-1' "
    try{
        let result=await connection.query(query);
        result.forEach((row,id)=> result[id]=row.term_id);
        result.sort().reverse();
        result=result.slice(0,4);
        //console.log(result.rows.length);
        console.log(result);
        return res.status(200).send(result);
    }catch(e){
        console.log("getTerms error:",e);
        return res.status(400).send({...e,message:"Could not fetch term."});
    }
}
