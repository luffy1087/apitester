'use strict';

var _electron = require('electron');

{
    var windows = {};
    var createWindow = function createWindow(windowId, page) {
        var window = windows[windowId] = new _electron.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        });
        window.loadFile(page);
        window.on('closed', function () {
            window = null;
            _electron.app.quit();
        });
    };

    _electron.app.on('ready', function () {
        createWindow(1, 'index.html');
    });
}