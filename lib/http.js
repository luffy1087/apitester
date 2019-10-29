import express  from 'express';
import fs from 'fs';

let app = express();

app.get('/getEnvironments', function(req, res) {
    res.json(fs.readdirSync('env'));
});

app.get('/getSteps', function(req, res) {
    res.json(fs.readdirSync('steps'));
});

app.listen(7777, console.log.bind(this, 'listening on 7777 port'));