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
      return result;
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
  
  
  async function getEmbedding(text) {
    const client = await auth.getClient();
    console.log("Using service account:", client.email);

    const url = 'https://us-central1-aiplatform.googleapis.com/v1/projects/text-embedding-project-456505/locations/us-central1/publishers/google/models/text-embedding-005:predict';
  
    const res = await client.request({
      url,
      method: 'POST',
      data: {
        instances: [{ content: text }]
      }
    });
  
    return res.data;
  }

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

