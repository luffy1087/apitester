import { app, BrowserWindow } from 'electron';

class Windows {
    constructor() {
        this.windows = {};
        this.app = app;
    }

    createWindow(windowId, page, options = { width: 800, height: 600, shouldQuitAppOnClose: true }) {
        const window = this.windows[windowId] = new BrowserWindow(options);
        window.loadFile(page);
        window.on('closed', () => {
            if (options.shouldQuitAppOnClose) {
                app.quit();
            }
        });

        return window;
    }
}

export default new Windows();