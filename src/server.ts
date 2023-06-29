require('dotenv').config();

import { PrismaClient, States } from '@prisma/client';
import express from "express"

// const multer = require("multer"); //TODO convert images to webp - best
// const upload = multer({ dest: "../uploads/" });

// import { ReadStream } from 'fs';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");

const Token = require("./token.js");
const token = new Token();



//* 1. Fetch all posts. -- ready
app.get('/posts', token.authenticate, async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { state: States.PUBLIC },
    })

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
app.delete(`/posts/:id`, token.authenticate, async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.delete({
        where: { id: Number(id) },
    })

    return res.json({
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
