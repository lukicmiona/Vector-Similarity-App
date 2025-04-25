
window.onload = () => {
    showSection('inputSection');
    document.getElementById('urlInput')?.addEventListener('focusout',  validateUrl);
    addMainEventListeners();
};

function showSection(idToShow) {
    const sections = ['inputSection', 'loadingSection', 'resultSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === idToShow) ? 'block' : 'none';
    });
}


function addMainEventListeners() {
    const confirmBtn = document.getElementById('confirmBtn');
    if (!confirmBtn) return;

    confirmBtn.addEventListener('click', async () => {
        if (!validateKeywords() || !validateUrl()) return;

        const url = document.getElementById('urlInput').value.trim();
        const words = document.getElementById('keywordsInput').value.split(',').map(w => w.trim()).join(' ');
        showSection('loadingSection');


        const startTime = performance.now();

        try {
            const scrapeResult = await window.api.scrapeContent(url);
            if (!scrapeResult.success) throw new Error(scrapeResult.error);

            const [keywordsEmbedding, contentEmbedding] = await Promise.all([
                window.api.embedText(words),
                window.api.embedText(scrapeResult.content)
            ]);

            if (!keywordsEmbedding.success || !contentEmbedding.success) {
                throw new Error('Embedding failed');
            }

            const result = computeSimilarity(keywordsEmbedding, contentEmbedding);
            const duration = ((performance.now() - startTime) / 1000).toFixed(2);
            await loadResultsPage(result, words, url, duration);

        } catch (err) {
            console.error('Processing error:', err.message);
            showSection('inputSection');
            document.getElementById('errorMessage').textContent = err.message || 'An error occurred.';
            document.getElementById('errorMessage').style.display = 'block';

            addMainEventListeners();
        }
    });
}


function computeSimilarity(keywordsEmbedding, contentEmbedding) {
    const keywordVectors = keywordsEmbedding.data.predictions.map(p => window.api.normalizeVector(p.embeddings.values));
    const contentVector = window.api.normalizeVector(contentEmbedding.data.predictions[0].embeddings.values);

    const similarities = keywordVectors.map(vec => window.api.cosineSimilarity(vec, contentVector));
    const averageSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

    return {
        similarities,
        averagePercentage: window.api.toPercentage(averageSimilarity),
        vectorDimension: contentVector.length
    };
}

async function loadResultsPage({ similarities, averagePercentage, vectorDimension }, words, url, duration) {

    showSection('resultSection');


    requestAnimationFrame(() => {
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

        document.getElementById('newSearchBtn').addEventListener('click', () => {
            showSection('inputSection');
            addMainEventListeners();
        });
    });
}

function validateUrl() {
    const input = document.getElementById('urlInput');
    const errorDiv = document.getElementById('urlError');
    const result = window.api.validateUrlValue(input.value);
  
    input.classList.toggle('error', !result.isValid);
    errorDiv.textContent = result.isValid ? '' : result.error;
    return result.isValid;
  }
function validateKeywords() {
    const input = document.getElementById('keywordsInput');
    const errorDiv = document.getElementById('keywordsError');
    const result = window.api.validateKeywordsValue(input.value);

    input.classList.toggle('error', !result.isValid);
    errorDiv.textContent = result.isValid ? '' : result.error;
    return result.isValid;
}