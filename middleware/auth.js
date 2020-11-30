const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.body.token || req.query.token;
    //console.log('token: ',token);
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token, 'biis');
        if (!decodedToken) {
            return res.status(400).send("Not authenticated");
        }
        req.id = decodedToken.id;
        next();
    } catch (e) {
        res.status(400).send("error");
    }

};
