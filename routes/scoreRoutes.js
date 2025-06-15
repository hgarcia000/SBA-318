import express from 'express'
import { scores } from '../data/highscores.js'

const scoreRouter = express.Router();

scoreRouter
.route('/')
.get((req, res) => {

    const links = [
        {
            href: `scores?sort=${req.query.sort}`,
            rel: `?sort=${req.query.sort}`,
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

scoreRouter
.route('/:userId')
.get((req, res) => {

    const score = scores.find((s) => s.userId == req.params.userId);

    res.json(score);

});

scoreRouter
.route('/add/:userId')
.post((req, res, next) => {

    if (req.params.userId == ":userId") {
        req.params.userId = req.body.userId;
    }

    if (scores.find((s) => s.userId == req.params.userId)) {

        next(new Error("This user already has a score!"));

    }

    scores.sort((a, b) => {return a.id - b.id});

    const score = {

        id: scores[scores.length - 1].id + 1,
        userId: Number(req.params.userId),
        score: Number(req.body.score)

    };

    if (typeof score.userId == NaN) {

        next(new Error("User ID is not a number!"));

    }
    console.log(typeof score.score == NaN);
    if (typeof score.score == NaN) {

        next(new Error("Score is not a number!"));

    }

    scores.push(score);
    res.json(score);
});

scoreRouter
.route('/update/:userId')
.put((req, res, next) => {

    const score = scores.find((s) => s.userId == req.params.userId);
    if (score) {
        
        score.score = Number(req.body.score);
        res.json(score);

    } else {

        next(new Error("Please fill out your new score!"));

    }
});

scoreRouter
.route('/delete/:id')
.delete((req, res, next) => {
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

export default scoreRouter;