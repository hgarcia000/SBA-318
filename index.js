import express from 'express'
import { users } from './data/users.js';
import { posts } from './data/posts.js';
import { scores } from './data/highscores.js';

const app = express();
const port = 3000;

// Logging middleware.
const logReq = (req, res, next) => {

    console.log(`${new Date().toLocaleString()} : Request received!`);

    next();

};

app.use(logReq);

app.use((err, req, res, next) => {

    res.status(400).send(err.message);

});

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {

    // console.log(new Date().toUTCString());
    res.send(`<h1>Home Page</h1>`);

});

app.get('/users', (req, res) => {
    
    res.json(users);

});

app.get('/users/:id', (req, res) => {
    const user = users.find((u) => u.id == req.params.id);
    res.json(user);

});

app.post('/users/create', (req, res, next) => {

    console.log(req.body);
    if (req.body) {
        if (req.body.username && req.body.email) {

            if (users.find((u) => u.username == req.body.username)) {
                next(new Error("Username Already Taken!"));
            }
            if (users.find((u) => u.email == req.body.email)) {
                next(new Error("Email Already In Use!"));
            }

            const user = {
                id: users[users.length - 1].id + 1,
                username: req.body.username,
                email: req.body.email
            };

            users.push(user);
            res.json(user);

        } else {
            next(new Error("Please fill out all required fields."));
        }
    } else {
        next(new Error("Request body cannot be read."));
    }

});

app.get('/posts', (req, res, next) => {

    console.log(Number(req.query.limit));

    if (req.query.limit) {

        const limit = Number(req.query.limit);

        if (limit instanceof Number) {

            if (limit < posts.length) {
                
                const postList = [];
    
                for (let i = 0; i < limit; i++) {
    
                    postList.push(posts[i]);
                    
                }
    
                res.json(postList);
    
            } else {
    
                res.json(posts);
    
            }
            
        } else {

            next(new Error("Limit query parameter is not a number!"));
            
        }

    } else {

        res.json(posts);

    }

});

app.get('/posts/:userId', (req, res, next) => {

    const postList = posts.filter((p) => {return p.userId == req.params.userId});

    res.json(postList);
});

app.post('/posts/:userId/add', (req, res, next) => {

    console.log(req.body);

    if (!posts.find((p) => p.userId == req.params.userId)) {

        next(new Error("User ID does not exist!"));

    } 

    if (req.body.title && req.body.content) {
        
        const post = {
            id: posts[posts.length - 1].id + 1,
            userId: Number(req.params.userId),
            title: req.body.title,
            content: req.body.content,
            date: new Date().toUTCString()
        };

        posts.push(post);
        res.json(post);

    } else {

        next(new Error("Please fill out all required fields."));

    }

});

app.get('/scores', (req, res) => {

    res.json(scores);
    
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
    console.log(Number("tr") instanceof Number)
});