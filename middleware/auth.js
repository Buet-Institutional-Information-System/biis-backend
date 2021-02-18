const connection = require('../database/dbPool');
const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.params.token;
    //console.log('token: ',token);
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decodedToken) {
            return res.status(400).send("Not authenticated");
        }
        let query="select student_id from students where token='"+token+"'";
        const result=await connection.query(query);
        //console.log("auth result: ",result);
        //console.log('token id: ',decodedToken.id);
        //console.log('database id: ',result[0].student_id);
        if(decodedToken.id!==result[0].student_id){
            return res.status(400).send("User didn't authenticated.");
        }
        req.id = decodedToken.id;
        next();
        //console.log("auth authentication done");
    } catch (e) {
        return res.status(400).send({...e,"message":"Invalid Authentication"});
    }

};
