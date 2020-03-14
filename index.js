import './lib/webSocket';
import { server } from './lib/server';
import { createWindow, app } from './lib/windows';


(function(Program) {
    new Program();
})(class Program {
    constructor() {
        app.on('ready', this.startProgram);
    }

    startProgram() {
        const window = createWindow('index', './dist/index.html');
        window.on('closed', () => server.close());
    }
});