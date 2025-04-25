const { contextBridge, ipcRenderer } = require('electron');
const { validateUrlValue, validateKeywordsValue } = require('./src/scripts/validation.js');

const { normalizeVector, cosineSimilarity, toPercentage } = require('./src/scripts/similarityUtils.js');


contextBridge.exposeInMainWorld('api', {
  scrapeContent: (url) => ipcRenderer.invoke('scrape-content', url),
  embedText: (text) => ipcRenderer.invoke('embed-text', text),

  validateUrlValue,
  validateKeywordsValue,

  normalizeVector,
  cosineSimilarity,
  toPercentage
});
