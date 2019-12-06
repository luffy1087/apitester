import server from './lib/http';
import { createWindow, app } from './lib/windows';

const startProgram = () => {
    const window = createWindow('index', './dist/index.html');
    
    window.on('closed', () => server.close);
}

app.on('ready', startProgram);