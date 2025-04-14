const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: './credentials/vertex.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

async function getEmbedding(text) {
  const client = await auth.getClient();

  const url = 'https://us-central1-aiplatform.googleapis.com/v1/projects/text-embedding-project-456505/locations/us-central1/publishers/google/models/text-embedding-005:predict';

  const res = await client.request({
    url,
    method: 'POST',
    data: {
      instances: [{ content: text }]
    }
  });

  return res.data;
}

module.exports = { getEmbedding };
