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
    const file = `env/${env}.json`;
    const json = JSON.parse(fs.readFileSync(file).toString());
    
    res.json(json);
});

app.listen(7777, console.log.bind(this, 'listening on 7777 port'));