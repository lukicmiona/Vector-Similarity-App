const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('google-auth-library', () => {
  return {
    GoogleAuth: jest.fn().mockImplementation(() => ({
      getClient: mockGetClient
    }))
  };
});

const mockRequest = jest.fn();
const mockGetClient = jest.fn().mockResolvedValue({
  request: mockRequest
});

const { getEmbedding } = require('../src/scripts/embeddingService');

describe('Embedding service (mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns valid embedding vector for simple input', async () => {
    const fakeResponse = {
      data: {
        predictions: [
          { embeddings: { values: [0.1, 0.2, 0.3] } }
        ]
      }
    };

    mockRequest.mockResolvedValue(fakeResponse);

    const res = await getEmbedding("Hello world");
    expect(res).toHaveProperty('predictions');
    expect(res.predictions[0].embeddings.values.length).toBeGreaterThan(0);
  });

  it('handles empty string gracefully', async () => {
  
    mockRequest.mockRejectedValue(new Error('Invalid input'));

    await expect(getEmbedding("")).rejects.toThrow('Vertex AI embedding failed: Invalid input');
  });
});
