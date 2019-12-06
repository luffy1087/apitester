import express  from 'express';
import fs from 'fs';
import { getDirectoryTree, searchForFile } from './utils';
import hbs from 'express-handlebars';
import { dialog } from 'electron';

const app = express();
const server = app.listen(7777, console.log.bind(this, 'listening on 7777 port'));

app.get('/getEnvironments', function(req, res) {
    res.json(getDirectoryTree('env', undefined, { removeFileExtension: true }));
});

app.get('/getSteps', function(req, res) {
    res.json(fs.readdirSync('steps').map((step) => step.replace(/\..+$/, '')));
});

app.get('/getEnvironmentDetails', function(req, res) {
    const env = `${req.query.environment}.json`;
    const json = JSON.parse(fs.readFileSync(env).toString());

    res.render('envDetails', json);
});

app.get('/addStepOrScenario', function(req, res) {
    const files = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Step', extensions: [ 'js' ] },
            { name: 'Scenario', extensions: [ 'json' ] },
        ]
    });
    
    res.json(files);
});

app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', `${process.cwd()}/views`);
app.set('view engine', 'hbs');

export default server;