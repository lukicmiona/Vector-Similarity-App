const {
    normalizeVector,
    cosineSimilarity,
    toPercentage,
    countOccurrences
} = require('../src/scripts/similarityUtils');

describe('normalizeVector', () => {
    test('normalizes a non-zero vector correctly', () => {
        const vec = [3, 4];
        const normalized = normalizeVector(vec);
        expect(normalized.length).toBe(vec.length);
        expect(normalized[0]).toBeCloseTo(0.6);
        expect(normalized[1]).toBeCloseTo(0.8);
    });

    test('returns same vector if magnitude is 0', () => {
        expect(normalizeVector([0, 0])).toEqual([0, 0]);
    });

    test('returns empty array for empty input', () => {
        expect(normalizeVector([])).toEqual([]);
    });

    test('returns empty array for invalid input', () => {
        expect(normalizeVector(null)).toEqual([]);
        expect(normalizeVector('not a vector')).toEqual([]);
    });
});

describe('cosineSimilarity', () => {
    test('calculates cosine similarity of two vectors', () => {
        const a = [1, 0];
        const b = [0, 1];
        expect(cosineSimilarity(a, b)).toBeCloseTo(0);
    });

    test('returns 1 for identical vectors', () => {
        const a = [1, 2, 3];
        expect(cosineSimilarity(a, a)).toBeCloseTo(1);
    });

    test('throws error on mismatched vector lengths', () => {
        expect(() => cosineSimilarity([1, 2], [1])).toThrow();
    });

    test('throws error on empty vectors', () => {
        expect(() => cosineSimilarity([], [])).toThrow();
    });
});

describe('toPercentage', () => {
    test('converts similarity to percentage string', () => {
        expect(toPercentage(0.4567)).toBe('45.67');
    });

    test('clamps values below 0 to 0%', () => {
        expect(toPercentage(-0.5)).toBe('0.00');
    });

    test('clamps values above 1 to 100%', () => {
        expect(toPercentage(1.5)).toBe('100.00');
    });
});

