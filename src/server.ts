require('dotenv').config();

import { PrismaClient, States } from '@prisma/client';
import { error } from 'console';
import express from "express"

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const jwt = require("jsonwebtoken");

const Token = require("./token.js");
const token = new Token();


const path = require("path");

const multer = require("multer"); 
const storage = multer.diskStorage({
    destination: (res:any, file:any, cb:any) => {
        cb(null, __dirname +  "/../uploads");
    },
    filename: (req:any, file:any, cb:any) => {
        console.log(file);
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
        req.body.imageUrl = `http://localhost:3000/images/${newFileName}`;
    }
});
const upload = multer({ storage: storage })

const cors = require('cors');
app.use(cors());


//* 1. Fetch all posts. -- ready
app.get('/posts', async (req, res) => {
    const query  = `${req.url}`.split("?")[1];
    
    let posts;

    if (query) {
        posts = await prisma.post.findMany({
            where: {
                state: States.PUBLIC,
                OR: [
                    {
                        title: {
                            contains: query,
                        },
                    },
                    {
                        tags: {
                            hasSome: query,
                        },
                    },
                ],
            },
        });
    } else {
        try {
            posts = await prisma.post.findMany({
                where: { state: States.PUBLIC },
            });
        } catch {
            if(!posts) return res.json({success: false, error: "query not found"}).sendStatus(204);
        }
    }

    if(!posts) return res.sendStatus(204);

    return res.json({
        success: true,
        payload: posts,
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

        if(post.state == States.PRIVATE) {

            token.authenticate(req, res, async () => {
                if(req.body.user.id == post.senderId) {
                    return res.json({
                        success: true,
                        payload: post,
                    });
                } else {
                    return res.sendStatus(403);
                }
            });

        } else {
            return res.json({
                success: true,
                payload: post,
            });
        }
    } catch (error) {
        console.error('Error finding post :', error);
        res.status(500).json({
            success: false,
            error: 'Error finding post.',
        });
    }
});



//* 4. Create a new post 
app.post(`/posts`/*, token.authenticate*/, upload.single("file"), async (req, res) => {
    console.log("A POST :0");
    const { title, imageUrl, user, state, tags} = req.body;
    console.log("tags :" + tags);
  try {
    const post = await prisma.post.create({
      data: {
        title,
        imageUrl,
        state,
        tags: tags.split(","),
        sender: {
            connect: {
                // id: user.id,
                id: 18, //TODO change before production :0  
            },
          },
      },
    });

    if(!post) throw error("stup");

    console.log("all good");
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
    const post = await prisma.post.update({
        where: { id: Number(id) },
        data: {state: States.DELETED}
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
