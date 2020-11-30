const oracledb = require('oracledb');
const databaseAuth={
    user          : "biis",
    password      : "biis",
    connectString : ""
};
exports.database=async function() {
    try{
        await oracledb.createPool(databaseAuth);
        //console.log("connection created");
    }catch(e){
        console.log(e);
    }
}