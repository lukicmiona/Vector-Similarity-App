require('dotenv').config();
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

async function getEmbedding(text) {
  try {
    const client = await auth.getClient();

    const url = `https://${process.env.VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${process.env.VERTEX_PROJECT_ID}/locations/${process.env.VERTEX_LOCATION}/publishers/${process.env.VERTEX_PUBLISHER}/models/${process.env.VERTEX_MODEL}:predict`;

    const res = await client.request({
      url,
      method: 'POST',
      data: {
        instances: [{ content: text }]
      }
    });

    return res.data;
  } catch (err) {
    console.error('getEmbedding failed:', err.stack || err.message);
    throw new Error('Vertex AI embedding failed: ' + err.message);
  }
}

module.exports = { getEmbedding };
