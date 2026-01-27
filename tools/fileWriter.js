const fs = require('fs');
const path = require('path');

/**
 * Save converted code to filesystem
 * @param {string} convertedCode - The Playwright code
 * @param {string} fileName - Name for the output file
 * @returns {string} - Path where file was saved
 */
function saveConvertedFile(convertedCode, fileName = 'converted_test.spec.ts') {
    const outputDir = path.join(__dirname, '../../converted_output');

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate unique filename if file exists
    let finalFileName = fileName;
    let counter = 1;
    const baseName = path.basename(fileName, path.extname(fileName));
    const ext = path.extname(fileName);

    while (fs.existsSync(path.join(outputDir, finalFileName))) {
        finalFileName = `${baseName}_${counter}${ext}`;
        counter++;
    }

    const filePath = path.join(outputDir, finalFileName);
    fs.writeFileSync(filePath, convertedCode, 'utf8');

    return filePath;
}

module.exports = { saveConvertedFile };
