import { app, BrowserWindow } from 'electron';

{
    let windows = {};
    let createWindow = (windowId, page) => {
        let window = windows[windowId] = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
            nodeIntegration: true
            }
        });
        window.loadFile(page);
        window.on('closed', () => {
            window = null;
            app.quit();
        });
    };

    app.on('ready', () => {
        createWindow(1, 'index.html');
    });
}