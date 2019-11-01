import express  from 'express';
import fs from 'fs';

let app = express();

app.get('/getEnvironments', function(req, res) {
    res.json(fs.readdirSync('env'));
});

app.get('/getSteps', function(req, res) {
    res.json(fs.readdirSync('steps'));
});

app.get('/getEnvironmentDetails', function(req, res) {
    const env = req.query.environment;

    res.sendFile(`${process.cwd()}/env/${env}.json`);
});

app.listen(7777, console.log.bind(this, 'listening on 7777 port'));