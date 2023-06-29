require('dotenv').config();

import { PrismaClient, States } from '@prisma/client';
import express from "express"

const multer = require("multer");
const upload = multer({ dest: "../uploads/" });

import { ReadStream } from 'fs';


const Token = require("./tokenFunctions.js")


const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");
const tokenf = new Token();



//* 3.login to create jwt token
app.post('/login', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        return res.status(400).json({
          success: false,
          error: 'Email or username is required.',
        });
    }

    let account = {id: 7, userName: "pesho", password: "1234"};
    
    /* 
        ! FOR NOW
    if (email) {
        account = await prisma.account.findFirst({
            where: { email },
        });
    } else if (userName) {
        account = await prisma.account.findFirst({
            where: { userName },
        });
    }

    if (!account) {
        return res.status(404).json({
            success: false,
            error: 'Account not found.',
        });
    } */


    // TODO: Validate password


    const accessToken = generateAccessToken( { userName: account.userName  });
    const refreshToken = jwt.sign( { id: account.id, userName: account.userName  }, process.env.RESET_TOKEN_SECRET)


    return res.json({
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken
    });

});


app.post('/token', async (req, res) => {
    console.log("ha");
    const refreshToken = req.body.token; 
    if(refreshToken == null) return res.sendStatus(401);


    // let account = await prisma.account.findFirst({
    //     where: { refreshToken },
    // });

    // if(!account) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.RESET_TOKEN_SECRET, (err:any, user:any) => {
        if(err) res.sendStatus(403);
        const accessToken = generateAccessToken({ username: user.username });
        res.json({accessToken: accessToken});
    });
});


app.delete('/logout/', async (req, res) => {
    const refreshToken = req.body.token; 

    if(!refreshToken) return res.sendStatus(401);

    const account = await prisma.account.update({
        where: { refreshToken },
        data: { isActive: 1 },
    });

    if(!account) return res.sendStatus(403);
    
    return res.sendStatus(204);
});


//* 4. Fetch account data trough a web token. 
//* If it doesnt exist make him login. 
//* If a unique token is missing make him confirm mail.
app.post('/login/:accessToken', async (req, res) => {

})



//*5 signup
app.post('/signup', async (req, res) => {
    try {

        const { email, userName, displayName, password } = req.body;
        
        //* DB stuff here
        let createdAt = null;
        
        const ipAddress = (req.header('x-forwarded-for') || req.socket.remoteAddress || "");
        let resetHash = tokenf.generateSecretKey();
        // const result = await prisma.account.create({
        //     data: {
        //         email,
        //         userName,
        //         displayName,
        //         password,
                
        //         resetHash,
        //         ipsSeen: [ipAddress], // Set it to an initial value
        //         permissionLevel: 1
        //     },
        // });



        
        res.json({
            success: true,
            // payload: result,
            payload: {},
        });

        tokenf.sendConfirmationMail("")
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create account.',
        });
    }
});



//* 5. Activate account
app.put('/accounts/:refreshToken/activate', async (req, res) => {
    try {
        const { refreshToken } = req.params;

        const account = await prisma.account.update({
            where: { refreshToken },
            data: { isActive: 1 },
        });

        res.json({
            success: true,
            payload: account,
        });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update account.',
        });
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



function generateAccessToken(user:{}) {
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

