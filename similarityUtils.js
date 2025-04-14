// similarityUtils.js

function normalizeVector(vec) {
    if (!Array.isArray(vec) || vec.length === 0) return [];
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? vec : vec.map(val => val / magnitude);
}

function cosineSimilarity(vec1, vec2) {
    if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length || vec1.length === 0) {
        throw new Error('Vectors must be non-empty and of the same length');
    }
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
}

function toPercentage(similarity) {
    const clamped = Math.max(0, Math.min(1, similarity));
    return parseFloat((clamped * 100).toFixed(2)); 
}

function countOccurrences(text, keywords) {
    if (typeof text !== 'string' || !Array.isArray(keywords)) return {};
    const wordArray = text.toLowerCase().split(/\W+/);
    const counts = {};
    keywords.forEach(k => {
        const lowerK = k.toLowerCase();
        counts[lowerK] = wordArray.filter(w => w === lowerK).length;
    });
    return counts;
}

module.exports = {
    normalizeVector,
    cosineSimilarity,
    toPercentage,
    countOccurrences
};
