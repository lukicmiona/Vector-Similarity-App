const { ipcRenderer } = require('electron');
const { validateKeywords, validateUrl } = require('./validation');
const { normalizeVector, cosineSimilarity, toPercentage } = require('./similarityUtils');

const contentDiv = document.getElementById('content');

window.onload = () => {
    loadHTML('inputSection.html').then(() => {
        document.getElementById('urlInput')?.addEventListener('focusout', validateUrl);
        addMainEventListeners();
    });
};

async function loadHTML(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Failed to load file');
        const html = await response.text();
        contentDiv.innerHTML = html;
    } catch (error) {
        console.error('Error loading HTML:', error);
    }
}

function addMainEventListeners() {
    const confirmBtn = document.getElementById('confirmBtn');
    if (!confirmBtn) return;

    confirmBtn.addEventListener('click', async () => {
        if (!validateKeywords() || !validateUrl()) return;

        const url = document.getElementById('urlInput').value.trim();
        const words = document.getElementById('keywordsInput').value.split(',').map(w => w.trim()).join(' ');
        await loadHTML('loadingState.html');

        const startTime = performance.now();

        try {
            const scrapeResult = await ipcRenderer.invoke('scrape-content', url);
            if (!scrapeResult.success) throw new Error(scrapeResult.error);

            const [keywordsEmbedding, contentEmbedding] = await Promise.all([
                ipcRenderer.invoke('embed-text', words),
                ipcRenderer.invoke('embed-text', scrapeResult.content)
            ]);

            if (!keywordsEmbedding.success || !contentEmbedding.success) {
                throw new Error('Embedding failed');
            }

            const result = computeSimilarity(keywordsEmbedding, contentEmbedding);
            const duration = ((performance.now() - startTime) / 1000).toFixed(2);
            await loadResultsPage(result, words, url, duration);

        } catch (err) {
            console.error('Processing error:', err.message);
            await loadHTML('inputSection.html');
            addMainEventListeners();
        }
    });
}


function computeSimilarity(keywordsEmbedding, contentEmbedding) {
    const keywordVectors = keywordsEmbedding.data.predictions.map(p => normalizeVector(p.embeddings.values));
    const contentVector = normalizeVector(contentEmbedding.data.predictions[0].embeddings.values);

    const similarities = keywordVectors.map(vec => cosineSimilarity(vec, contentVector));
    const averageSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

    return {
        similarities,
        averagePercentage: toPercentage(averageSimilarity),
        vectorDimension: contentVector.length
    };
}

async function loadResultsPage({ similarities, averagePercentage, vectorDimension }, words, url, duration) {
    await loadHTML('resultSection.html');

    setTimeout(() => {
        document.getElementById('keywordUsed').textContent = words;
        document.getElementById('urlAnalized').textContent = url;
        document.getElementById('analysisTime').textContent = `Analysis completed in ${duration} seconds.`;
        document.getElementById('extraInfo').textContent = `Vector dimension: ${vectorDimension}`;
        document.getElementById('matchPercent').textContent = `${averagePercentage}%`;

        const matchCircle = document.getElementById('matchCircle');
        matchCircle.style.background = `conic-gradient(
            ${averagePercentage >= 75 ? 'green' : averagePercentage >= 50 ? 'orange' : 'red'} ${averagePercentage}%,
            #eee ${averagePercentage}%
        )`;

        const newSearchBtn = document.getElementById('newSearchBtn');
        newSearchBtn?.addEventListener('click', async () => {
            await loadHTML('inputSection.html');
            addMainEventListeners();
        });
    }, 100);
}
