const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const MODEL_URL = 'https://us-central1-aiplatform.googleapis.com/v1/projects/ve-tool-1/locations/us-central1/publishers/google/models/text-embedding-005:predict';

async function getAccessToken() {
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
}

async function getTextEmbedding(text) {
    try {
        const token = await getAccessToken();
        const response = await axios.post(MODEL_URL, {
            instances: [{ content: text }]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            success: true,
            embedding: response.data.predictions[0].embeddings.values
        };
    } catch (error) {
        console.error("Error in getTextEmbedding:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { getTextEmbedding };
