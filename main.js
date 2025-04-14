const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const { chromium } = require('playwright');
const url = require("url");
const ipc = electron.ipcMain;
const { scrapeContent } = require('./contentScraper'); 
const fetch = require('node-fetch');
const { exec } = require('child_process');
const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const { normalizeVector, cosineSimilarity, toPercentage } = require('./similarityUtils');
const { formatHtmlToMarkdown } = require("./contentFormate");
const { getEmbedding } = require('./embeddingService');


let win;

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    });
}

ipc.handle('scrape-content', async (event, url) => {
    try {
      const result = await scrapeContent(url);
      if(result.success){
        const formatted=formatHtmlToMarkdown(result.content)
        return {success:true,content:formatted}
      }

    } catch (error) {
      return { success: false, error: error.message };
    }
});


ipc.handle('embed-text', async (event, text) => {
    try {
        const embeddingResult = await getEmbedding(text);
        return { success: true, data: embeddingResult };
    } catch (error) {
        console.error('Embedding error:', error);
        return { success: false, error: error.message };
    }
});


  const auth = new GoogleAuth({
    keyFile: './credentials/vertex.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});


module.exports= {getEmbedding};