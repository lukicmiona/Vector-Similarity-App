# Vector Similarity App

## Description
Electron-based application that analyzes content similarity between user-provided keywords and webpage content using Google Vertex AI.
 Web Content Scraper & Formatter

This module transforms scraped HTML content into clean, well-structured Markdown, optimized for Retrieval-Augmented Generation (RAG) pipelines.

## Features
- URL scraping
- Filtering of ads/navigation/footers
- Support for blogs, articles, product pages
- Keyword comparison with vector embeddings
- Similarity percentage calculation
- Responsive UI
- Export and history features (upcoming)

- Removes ads, headers, footers, scripts, and other irrelevant elements
- Preserves heading structure
- Converts lists and code blocks properly
- Handles special HTML entities and cleans artifacts
- Outputs plain Markdown, ready for embedding or vectorization

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

## Google Vertex AI Integration

This app uses [Google Vertex AI](https://cloud.google.com/vertex-ai) for embedding generation.

## Set up 
```bash
npm install
npm start
npm test
### Setup

1. Create a Google Cloud project.
2. Enable Vertex AI API.
3. Generate a service account key and download it as `vertex.json`.
4. Place it in `credentials/vertex.json` (add to `.gitignore`!).


