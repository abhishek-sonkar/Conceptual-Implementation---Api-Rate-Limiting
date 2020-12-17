const express = require('express');
//const rateLimit = require("express-rate-limit");
const posts = require('./initialData');
const app = express()
const bodyParser = require("body-parser");
const port = 3000
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
// your code goes here

// const apiLimiter = rateLimit({
//     windowMs: 1 * 30 * 1000,
//     max: 5,
//     message: "Exceed Number of API Calls"
// });

let initialMax = null;
let numOfApiCalls = 0;

app.get('/api/posts', (req, res) => {

    if(numOfApiCalls >= 5) {
        res.status(429).send({ message: "Exceed Number of API Calls" });
        return;
    }

    const parsedMax = Number(req.query.max || 10); //shortCircuit Operator
    const max = parsedMax > 20 ? 10 : parsedMax;
    let finalMax = max;

    if(initialMax !== null) {
        finalMax = Math.min(initialMax, finalMax);
    }

    const requiredData = posts.filter((val, idx) => idx < finalMax);
    res.send(requiredData);

    if(initialMax === null) {
        initialMax = max;
        numOfApiCalls++;
        setTimeout(() => {
            initialMax = null;
            numOfApiCalls = 0;
        }, 30 * 1000);
    }
    else {
        numOfApiCalls++;
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;