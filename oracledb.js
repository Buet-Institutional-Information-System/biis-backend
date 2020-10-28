//SETUP ORACLE /////////////////////////////////////////////////////////////////////////////////////////////
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
let databaseAuth={
    user          : "biis",
    password      : "biis",
    connectString : ""
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////
const initialize=async function(){
    try{
        const pool= await  oracledb.createPool(databaseAuth);
        const connection=await pool.getConnection();
        console.log("Connection to database established");
        return connection;
    }catch(err){
        console.log("Error ",err);
    }
}

exports.initialize=initialize;

