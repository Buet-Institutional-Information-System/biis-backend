const oracle=require('./oracledb');

let connection;
let begin = async()=>{
    connection = await oracle.initialize();
}
begin();

exports.signIn = async (id,password)=>{
    let query="select student_id,psswrd,student_name,term_id,dept_id,(select lvl from academic_term a where a.term_id=s.term_id) lvl,(select trm from academic_term a where a.term_id=s.term_id) trm,(select sssn from academic_term a where a.term_id=s.term_id) sssn,hall_name,hall_status,ins_id,(select dept_name from departments d where d.dept_id=s.dept_id) dept_name from students s where student_id="+id+" and psswrd='"+password+"'";
    //console.log(query);
    try{
        const result=await connection.execute(query);
        //console.log("The results found in query: ");
        // console.log(result);
        //console.log("returned rows from query: ",result.rows.length);
        return result;
    }catch(e){
        //console.log("Error occured: ",e);
        return e;
    }
}

// module.exports={
//     signIn
// }