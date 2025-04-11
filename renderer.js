const contentDiv = document.getElementById('content');
const { ipcRenderer } = require('electron');

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

// Validate the input URL
function validateUrl() {
    const input = document.getElementById('urlInput');
    const errorDiv = document.getElementById('urlError');
    const url = input.value.trim();

    input.classList.remove('error');
    errorDiv.textContent = '';

    const urlPattern = /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (!url || !urlPattern.test(url)) {
        errorDiv.textContent = 'Please enter a valid URL (e.g. https://example.com).';
        input.classList.add('error');
        return false;
    }

    return true;
}

// Validate the input keywords
function validateKeywords() {
    const input = document.getElementById('keywordsInput');
    const errorDiv = document.getElementById('keywordsError');
    const keywords = input.value.trim();

    input.classList.remove('error');
    errorDiv.textContent = '';

    if (keywords.length < 3) {
      errorDiv.textContent = 'Keywords must be at least 3 characters.';
      input.classList.add('error');
      return false;
    }

    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k !== '');
    if (keywordList.length > 10) {
      errorDiv.textContent = 'Maximum of 10 keywords allowed.';
      input.classList.add('error');
      return false;
    }

    const keywordPattern = /^[a-zA-Z0-9\s,]+$/;
    if (!keywordPattern.test(keywords)) {
      errorDiv.textContent = 'Only letters, numbers, spaces, and commas are allowed.';
      input.classList.add('error');
      return false;
    }

    return true;
}


