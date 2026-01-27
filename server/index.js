const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { checkOllamaStatus } = require('../tools/ollamaHealth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    const ollamaStatus = await checkOllamaStatus();
    res.json({
        status: 'ok',
        version: '2.0.0',
        ollama: ollamaStatus
    });
});

const { convertJavaToPlaywright } = require('../tools/converter');
const { saveConvertedFile } = require('../tools/fileWriter');

// Conversion Endpoint
app.post('/api/convert', async (req, res) => {
    try {
        const { sourceCode, fileName, useOllama = true } = req.body;
        if (!sourceCode) {
            return res.status(400).json({ status: 'error', message: 'No source code provided' });
        }

        console.log(`🚀 Converting code (Ollama: ${useOllama})...`);
        const startTime = Date.now();

        const convertedCode = await convertJavaToPlaywright(sourceCode, useOllama);

        const conversionTime = Date.now() - startTime;
        console.log(`✅ Conversion completed in ${conversionTime}ms`);

        // Save to file system
        const outputFileName = fileName || 'converted_test.spec.ts';
        const filePath = saveConvertedFile(convertedCode, outputFileName);

        res.json({
            convertedCode,
            status: 'success',
            filePath: filePath,
            conversionTime: conversionTime,
            usedOllama: useOllama,
            notes: [
                useOllama ? 'Converted using CodeLlama AI' : 'Converted using regex patterns',
                'File saved to converted_output/'
            ]
        });
    } catch (error) {
        console.error('Conversion Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
