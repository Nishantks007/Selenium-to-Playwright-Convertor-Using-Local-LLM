const axios = require('axios');

/**
 * Check if Ollama is running and CodeLlama is available
 * @returns {Promise<Object>} - Status object with availability info
 */
async function checkOllamaStatus() {
    try {
        const response = await axios.get('http://localhost:11434/api/tags', {
            timeout: 2000
        });

        const models = response.data.models || [];
        const hasCodeLlama = models.some(m => m.name.includes('codellama'));

        return {
            available: true,
            hasCodeLlama: hasCodeLlama,
            models: models.map(m => m.name)
        };
    } catch (error) {
        return {
            available: false,
            hasCodeLlama: false,
            error: error.message
        };
    }
}

module.exports = { checkOllamaStatus };
