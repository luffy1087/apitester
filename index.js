import './lib/webSocket';
import { server } from './lib/http-server';
import windows from './lib/windows';


(function(Program) {
    new Program();
})(class Program {
    constructor() {
        windows.app.on('ready', this.startProgram);
    }

    startProgram() {
        const window = windows.createWindow('index', './dist/index.html');
        window.on('closed', () => server.close());
    }
});