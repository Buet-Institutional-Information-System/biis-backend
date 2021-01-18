const oracledb = require('oracledb');
const database = require('../database/dbPool').database;
const jwt = require('jsonwebtoken');
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
module.exports = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.params.token;
    //console.log('token: ',token);
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token, 'biis');
        if (!decodedToken) {
            return res.status(400).send("Not authenticated");
        }
        let query="select student_id from students where token='"+token+"'";
        const result=await connection.execute(query);
        console.log('token id: ',decodedToken.id);
        console.log('database id: ',result.rows[0].STUDENT_ID);
        if(decodedToken.id!==result.rows[0].STUDENT_ID){
            return res.status(400).send("User didn't authenticated");
        }
        req.id = decodedToken.id;
        next();
    } catch (e) {
        res.status(400).send("error");
    }

};
