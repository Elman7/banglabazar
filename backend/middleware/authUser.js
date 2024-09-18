const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()

const fetchUser = (req, res, next) => {
    
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).send("Access Denied" )
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.status(400).send( "Access Denied" )

    }


}

module.exports = fetchUser