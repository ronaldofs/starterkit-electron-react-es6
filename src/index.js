var app = require('app');
var Menu = require('menu');
var MenuItem = require('menu-item');
var BrowserWindow = require('browser-window');
var crashReporter = require('crash-reporter');

var layoutHtml = 'file://' + __dirname + '/index.html';
var mainWindow = null;

crashReporter.start();

app.on('ready', onReady);
app.on('window-all-closed', onWindowClosed);

function onReady() {
  mainWindow = createWindow();
  mainWindow.loadUrl(layoutHtml);
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

function onWindowClosed() {
  if (process.platform !== 'darwin') app.quit();
}

function createWindow(options) {
  return new BrowserWindow({
    width: 800,
    height: 600,
    'min-width': 800,
    'min-height': 600,
    frame: true
  });
}
