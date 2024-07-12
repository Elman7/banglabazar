const dotenv = require('dotenv').config();

function checkOrigin(req, res, next) {
    const allowedOrigins = [process.env.FRONTEND_URL_1, process.env.FRONTEND_URL_2].filter(Boolean);
    const origin = req.headers.origin;

    console.log('Request Origin:', origin);
    console.log('Allowed Origins:', allowedOrigins);

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    } else {
        return res.status(403).json({ error: 'Forbidden' });
    }
}

module.exports = checkOrigin;
