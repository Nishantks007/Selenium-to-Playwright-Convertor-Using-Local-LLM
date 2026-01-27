const axios = require('axios');

/**
 * Ollama API Configuration
 */
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'codellama:latest';

/**
 * Convert Selenium Java code to Playwright TypeScript using CodeLlama
 * @param {string} javaCode - The Selenium Java code to convert
 * @returns {Promise<string>} - The converted Playwright TypeScript code
 */
async function convertWithOllama(javaCode) {
    const prompt = `You are an expert in converting Selenium Java (TestNG) tests to Playwright TypeScript.

TASK: Convert the following Selenium Java code to Playwright TypeScript.

RULES:
1. Use the Playwright fixtures: test('description', async ({ page }) => { ... })
2. DO NOT create a new context or page inside the test unless explicitly required. Use the provided { page } fixture.
3. Convert @Test methods to individual test() blocks.
4. Convert @BeforeMethod to test.beforeEach(async ({ page }) => { ... }).
5. Convert @AfterMethod to test.afterEach(async ({ page }) => { ... }).
6. Convert driver.findElement(By.id("x")) to page.locator('#x').
7. Convert driver.findElement(By.cssSelector(".x")) to page.locator('.x').
8. Convert driver.findElement(By.xpath("//x")) to page.locator('xpath=//x').
9. Convert .sendKeys("text") to .fill('text').
10. Convert .click() to .click().
11. Convert .getText() to .textContent().
12. Convert Assert.assertEquals(a, b) to expect(a).toBe(b).
13. Convert Assert.assertTrue(x) to expect(x).toBeTruthy().
14. Add proper imports: import { test, expect } from '@playwright/test'.
15. Use await for all Playwright actions (click, fill, navigate, etc.).
16. Wrap related tests in a test.describe() block based on the Java class name.
17. Remove ALL Java-specific code: package, imports, class declarations (convert to describe), and types like String/int (convert to const/let).
18. Prioritize readability and modern Playwright best practices.

INPUT CODE:
\`\`\`java
${javaCode}
\`\`\`

OUTPUT: Provide ONLY the clean, converted Playwright TypeScript code. No explanations, no markdown blocks, no commentary.`;

    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.1, // Low temperature for more deterministic output
                top_p: 0.9,
                top_k: 40
            }
        });

        if (response.data && response.data.response) {
            let convertedCode = response.data.response.trim();

            // Clean up any markdown code blocks if present
            convertedCode = convertedCode.replace(/```typescript\n?/g, '');
            convertedCode = convertedCode.replace(/```ts\n?/g, '');
            convertedCode = convertedCode.replace(/```javascript\n?/g, '');
            convertedCode = convertedCode.replace(/```js\n?/g, '');
            convertedCode = convertedCode.replace(/```\n?/g, '');

            return convertedCode.trim();
        } else {
            throw new Error('Invalid response from Ollama API');
        }
    } catch (error) {
        console.error('Ollama API Error:', error.message);
        throw new Error(`Failed to convert code using Ollama: ${error.message}`);
    }
}

/**
 * Fallback regex-based converter (if Ollama is unavailable)
 */
function convertWithRegex(javaCode) {
    let tsCode = javaCode;

    // Basic Cleanup
    tsCode = tsCode.replace(/package\s+[\w\.]+;/g, '// package removed');
    tsCode = tsCode.replace(/import\s+[\w\.]+;/g, '');

    // Class Structure -> describe
    const classMatch = tsCode.match(/public\s+class\s+(\w+)\s*\{/);
    if (classMatch) {
        const className = classMatch[1];
        tsCode = tsCode.replace(/public\s+class\s+\w+\s*\{/, `test.describe('${className}', () => {`);
    }

    // Methods -> test
    tsCode = tsCode.replace(/@Test\s+public\s+void\s+(\w+)\(\)\s*\{/g, "test('$1', async ({ page }) => {");
    tsCode = tsCode.replace(/@BeforeMethod\s+public\s+void\s+(\w+)\(\)\s*\{/g, "test.beforeEach(async ({ page }) => {");

    // Driver Actions
    tsCode = tsCode.replace(/driver\.findElement\(By\.id\("(.+?)"\)\)/g, "page.locator('#$1')");
    tsCode = tsCode.replace(/driver\.findElement\(By\.cssSelector\("(.+?)"\)\)/g, "page.locator('$1')");
    tsCode = tsCode.replace(/driver\.findElement\(By\.xpath\("(.+?)"\)\)/g, "page.locator('xpath=$1')");
    tsCode = tsCode.replace(/\.sendKeys\("/g, ".fill(\"");
    tsCode = tsCode.replace(/\.click\(\)/g, ".click()");

    // Assertions
    tsCode = tsCode.replace(/Assert\.assertEquals\((.+?),\s*(.+?)\);/g, "expect($1).toBe($2);");

    // Cleanup Java Syntax
    tsCode = tsCode.replace(/System\.out\.println/g, "console.log");
    tsCode = tsCode.replace(/String\s+(\w+)\s*=/g, "const $1 =");
    tsCode = tsCode.replace(/int\s+(\w+)\s*=/g, "const $1 =");
    tsCode = tsCode.replace(/boolean\s+(\w+)\s*=/g, "const $1 =");

    // Add Imports
    const imports = "import { test, expect } from '@playwright/test';\n\n";

    return imports + tsCode;
}

/**
 * Main conversion function with fallback
 */
async function convertJavaToPlaywright(javaCode, useOllama = true) {
    if (useOllama) {
        try {
            console.log('🤖 Using CodeLlama for conversion...');
            return await convertWithOllama(javaCode);
        } catch (error) {
            console.warn('⚠️  Ollama conversion failed, falling back to regex:', error.message);
            return convertWithRegex(javaCode);
        }
    } else {
        console.log('📝 Using regex-based conversion...');
        return convertWithRegex(javaCode);
    }
}

module.exports = { convertJavaToPlaywright, convertWithOllama, convertWithRegex };
