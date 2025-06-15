import express from 'express'
import { posts } from '../data/posts.js';

const postRouter = express.Router();

postRouter
    .route('/')
    .get((req, res, next) => {

        const links = [
            {
                href: `posts?limit=${req.query.limit}`,
                rel: `?limit=${req.query.limit}`,
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

                    res.json({ postList, links });

                } else {

                    const postList = posts
                    res.json({ postList, links });

                }

            } else {

                next(new Error("Limit query parameter is not a number!"));

            }

        } else {

            const postList = posts;
            res.json({ postList, links });

        }

    });

postRouter
    .route('/:userId')
    .get((req, res, next) => {

        const postList = posts.filter((p) => { return p.userId == req.params.userId });

        res.json(postList);
    });

postRouter
    .route('/add/:userId')
    .post((req, res, next) => {

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

postRouter
    .route('/delete/:id')
    .delete((req, res, next) => {

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

export default postRouter;