require('dotenv').config();

const jwt = require("jsonwebtoken");


class Token {
    async authenticate(req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
    
        if(token == null) res.sendStatus(401);
    
        await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err)return res.sendStatus(403);
            req.user = user;
            next();
        })
    }

    generateRefresh(user) {
        return jwt.sign(user, process.env.RESET_TOKEN_SECRET);
    }

    generateWeb(user, expires) {
        return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: expires});
    }
};

module.exports = Token;
