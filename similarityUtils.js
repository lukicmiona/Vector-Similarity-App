function normalizeVector(vec) {
    console.log("Tu sam i ovo je vektor"+vec)
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return vec.map(val => val / magnitude);
}

function cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
        throw new Error('Vectors must be of same length');
    }

    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
}

function toPercentage(similarity) {
    return (similarity * 100).toFixed(2) + '%';
}

function countOccurrences(text, keywords) {
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