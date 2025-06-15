import express from 'express'
import { users } from '../data/users.js';

const userRouter = express.Router();

userRouter
    .route('/')
    .get((req, res) => {

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

        res.json({ users, links });
    });


userRouter
    .route('/:id')
    .get((req, res) => {

        const user = users.find((u) => u.id == req.params.id);
        res.json(user);

    });

userRouter
    .route('/create')
    .post((req, res, next) => {

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

export default userRouter;