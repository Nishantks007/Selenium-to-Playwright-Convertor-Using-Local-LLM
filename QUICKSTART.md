# Quick Start Guide

## 🚀 Running the Converter

### Step 1: Start the Backend Server
```bash
node server/index.js
```
✅ Server running on http://localhost:3000

### Step 2: Start the Frontend
```bash
cd client
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 3: Open in Browser
Navigate to **http://localhost:5173**

---

## 🎯 Testing the Converter

1. Click **"📝 Load Sample"** to load example Selenium code
2. Click **"🚀 Convert to Playwright"**
3. View the converted code in the right panel
4. Check `converted_output/` directory for saved files

---

## 📋 Example Conversion

**Input (Selenium Java):**
```java
@Test
public void testLogin() {
    driver.findElement(By.id("username")).sendKeys("test");
}
```

**Output (Playwright TypeScript):**
```typescript
test('testLogin', async ({ page }) => {
    page.locator('#username').fill("test");
});
```

---

## 🛠️ Troubleshooting

**Backend not connecting?**
- Ensure server is running on port 3000
- Check `node server/index.js` output

**Frontend not loading?**
- Ensure Vite dev server is running
- Check `npm run dev` output in client directory

**CORS errors?**
- Server has CORS enabled by default
- Restart both servers if issues persist
