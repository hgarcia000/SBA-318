import express from 'express'
import { scores } from './data/highscores.js';
import userRouter from './routes/userroutes.js';
import postRouter from './routes/postRoutes.js';
import scoreRouter from './routes/scoreRoutes.js';

const app = express();
const port = 3000;

// Logging middleware.
const logReq = (req, res, next) => {

    console.log(`${new Date().toLocaleString()} : Request received!`);

    next();

};

// Using custom middleware
app.use(logReq);

// Serving a static CSS file
app.use(express.static('./styles'));


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.set("view engine", "ejs");

app.get('/', (req, res) => {


    const links = [
        {
            href: "/renderscores",
            rel: "renderscores",
            type: "GET",
        },
        {
            href: "/users",
            rel: "users",
            type: "GET",
        },
        {
            href: "/posts",
            rel: "posts",
            type: "GET",
        },
        {
            href: "/scores",
            rel: "scores",
            type: "GET",
        }
    ];

    res.json({links});

});

app.get('/renderscores', (req, res) => {
    if (req.query.sort == 'desc') {

        scores.sort((a, b) => {return b.score - a.score});

    } else if (req.query.sort == 'asc') {
    
        scores.sort((a, b) => {return a.score - b.score});
    
    } else {

        scores.sort((a, b) => {return a.id - b.id});

    }
    res.render("index", {scores: scores});
});

// Using our established routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/scores', scoreRouter);

// Error-handling Middleware
app.use((err, req, res, next) => {

    res.status(400);
    res.json({error: err.message});

});

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
});