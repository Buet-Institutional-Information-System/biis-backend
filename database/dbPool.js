// const oracledb = require('oracledb');
const mysql = require('mysql');
const util = require('util')

const databaseAuth = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};
let pool = mysql.createPool(databaseAuth);
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
});
// exports.database=async function() {
//     try{
//         await oracledb.createPool(databaseAuth);
//         //console.log("connection created");
//     }catch(e){
//         console.log(e);
//     }
// }
//
pool.query = util.promisify(pool.query);
module.exports=pool