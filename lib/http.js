import express  from 'express';
import fs from 'fs';
import { getDirectoryTree, searchForFile } from './utils';
import hbs from 'express-handlebars';
import { dialog } from 'electron';
import path from 'path';

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
    let files = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Steps', extensions: [ 'js' ] },
            { name: 'Pipeline', extensions: [ 'json' ] },
        ]
    });
    let isScenario = files.every(file => /\.json$/.test(file));

    if (!files || !Array.isArray(files) || files.length === 0) {
        return void res.json({});
    }
    
    if (isScenario) {
        const scenario = JSON.parse(fs.readFileSync(files[0]).toString());
        files = Array.isArray(scenario.steps) ? scenario.steps : [];
    }

    const paths = files.map(file => {
        return { 
            dir: path.dirname(file),
            fileName: path.basename(file),
            fullPath: file,
            queryFullPath: encodeURIComponent(file)
        };
    });

    res.json({ isScenario, areSteps: !isScenario, paths });
});

app.get('/savePipeline', function(req, res) {
    const steps = res.body.steps;
    const pathToSavePipeline = dialog.showSaveOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Steps', extensions: [ 'js' ] },
            { name: 'Pipeline', extensions: [ 'json' ] },
        ]
    });
});

app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', `${process.cwd()}/views`);
app.set('view engine', 'hbs');

export default server;