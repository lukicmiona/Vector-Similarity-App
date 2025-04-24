# Web Content Similarity Analyzer

This project is a desktop application built with Electron and Playwright that allows users to analyze the similarity between user-provided keywords and the content of any webpage. It uses Google's Vertex AI embedding model to compute semantic similarity and presents the results in a visually intuitive format.

## 🧠 Features

- Scrapes and cleans web content from user-specified URLs
- Converts HTML content into Markdown
- Uses Google's text-embedding model for generating vector representations
- Computes cosine similarity between keyword and content embeddings
- Visualizes the similarity score with an interactive UI
- Detects low-quality or non-readable web content
- Easy-to-use Electron-based GUI



## ⚙️ Requirements

- Node.js v16+
- Google Cloud account with access to Vertex AI API
- Playwright dependencies (auto-installed)
- Electron
- A valid `vertex.json` key file placed under `./credentials/`

## 🌐 How It Works

1.**User inputs** a webpage URL and a list of keywords  
2. The app **scrapes the page** using Playwright and extracts meaningful text  
3. The content and keywords are **embedded using Vertex AI's embedding model**  
4. **Cosine similarity** is calculated between the keyword and content embeddings  
5. Results are **displayed in the GUI**, showing similarity percentage, vector stats, and processing time  


## 🛡️ Technologies Used

- **Electron** – Cross-platform desktop app framework  
- **Playwright** – Browser automation for scraping  
- **Google Vertex AI** – Embedding model API  
- **Turndown** – Converts HTML to Markdown  
- **JSDOM** – Parses and manipulates HTML in Node  
- **@mozilla/readability** – Extracts readable content from webpages  



## 🛠️ Setup & Run

1. **Install dependencies:**

```bash
npm install

2. **Run the app**
npm start
