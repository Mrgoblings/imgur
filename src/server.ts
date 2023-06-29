require('dotenv').config();

import { PrismaClient, States } from '@prisma/client';
import express from "express"

// const multer = require("multer"); //TODO convert images to webp - best
// const upload = multer({ dest: "../uploads/" });

// import { ReadStream } from 'fs';


const bcrypt = require("bcrypt");


const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");



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



//* 4. Fetch account data trough a web token. 
//* If it doesnt exist make him login. 
//* If a unique token is missing make him confirm mail.
app.post('/loginAuth', authenticateToken, async (req, res) => {

})



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
    });
}

