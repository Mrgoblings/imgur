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



//* 1. Fetch all posts. -- ready
app.get('/posts', authenticateToken, async (req, res) => {
    // const posts = await prisma.post.findMany({
    //     where: { state: States.PUBLIC },
    // })

    res.json({
        success: true,
        payload: {works:true},
    })
});


//* 2. Fetch a specific post by its ID.  -- ready
app.get(`/posts/:id`, async (req, res) => {
    try {

        const { id } = req.params
        const post = await prisma.post.findFirst({
            where: { id: Number(id) },
        })
        res.json({
            success: true,
            payload: post,
        })
    } catch (error) {
        console.error('Error finding post :', error);
        res.status(500).json({
            success: false,
            error: 'Error finding post.',
        });
    }
});



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
    
    
    const expirationDate = new Date();
    
    //* Add 1 hour (60 minutes * 60 seconds * 1000 milliseconds) to the current time
    expirationDate.setTime(expirationDate.getTime() + (60 * 60 * 1000)); 

    const accessToken = jwt.sign({ userName: account.userName }, process.env.JWT_SECRET)


    res.json({
        success: true,
        accessToken: accessToken,
    });

});



//* 4. Fetch account data trough a web token. 
//* If it doesnt exist make him login. 
//* If a unique token is missing make him confirm mail.
app.post('/login/:accessToken', async (req, res) => {

})



//*5 signup
app.post('/signup', async (req, res) => {
    try {

        const { email, username, displayName, password } = req.body;
        
        //* DB stuff here
        let createdAt = null;
        
        const ipAddress = (req.header('x-forwarded-for') || req.socket.remoteAddress || "");
        const accessToken = jwt.sign({ username: username }, process.env.JWT_SECRET)
        // const result = await prisma.account.create({
        //     data: {
        //         email,
        //         username,
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

        tokenf.sendConfirmationMail("") //TODO AES encrypt it before sending it
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create account.',
        });
    }
});


/*
//* 4. Create a new post 
// TODO HERE
app.post(`/posts/:id`, upload.single("file"), async (req, res) => {
    const { title, imageUrl, singerEmail } = req.body
    const result = await prisma.post.create({
        data: {
            title,
            image,
            state,
            createdAt,
            senderId: ,
        },
    })
    res.json({
        success: true,
        payload: result,
    })
});
*/
//* 5. Activate account
app.put('/accounts/:resetToken/activate', authenticateToken, async (req, res) => {
    try {
        const { resetToken } = req.params;

        const account = await prisma.account.update({
            where: { refreshToken: resetToken },
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


//* 6. Deletes a post by its ID.  -- ready
app.delete(`/posts/:id`, authenticateToken, async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.delete({
        where: { id: Number(id) },
    })

    res.json({
        success: true,
        payload: post,
    })
});


//* 7. Fetches all comments on a post.   
app.get('/posts/:id/comments', async (req, res) => {
    const { id } = req.params;
    const comments = await prisma.comments.findMany({
        where: { postId: Number(id) }
    })

    res.json({
        success: true,
        payload: comments,
    })
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



app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000'),
);



function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null) res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
        if(err)return res.sendStatus(403);
        req.user = user;
        next();
    })

}

