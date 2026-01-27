# Project Constitution (gemini.md)

## 0. North Star
 **Develop a Web-based Selenium Java to Playwright (JS/TS) Converter.**
 - **Input:** User pastes Selenium Java (TestNG) code into a UI.
 - **Output:** UI displays converted Playwright code; System saves files to a specific directory.
 - **Goal:** Prioritize readability and idiomatic Playwright code over strict 1:1 mapping.

## 1. Data Schemas

### Core Domain: Conversion
**Input Payload:**
```json
{
  "sourceCode": "string (Java code)",
  "sourceType": "TestNG | Selenium",
  "targetLanguage": "TypeScript | JavaScript"
}
```

**Output Payload:**
```json
{
  "convertedCode": "string (Playwright code)",
  "status": "success | error",
  "notes": ["string (e.g., 'Refactored implicit wait to manual await')"],
  "filePath": "string (e.g., 'tests/converted_test.spec.ts')"
}
```

## 2. Behavioral Rules
- **Readability First:** Do not force Java patterns (like Page Factory) if they result in unreadable JS/TS. Use Playwright's native locator strategies.
- **Conversion Scope:** Focus on TestNG annotations (`@Test`, `@BeforeMethod`, etc.) and Selenium interactions (`findElement`, `sendKeys`, etc.).
- **UI Experience:** The UI must be "vibrant and premium" (per global instructions). No generic designs.
- **File System:** Converted files should be saved to a `converted_output/` directory for easy access.

## 3. Architectural Invariants
- **Frontend:** React + Vite (for state management and fast dev loop).
- **Styling:** Vanilla CSS with glassmorphism and vibrant gradients.
- **Logic Layer:** Functional conversion logic separated from UI components.
- **AI Integration:** Ollama API with CodeLlama model for intelligent code conversion.
  - **Primary Mode:** CodeLlama AI (context-aware, intelligent conversion)
  - **Fallback Mode:** Regex-based converter (deterministic, fast)
  - **Auto-detection:** System checks Ollama availability on startup
- **State:** Local state for input/output; File system access via Node.js backend.
- **Backend:** Lightweight Express.js server for API and file operations.

## 4. Maintenance Log
*To be updated throughout the project.*
