const contentDiv = document.getElementById('content');
const { ipcRenderer } = require('electron');
const {validateKeywords} =require('./validation')
const {validateUrl} = require('./validation')

function loadHTML(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load file');
            }
            return response.text();
        })
        .then(data => {
            contentDiv.innerHTML = data;
            addEventListeners();
        })
        .catch(error => {
            console.error(error);
        });
}

// Load the input form (inputSection.html) when the page is ready
window.onload = function() {
    loadHTML('inputSection.html');
    document.getElementById('urlInput').addEventListener('focusout', validateUrl);
};

// Adding event listeners dynamically after HTML is loaded
function addEventListeners() {
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.addEventListener('click', async () => {
        const validKeywords = validateKeywords();
        const validUrl = validateUrl();

        if (validKeywords && validUrl) {
            loadHTML('loadingState.html');
            const url = document.getElementById('urlInput').value.trim();
            
            try {
                const result = await ipcRenderer.invoke('scrape-content', url);

                if (result.success) {
                    loadHTML('resultSection.html');
                    console.log('Scraped content:', result.content);
                    const embeddingResult = await ipcRenderer.invoke('embed-text', result.content);
                    if (embeddingResult.success) {
                        console.log('Embedding result:', embeddingResult.data);
                        console.log(embeddingResult);
                    } else {
                        console.error('Embedding failed:', embeddingResult.error);
                    }

                    const scrapedDataDiv = document.getElementById('scrapedData');
                    if (scrapedDataDiv) {
                        scrapedDataDiv.textContent = JSON.stringify(result.content, null, 2); 
                    } else {
                        console.warn('Element sa id="scrapedData" nije pronađen u resultSection.html');
                    }
                } else {
                    console.error('Scraping failed:', result.error);
                }
            } catch (error) {
                console.error('Error during scraping:', error);
                loadHTML('inputSection.html');
            }
        }
    });

    const newSearchBtn = document.getElementById('newSearchBtn');
    if (newSearchBtn) {
        newSearchBtn.addEventListener('click', () => {
            console.log("heeeeej")
            loadHTML('inputSection.html');
        });
    }
}
