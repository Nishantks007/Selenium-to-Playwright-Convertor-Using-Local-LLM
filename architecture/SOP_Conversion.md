# SOP: Selenium Java to Playwright TS Conversion

## Input Payload
- **Source:** Java Strings (Selenium + TestNG syntax).
- **Format:** Class-based TestNG structure.

## Output Payload
- **Target:** TypeScript Playwright file (`.spec.ts`).
- **Format:** Functional `test()` blocks inside a `test.describe()`.

## Core Logic Mappings

### 1. Test Structure
- `public class LoginTest { ... }` -> `test.describe('LoginTest', () => { ... });`
- `@Test public void verifyLogin() { ... }` -> `test('verifyLogin', async ({ page }) => { ... });`
- `@BeforeMethod` -> `test.beforeEach(async ({ page }) => { ... });`
- `@AfterMethod` -> `test.afterEach(async ({ page }) => { ... });`

### 2. Locators
- `driver.findElement(By.id("username"))` -> `page.locator('#username')`
- `driver.findElement(By.cssSelector(".btn"))` -> `page.locator('.btn')`
- `driver.findElement(By.xpath("//div"))` -> `page.locator('xpath=//div')`

### 3. Actions
- `.sendKeys("text")` -> `.fill('text')`
- `.click()` -> `.click()`
- `.getText()` -> `await .textContent()` (or usage in assertion)

### 4. Waits
- `Thread.sleep(1000)` -> `await page.waitForTimeout(1000)` (Discouraged but mapped)
- Implicit waits -> *Remove* (Playwright auto-waits)
- Explicit waits `wait.until(...)` -> `await expect(...).toBeVisible()`

### 5. Assertions
- `Assert.assertEquals(actual, expected)` -> `expect(actual).toBe(expected)`
- `Assert.assertTrue(condition)` -> `expect(condition).toBeTruthy()`

## Edge Cases
- **Page Object Model:** If input contains `PageFactory`, warn user or attempt a class-to-class conversion.
- **Complex Logic:** Convert loops/logic as-is (syntax might break if Java specific features like Streams are used).
