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

function toPercentage(value) {
    const clamped = Math.min(Math.max(value, 0), 1);
    return (clamped * 100).toFixed(2);
}



module.exports = {
    normalizeVector,
    cosineSimilarity,
    toPercentage
};
