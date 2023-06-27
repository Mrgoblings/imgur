require('dotenv').config();

import { PrismaClient } from '@prisma/client'
import { States } from "@prisma/client";
import express from "express"

import { Token } from "./tokenFunctions"


const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");
const tokenf = new Token();



//* 1. Fetch all posts. -- ready
app.get('/posts', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { state: States.PUBLIC },
    })

    res.json({
        success: true,
        payload: posts,
    })
});


//* 2. Fetch a specific post by its ID.  -- ready
app.get(`/posts/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.findFirst({
        where: { id: Number(id) },
    })
    res.json({
        success: true,
        payload: post,
    })
});


//* 3. Fetch account data trough a web token. 
//* If it doesnt exist make him login. 
//* If a unique token is missing make him confirm mail.
app.post('/signin', async (req, res) => {
    try {

        const { email, userName, displayName, password } = req.body;

        let createdAt = null;

        const ipAddress = (req.header('x-forwarded-for') || req.socket.remoteAddress || "");

        const result = await prisma.account.create({
            data: {
                email,
                userName,
                displayName,
                password,

                resetHash: tokenf.generateSecretKey(), // Generate a unique hash value
                ipsSeen: [ipAddress], // Set it to an initial value
                permissionLevel: 1
            },
        });

        res.json({
            success: true,
            payload: result,
        });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create account.',
        });
    }
});


//* 4. Create a new post 
// TODO HERE
app.post(`/posts`, async (req, res) => {
    const { title, content, singerEmail } = req.body
    const result = await prisma.post.create({
        data: {
            title,
            image: req.body.image,
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


//* 6. Deletes a post by its ID.  -- ready
app.delete(`/posts/:id`, async (req, res) => {
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
)