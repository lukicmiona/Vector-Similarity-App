const contentDiv = document.getElementById('content');
const { ipcRenderer } = require('electron');
const {validateKeywords} =require('./validation')
const {validateUrl} = require('./validation')
const { normalizeVector, cosineSimilarity, toPercentage } = require('./similarityUtils');


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
            const words = document.getElementById('keywordsInput').value.split(',').map(word => word.trim()).join(' ');
           

     
            try {
                const result = await ipcRenderer.invoke('scrape-content', url);

                if (result.success) {
                    
                    console.log('Scraped content:', result.content);
                    
                    try {
                        const keywordsEmbedding = await ipcRenderer.invoke('embed-text', words);
                        
                        const contentEmbedding = await ipcRenderer.invoke('embed-text', result.content);
                        
                        console.log(keywordsEmbedding);
                        if (keywordsEmbedding.success && contentEmbedding.success) {
                            const keywordVectors = keywordsEmbedding.data.predictions.map(p => normalizeVector(p.embeddings.values));
                            const contentVector = normalizeVector(contentEmbedding.data.predictions[0].embeddings.values);
                    
                            const similarities = keywordVectors.map(vec => cosineSimilarity(vec, contentVector));
                            const percentages = similarities.map(toPercentage);
                    
                            console.log('Slicnosti po kljucnoj reci:', percentages);
                            loadHTML('resultSection.html');
                            
                        } else {
                            console.error('Embedding error');
                        }
                    } catch (err) {
                        console.error('Embedding error:', err);
                    }
                    
                } else {
                    console.error('Scraping failed:', result.error);
                    loadHTML('inputSection.html');
                }
            } catch (error) {
                console.error('Error during scraping:', error);
                loadHTML('inputSection.html');
            }
        }
    });

    console.log("Stigla sam dovde")
    const newSearchBtn = document.getElementById('newSearchBtn');
    if (newSearchBtn) {
        newSearchBtn.addEventListener('click', () => {
            console.log("heeeeej")
            loadHTML('inputSection.html');
        });
    }
}
