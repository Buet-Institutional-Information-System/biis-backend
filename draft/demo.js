const connection = require('../database/dbPool');

const signIn = async function() {
    let query2 = "select psswrd from students where student_id=" +1505050;
    try {
        const result2 = await connection.query(query2);
        console.log(result2);
    } catch (e) {
        console.log(e);
    }
}

signIn();

