# Findings

## Research
### Mappings Strategy (Selenium -> Playwright)
- **Driver:** `WebDriver` -> `Page` / `BrowserContext`
- **Locators:** `By.id`, `By.xpath` -> `page.locator()` (Playwright is smart about selectors)
- **Waits:** `WebDriverWait`, `implicitlyWait` -> `await expect(...)` (Auto-waiting)
- **Assertions:** `Assert.assertEquals` -> `expect(locator).toHaveText()`
- **Test Structure:** `TestNG @Test` -> `test('name', async ({ page }) => { ... })`
- **Setup/Teardown:** `@BeforeMethod` -> `test.beforeEach`

### Constraints
- **Parsing:** Java is a strongly typed language. Parsing it purely with Regex might be brittle for complex classes, but for a "Converter" tool in this scope, pure AST parsing might be overkill. We will try a hybrid approach: robust Regex for standard patterns + string manipulation.
- **UI:** Needs to handle large code blocks.

## Discoveries
- N/A yet.
