require('dotenv').config();

import { PrismaClient, States } from '@prisma/client';
import express from "express"

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const jwt = require("jsonwebtoken");

const Token = require("./token.js");
const token = new Token();


const path = require("path");

const multer = require("multer"); 
const storage = multer.diskStorage({
    destination: (res:any, file:any, cb:any) => {
        cb(null,__dirname +  "/../uploads");
    },
    filename: (req:any, file:any, cb:any) => {
        console.log(file);
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
        req.body.imageUrl = `http://localhost:3000/images/${newFileName}`;  //TODO testing here
    }
});
const upload = multer({ storage: storage })


//* 1. Fetch all posts. -- ready
app.get('/posts', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { state: States.PUBLIC },
    })

    res.json({
        success: true,
        payload: {works:true},
    })
});  //TODO upvotes and downvotes


//* 2. Fetch a specific post by its ID.  -- ready
app.get(`/posts/:id`, async (req, res) => {
    try {

        const { id } = req.params
        const post = await prisma.post.findFirst({
            where: { id: Number(id) },
        })

        if(!post) return res.sendStatus(404);

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



//* 4. Create a new post 
//TODO authentication
app.post(`/posts`, upload.single("file")/*, token.authenticate*/, async (req, res) => {
    const { title, imageUrl, user, state} = req.body

  try {
    const post = await prisma.post.create({
      data: {
        title,
        imageUrl,
        state,
        sender: {
            connect: {
                // id: user.id,
                id: 18,
            },
          },
      },
    });

    return res.status(200).json({
      success: true,
      post: post,
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create post.',
    });
  }
});




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



app.use('/images', express.static(path.join(__dirname, '../uploads')));


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
