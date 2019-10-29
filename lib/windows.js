import { app, BrowserWindow } from 'electron';

let windows = {};
let createWindow = (windowId, page, options = { width: 800, height: 600} ) => {
    if (!app.isReady()) {
        return app.on('ready', createWindow.bind(this, windowId, page, options));
    }

    let window = windows[windowId] = new BrowserWindow(options);
    window.loadFile(page);
    window.on('closed', () => {
        window = null;
        app.quit();
    });
};

export { createWindow, windows };