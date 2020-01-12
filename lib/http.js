import express  from 'express';
import fs from 'fs';
import { getDirectoryTree, toPathsObject, getPathResources } from './utils';
import hbs from 'express-handlebars';
import { dialog } from 'electron';

const app = express();
const server = app.listen(7777, console.log.bind(this, 'listening on 7777 port'));

app.get('/getEnvironments', function(req, res) {
    res.json(getDirectoryTree('env', undefined, { removeFileExtension: true }));
});

app.get('/getSteps', function(req, res) {
    const dirToRead = fs.existsSync(`steps/${req.query.dirToRead}`) ? `steps/${req.query.dirToRead}` : 'steps';
    const steps = getPathResources(dirToRead, stat => stat.isFile()).map(step => `${dirToRead}/${step}`);
    
    res.json(toPathsObject(steps));
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

    res.json({ isScenario, areSteps: !isScenario, paths: toPathsObject(files) });
});

app.get('/savePipeline', function(req, res) {
    const steps = res.body.steps;
    const pipeline = { steps };
});

app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', `${process.cwd()}/views`);
app.set('view engine', 'hbs');

export default server;