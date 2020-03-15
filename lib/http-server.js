import fs from 'fs';
import express  from 'express';
import hbs from 'express-handlebars';
import { dialog } from 'electron';
import { getDirectoryTree, toPathsObject, getPathResources } from './utils';
import './webSocket';

class HttpServer {
    constructor() {
        const app = this.app = express();
        this.server = app.listen(7777, console.log.bind(this, 'listening on 7777 port'));
        this.setServerConfiguration(app);
        this.setRouter(app);
    }

    setServerConfiguration(app) {        
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.engine('hbs', hbs({extname: 'hbs'}));
        app.set('views', `${process.cwd()}/views`);
        app.set('view engine', 'hbs');
    }
 
    setRouter(app) {
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
        
            if (!files || !Array.isArray(files) || files.length === 0) {
                return void res.json({});
            }
        
            let isScenario = files.every(file => /\.json$/.test(file));
            if (isScenario) {
                const scenario = JSON.parse(fs.readFileSync(files[0]).toString());
                files = Array.isArray(scenario.steps) ? scenario.steps : [];
            }
        
            res.json({ isScenario, areSteps: !isScenario, paths: toPathsObject(files) });
        });
        app.post('/savePipeline', function(req, res) {
            if (!req.body.steps || !req.body.fileName) {
                return res.json({ response: 'ko' });
            }
        
            const steps = req.body.steps.map(step => decodeURIComponent(step));
            const fileName = `pipelines/${req.body.fileName}.json`;
            const pipeline = JSON.stringify({ steps }, null, '\t');
        
            if (fs.existsSync(fileName)) {
                return res.json({ response: 'Pipeline already exists' });
            }
            
            fs.writeFileSync(fileName, pipeline);
            
            res.json({ response: 'ok' });
        });
    }
}

export const { server, app } = new HttpServer();