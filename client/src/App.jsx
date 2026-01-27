import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-typescript';
import './App.css';

const SAMPLE_JAVA_CODE = `package com.example.tests;

import org.testng.annotations.Test;
import org.testng.annotations.BeforeMethod;
import org.testng.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LoginTest {
    WebDriver driver;
    
    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.get("https://example.com/login");
    }
    
    @Test
    public void verifyLogin() {
        driver.findElement(By.id("username")).sendKeys("testuser");
        driver.findElement(By.id("password")).sendKeys("password123");
        driver.findElement(By.cssSelector(".login-btn")).click();
        
        String welcomeText = driver.findElement(By.xpath("//h1")).getText();
        Assert.assertEquals(welcomeText, "Welcome!");
    }
}`;

function App() {
  const [sourceCode, setSourceCode] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [status, setStatus] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [useOllama, setUseOllama] = useState(true);

  const LOADING_STEPS = [
    "🤖 Connecting to Ollama...",
    "🔥 Heating up CodeLlama...",
    "🧠 Analyzing Java patterns...",
    "✨ Generating Playwright spec...",
    "📝 Polishing the final code...",
    "🚀 Almost there..."
  ];

  // Check Ollama status on mount
  useEffect(() => {
    checkOllamaHealth();
  }, []);

  // Cycle loading steps
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Update Prism highlighting when code changes
  useEffect(() => {
    Prism.highlightAll();
  }, [convertedCode, sourceCode, loading]);

  const checkOllamaHealth = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      setOllamaStatus(data.ollama);
    } catch (error) {
      console.error('Failed to check Ollama status:', error);
    }
  };

  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      setStatus({ type: 'error', message: 'Please enter some Java code to convert' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('http://localhost:3000/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceCode, useOllama }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setConvertedCode(data.convertedCode);
        const method = data.usedOllama ? '🤖 CodeLlama AI' : '📝 Regex';
        setStatus({
          type: 'success',
          message: `✨ Conversion successful using ${method} (${data.conversionTime}ms)`
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Conversion failed' });
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setStatus({ type: 'error', message: 'Failed to connect to server. Make sure the backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setSourceCode(SAMPLE_JAVA_CODE);
    setConvertedCode('');
    setStatus(null);
  };

  const handleClear = () => {
    setSourceCode('');
    setConvertedCode('');
    setStatus(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode);
    setStatus({ type: 'success', message: '📋 Copied to clipboard!' });
    setTimeout(() => setStatus(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([convertedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_test.spec.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus({ type: 'success', message: '💾 Download started!' });
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header fade-in-up">
          <h1>Selenium → Playwright</h1>
          <p>Transform your TestNG Selenium tests into modern Playwright code with a single click</p>

          {/* Ollama Status & Toggle */}
          <div className="ollama-controls">
            {ollamaStatus && (
              <div className="ollama-status">
                <span className={`status-indicator ${ollamaStatus.available ? 'status-online' : 'status-offline'}`}>
                  {ollamaStatus.available ? '🟢' : '🔴'}
                </span>
                <span className="status-text">
                  {ollamaStatus.available
                    ? `CodeLlama ${ollamaStatus.hasCodeLlama ? 'Ready' : 'Not Found'}`
                    : 'Ollama Offline'}
                </span>
              </div>
            )}

            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={useOllama}
                onChange={(e) => setUseOllama(e.target.checked)}
                disabled={!ollamaStatus?.available || !ollamaStatus?.hasCodeLlama}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                {useOllama ? '🤖 AI Mode' : '📝 Regex Mode'}
              </span>
            </label>
          </div>
        </header>

        {/* Status Messages */}
        {status && (
          <div className={`status-message status-${status.type}`}>
            <span>{status.message}</span>
          </div>
        )}

        {/* Converter Grid */}
        <div className="converter-container">
          {/* Input Panel */}
          <div className="editor-panel">
            <div className="panel-header glass-card">
              <div className="panel-title">
                <span>☕</span>
                <span>Selenium Java (TestNG)</span>
              </div>
              <span className="language-badge badge-java">Input</span>
            </div>
            <div className="code-editor glass-card">
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="Paste your Selenium Java code here..."
                spellCheck="false"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="editor-panel">
            <div className="panel-header glass-card">
              <div className="panel-title">
                <span>🎭</span>
                <span>Playwright TypeScript</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {convertedCode && (
                  <>
                    <button className="copy-button" onClick={handleDownload}>
                      💾 Download
                    </button>
                    <button className="copy-button" onClick={handleCopy}>
                      📋 Copy
                    </button>
                  </>
                )}
                <span className="language-badge badge-playwright">Output</span>
              </div>
            </div>
            <div className="code-editor glass-card">
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p className="loading-text">{LOADING_STEPS[loadingStep]}</p>
                </div>
              ) : (
                <div className="output-area">
                  <pre className="line-numbers">
                    <code className="language-typescript">
                      {convertedCode || '// Converted code will appear here...'}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <button className="btn btn-secondary" onClick={handleLoadSample}>
            📝 Load Sample
          </button>
          <button
            className="convert-button"
            onClick={handleConvert}
            disabled={loading || !sourceCode.trim()}
          >
            {loading ? '⚡ Converting...' : '🚀 Convert to Playwright'}
          </button>
          <button className="btn btn-secondary" onClick={handleClear}>
            🗑️ Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
