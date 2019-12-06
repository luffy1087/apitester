import { app, BrowserWindow } from 'electron';

const windows = {};
const createWindow = (windowId, page, options = { width: 800, height: 600, shouldQuitAppOnClose: true } ) => {
    const window = windows[windowId] = new BrowserWindow(options);
    window.loadFile(page);
    window.on('closed', () => {
        if (options.shouldQuitAppOnClose) {
            app.quit();
        }
    });

    return window;
};

export { createWindow, windows, app };