const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let pythonProcess = null;


const logPath = path.join(app.getPath('userData'), 'backend_error.log');
const logStream = fs.openSync(logPath, 'a');

function startPythonBackend() {
    const isDev = !app.isPackaged;

    if (isDev) {
        console.log("Modo de desenvolvimento: FastAPI deve ser rodado separadamente.");
    } else {
        const pythonExecutable = path.join(process.resourcesPath, 'api-backend', 'api-backend.exe');

        console.log("Tentando iniciar o Python em:", pythonExecutable);

        pythonProcess = spawn(pythonExecutable, [], {
            detached: true,
            cwd: path.dirname(pythonExecutable), 
            stdio: ['ignore', logStream, logStream]
        });

        pythonProcess.unref();
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    const isDev = !app.isPackaged;

    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, 'dist', 'index.html')}`;

    mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
    startPythonBackend();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (pythonProcess) {
        pythonProcess.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});