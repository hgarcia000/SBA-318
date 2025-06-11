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

app.get('/', (req, res) => {

    // console.log(new Date().toUTCString());
    res.send(`<h1>Home Page</h1>`);

});

app.get('/users', (req, res) => {
    // f
    res.json(users);

});

app.get('/posts', (req, res) => {

    res.json(posts);

});

app.get('/scores', (req, res) => {

    res.json(scores);
    
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
});