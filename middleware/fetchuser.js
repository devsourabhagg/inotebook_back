const jwt = require('jsonwebtoken');
const JWT_SECRET = 'f464495afd6ef3e42b642420cad6ba6c';


const fetchuser = (req, res, next) => {
    //Get the user from jwt object and add id to req object

    const token = req.header('Authorization');
    if (!token) {
        res.status(401).send({ error: 'Please authenticate with valid token' });
    }
    try {
        console.log(`this is the value of token ${token}`);

        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    }
    catch (e) {
        console.log(`Error in middleware - ${e.message}`);
    }

}

module.exports = fetchuser;