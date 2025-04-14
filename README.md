# Vector Similarity App

## Description
Electron-based application that analyzes content similarity between user-provided keywords and webpage content using Google Vertex AI.

## Features
- URL scraping
- Filtering of ads/navigation/footers
- Support for blogs, articles, product pages
- Keyword comparison with vector embeddings
- Similarity percentage calculation
- Responsive UI
- Export and history features (upcoming)

## Tech Stack
- Electron.js
- Google Vertex AI
- Playwright
- Node.js

## Folder Structure

- `main.js` - Electron app main process
- `contentScraper.js` - Scraper logic using Playwright
- `renderer.js` - Frontend logic
- `validation.js` - Input validation
- `similarityUtils.js` - Embedding and similarity calculations

## Set up 
```bash
npm install
npm start
npm test
