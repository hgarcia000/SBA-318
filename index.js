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


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {

    // console.log(new Date().toUTCString());

    const links = [
        {
            href: "users",
            rel: "users",
            type: "GET",
        },
        {
            href: "posts",
            rel: "posts",
            type: "GET",
        },
        {
            href: "scores",
            rel: "scores",
            type: "GET",
        }
    ];

    res.json({links});

});

app.get('/users', (req, res) => {
    
    const links = [
        {
            href: "users/:id",
            rel: ":id",
            type: "GET",
        },
        {
            href: "users/create",
            rel: "create",
            type: "POST",
        }
    ];

    res.json({users, links});

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
            else if (users.find((u) => u.email == req.body.email)) {
                next(new Error("Email Already In Use!"));
            } else {

                const user = {
                    id: users[users.length - 1].id + 1,
                    username: req.body.username,
                    email: req.body.email
                };
    
                users.push(user);
                res.json(user);

            }

        } else {
            next(new Error("Please fill out all required fields."));
        }
    } else {
        next(new Error("Request body cannot be read."));
    }

});

app.get('/posts', (req, res, next) => {

    // console.log(Number(req.query.limit));
    const links = [
        {
            href: `posts?limit=${req.query.limit}`,
            rel: `?limit${req.query.limit}`,
            type: "GET",
        },
        {
            href: "posts/:userId",
            rel: ":userId",
            type: "GET",
        },
        {
            href: "posts/add/:userId",
            rel: "add/:userId",
            type: "POST",
        },
        {
            href: "posts/delete/:id",
            rel: "delete/:id",
            type: "DELETE",
        }
    ];

    if (req.query.limit) {

        const limit = Number(req.query.limit);

        if (typeof limit === 'number') {

            if (limit < posts.length) {
                
                const postList = [];
    
                for (let i = 0; i < limit; i++) {
    
                    postList.push(posts[i]);
                    
                }
    
                res.json({postList, links});
    
            } else {
    
                const postList = posts
                res.json({postList, links});
    
            }
            
        } else {

            next(new Error("Limit query parameter is not a number!"));

        }

    } else {

        const postList = posts;
        res.json({postList, links});

    }

});

app.get('/posts/:userId', (req, res, next) => {

    const postList = posts.filter((p) => {return p.userId == req.params.userId});

    res.json(postList);
});

app.post('/posts/add/:userId', (req, res, next) => {

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

app.delete('/posts/delete/:id', (req, res, next) => {

    const post = posts.find((p, i) => {
        if (p.id == req.params.id) {

            posts.splice(i, 1);
            return true;
        }
    });

    if (post) {

        res.json(post);
        
    } else {

        next(new Error("Post ID does not exist!"));
    }
});

app.get('/scores', (req, res) => {

    const links = [
        {
            href: `scores?sort=${req.query.sort}`,
            rel: `?limit${req.query.sort}`,
            type: "GET",
        },
        {
            href: "scores/:userId",
            rel: ":userId",
            type: "GET",
        },
        {
            href: "scores/add/:userId",
            rel: "add/:userId",
            type: "POST",
        },
        {
            href: "scores/update/:userId",
            rel: "update/:userId",
            type: "PUT",
        },
        {
            href: "scores/delete/:id",
            rel: "delete/:id",
            type: "DELETE",
        }
    ];

    if (req.query.sort == 'desc') {

        scores.sort((a, b) => {return b.score - a.score});

    } else if (req.query.sort == 'asc') {
    
        scores.sort((a, b) => {return a.score - b.score});
    
    } else {

        scores.sort((a, b) => {return a.id - b.id});

    }

    res.json({scores, links});
    
});

app.get('/scores/:userId', (req, res) => {

    const score = scores.find((s) => s.userId == req.params.userId);

    res.json(score);

});

app.post('/scores/add/:userId', (req, res, next) => {

    if (scores.find((s) => s.userId == req.params.userId)) {

        next(new Error("This user already has a score!"));

    }

    scores.sort((a, b) => {return a.id - b.id});

    const score = {

        id: scores[scores.length - 1].id + 1,
        userId: Number(req.params.userId),
        score: Number(req.body.score)

    };

    console.log(typeof score.score == NaN);
    if (typeof score.score == NaN) {

        next(new Error("Score is not a number!"));

    }

    scores.push(score);
    res.json(score);
});

app.put('/scores/update/:userId', (req, res, next) => {

    const score = scores.find((s) => s.userId == req.params.userId);
    if (score) {
        
        score.score = Number(req.body.score);
        res.json(score);

    } else {
        next(new Error("Please fill out your new score!"));
    }
});

app.delete('scores/delete/:id', (req, res, next) => {
    const score = scores.find((s, i) => {
        if (s.id == req.params.id) {

            scores.splice(i, 1);
            return true;
        }
    });

    if (score) {

        res.json(score);
        
    } else {

        next(new Error("Score ID does not exist!"));
    }
});

// Error-handling Middleware
app.use((err, req, res, next) => {

    res.status(400);
    res.json({error: err.message});

});

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
});