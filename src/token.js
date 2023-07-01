require('dotenv').config();

const jwt = require("jsonwebtoken");


class Token {
    async authenticate(req, res, next) {
        let token;

        //* Check if token is in the authorization header
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        //* If token not found in authorization header, check cookies
        if (!token) {
            token = req.cookies.jwtToken;
        }

        if (!token) {
            return res.sendStatus(401);
        }

        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    }

    generateRefresh(user) {
        return jwt.sign(user, process.env.RESET_TOKEN_SECRET);
    }

    generateWeb(user, expires) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: expires
        });
    }
};

module.exports = Token;