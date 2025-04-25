const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { getEmbedding } = require('../src/scripts/embeddingService');

describe('Embedding service', () => {
  it('returns valid embedding vector for simple input', async () => {
    const res = await getEmbedding("Hello world");
    expect(res).toHaveProperty('predictions');
    expect(Array.isArray(res.predictions)).toBe(true);
    expect(res.predictions[0].embeddings.values.length).toBeGreaterThan(0);
  });

  it('handles empty string gracefully', async () => {
    await expect(getEmbedding("")).rejects.toThrow();
  });
});
