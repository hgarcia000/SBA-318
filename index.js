import express from 'express'

const app = express();
const port = 3000;

const logReq = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} :Request received!`);
    next();
};

app.use(logReq);

app.use((err, req, res, next) => {
    res.status(400).send(err.message);
});

app.get('/', (req,res) => {
    // console.log(new Date().toUTCString());
    res.send(`<h1>Home Page</h1>`);
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
});