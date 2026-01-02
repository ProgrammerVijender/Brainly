// npm i -d @types/express

import express from 'express';
import jwt from 'jsonwebtoken';
import { ContentModel, UserModel } from './db.js';
import { userMiddleware } from './middleware.js';

const app = express();

const JWT_SECRET = "your_jwt_secret_key";

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/v1/signup', async (req, res) => {
    const { username, password } = req.body.u;

    try{
        await UserModel.create({ username, password }).then(() => {
                res.send('User created');
            })

    } 
    catch(err) {
        res.status(400).send('User already exists');
        return;
    }

});

app.post('/api/v1/signin', async (req, res) => {
   const { username, password } = req.body;
    
     const existingUser = await UserModel.findOne({ username, password });
     if (existingUser) {
       
        const token = jwt.sign({ id :existingUser._id}, JWT_SECRET);
        
        res.json({ token });
        return;
     }
     else{
        res.status(403).send('Invalid credentials');
        return;
     }

    });

app.post('/api/v1/content', userMiddleware , async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    // const title = req.body.title;
    // const userId = req.body.userId;
    // const tags = req.body.tags;


    await ContentModel.create({ 
        link, type, 
        //@ts-ignore
         userId: req.userId , tags:[] });

    res.send('Content created');
});



app.get('/api/v1/content', userMiddleware , async (req, res) => {
    
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({ userId: userId }).populate('userId', 'username');
    // console.log(content);
    res.json({content});

});

app.delete('/api/v1/content/', userMiddleware , async (req, res) => {

    const contentID = req.body.contentId;
    console.log(contentID)
    await ContentModel.deleteMany({ 
        contentID, 
        //@ts-ignore
        userId: req.userId });

    res.json( {message :'Content deleted'});
});


app.post('/api/v1/logout', (req, res) => {
    res.send('Logged out');
});



// app.get('/api/v1/user', (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         res.status(401).send('Unauthorized');
//         return;
//     }
//     try {
//         const decoded = jwt.verify(token, 'secret');
//         res.json({ username: decoded.username });
//     } catch (err) {
//         res.status(401).send('Invalid token');
//     }
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
