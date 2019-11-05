import express  from 'express';
import fs from 'fs';
import { getDirectoryTree, searchForFile } from './utils';

let app = express();

app.get('/getEnvironments', function(req, res) {
    res.json(getDirectoryTree('env', undefined, { removeFileExtension: true }));
});

app.get('/getSteps', function(req, res) {
    res.json(fs.readdirSync('steps').map((step) => step.replace(/\..+$/, '')));
});

// app.get('/getEnvironmentDetails', function(req, res) {
//     const env = req.query.environment;

//     let x = searchForFile(env, 'env');
//     console.log(x);
//     //template from views/envPopUp
//     //data from env/${env}.json
//     //compile template plus data
//     //res.render

//     res.sendFile(`${process.cwd()}/env/${env}.json`);
// });

app.listen(7777, console.log.bind(this, 'listening on 7777 port'));