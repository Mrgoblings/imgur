require('dotenv').config();

import { PrismaClient, States } from '@prisma/client';
import express from "express"
const app = express();
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());


const bcrypt = require("bcrypt");

const Mail = require("./mail.js");
const mail = new Mail();

const Token = require("./token.js");
const token = new Token();

const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

const cors = require('cors');
app.use(cors());


//* 3.login to create jwt token
app.post('/login', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        return res.status(400).json({
          success: false,
          error: 'Email or username is required.',
        });
    }

    let account;
    

    if (email) {
        account = await prisma.account.findFirst({
            where: { email },
        });
    } else if (username) {
        account = await prisma.account.findFirst({
            where: { username },
        });
    }

    if (!account) {
        return res.status(404).json({
            success: false,
            error: 'Account not found.',
        });
    }

    if (!account.refreshToken) {
        //! 15 mins to confirm mail
        const accessToken = token.generateWeb({ username: username }, "15m");
        mail.sendConfirmationMail(email, `${process.env.CLIENT_URL}/activate/index.html?${accessToken}`);

        return res.status(403).json({
            success: false,
            error: 'Account not active. Sending email to validate',
        });
    }


    //* validate password
    try{
        if (! await bcrypt.compare(password, account.password)) {
            return res.sendStatus(403);
        }
    } catch {
        return res.sendStatus(500);
    }

    //* add the current IP if it has not been seen before
    try{
        const ipAddress = (req.header('x-forwarded-for') || req.socket.remoteAddress || "");
        await prisma.ipSeen.create({
            data: {
                ip: ipAddress,
                accountId: account.id,
            }
        });
    } catch {};

        //? process.env is type "string | undefined" ...?
    res.cookie(process.env.COOKIE_ACCESS_TOKEN_KEY || "", token.generateWeb({ username: account.username }, process.env.ACCESS_TOKEN_EXPIRES_IN), {httpOnly: true});
    res.cookie(process.env.COOKIE_ACCESS_TOKEN_KEY || "", token.generateWeb({ username: account.username }, process.env.ACCESS_TOKEN_EXPIRES_IN), {httpOnly: true});
    res.cookie("isLogged", true);
    return res.sendStatus(200);

});


app.post('/token', async (req, res) => {
    const refreshToken = req.body.token; 
    if(!refreshToken) return res.sendStatus(401);


    let account = await prisma.account.findFirst({
        where: { refreshToken },
    });

    if(!account) return res.sendStatus(401);

    await jwt.verify(refreshToken, process.env.RESET_TOKEN_SECRET, (err:any, user:any) => {
        if(err) return res.sendStatus(403);
        
            //? process.env is type "string | undefined" ...?
        res.cookie(process.env.COOKIE_ACCESS_TOKEN_KEY || "", token.generateWeb({ username: user.username }, process.env.ACCESS_TOKEN_EXPIRES_IN), {httpOnly: true});
        res.cookie("isLogged", true);
        
        return res.sendStatus(200);
    });
});


app.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token; 

    if(!refreshToken) return res.sendStatus(401);

    const account = await prisma.account.update({
        where: { refreshToken },
        data: { refreshToken: "" },
    });
    
    if(!account) return res.sendStatus(403);
    
    res.cookie("isLogged", false);
    return res.sendStatus(204);
});



app.post('/resetPassword', token.authenticate, async (req, res) => {
    const { email, username } = req.body;

    if (!email && !username) {
        return res.status(400).json({
          success: false,
          error: 'Email or username is required.',
        });
    }

    let account;

    if (email) {

        await prisma.account.update({
            where: { email },
            data: { refreshToken: "" },
        });

        await prisma.account.update({
            where: { username },
            data: { refreshToken: "" },
        });

        account = await prisma.account.findFirst({
            where: { email },
        });
    } else if (username) {
        account = await prisma.account.findFirst({
            where: { username },
        });
    }

    if (!account) {
        return res.status(404).json({
            success: false,
            error: 'Account not found.',
        });
    }

    //! 15 mins to confirm mail
    const accessToken = token.generateWeb({ username: account.username }, "15m");
    mail.sendConfirmationMail(email, `http://localhost:4000/accounts/resetPassword/${accessToken}`);
});



//* signup
app.post('/signup', async (req, res) => {
    const { email, username, displayName, password } = req.body;
    
    try {
        // Perform parameter validation
        if (!email || !username || !displayName || !password) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters.',
            });
        }
        
        // Check if email or username already exists
        const existingAccount = await prisma.account.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        if (existingAccount) {
            return res.status(409).json({
                success: false,
                error: 'Email or username already exists.',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the account
        const account = await prisma.account.create({
            data: {
                email,
                username,
                displayName,
                password: hashedPassword,
            }
        });

        //! 15 mins to confirm mail
        const accessToken = token.generateWeb({ username: username }, "15m");
        mail.sendConfirmationMail(email, `${process.env.CLIENT_URL}/activate/index.html?${accessToken}`);

        // Record IP address
        const ipAddress = (req.header('x-forwarded-for') || req.socket.remoteAddress || "");
        await prisma.ipSeen.create({
            data: {
                ip: ipAddress,
                accountId: account.id,
            }
        });

        return res.status(200).json({
            success: true
        });

    } catch(error) {
        console.error('Error creating account:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create account.',
        });
    }
});




app.get('/accounts/activate/:activationToken', async (req, res) => {
    const { activationToken } = req.params;

    console.log("activationToken: ", activationToken);
    
    try {
        const user = await jwt.verify(activationToken, process.env.ACCESS_TOKEN_SECRET);
        
        const refreshToken = token.generateRefresh({ username: user.username });
        await prisma.account.update({
            where: { username: user.username },
            data: { refreshToken },
        });

        res.cookie(
            process.env.COOKIE_REFRESH_TOKEN_KEY || "refresh_jwt", 
            refreshToken, 
            { path: '/activate' }
        );

        res.cookie(
            process.env.COOKIE_ACCESS_TOKEN_KEY || "access_jwt", 
            token.generateWeb({ username: user.username }, process.env.ACCESS_TOKEN_EXPIRES_IN)
        );
        
        return res.status(200);

    } catch (error) {
        console.error('Error verifying activation token:', error);
        if (error instanceof jwt.JsonWebTokenError) {
          return res.sendStatus(401);
        } else if (error instanceof jwt.TokenExpiredError) {
          return res.status(400).json({
            success: false,
            error: 'Activation token has expired.',
          });
        } else {
          return res.status(500).json({
            success: false,
            error: 'Failed to update account.',
          });
        }
      }
});




//* default
app.use((req, res, next) => {
    res.status(404);
    return res.json({
        success: false,
        payload: null,
        message: `API SAYS: Endpoint not found for path: ${req.path}`,
    });
});


app.listen(4000, () =>
    console.log('REST API server ready at: http://localhost:4000'),
);
