"""
Check if Selenium environment is properly configured.
Run this first: python tests/selenium/check_env.py
"""

import os
import sys

def check_brave():
    """Check if Brave browser is installed."""
    brave_paths = [
        r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
        r"C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"),
    ]
    for path in brave_paths:
        if os.path.exists(path):
            return path
    return None

def check_chromedriver():
    """Check if ChromeDriver is available."""
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.service import Service
        driver = webdriver.Chrome()
        driver.quit()
        return True
    except Exception as e:
        return str(e)

def check_selenium():
    """Check if Selenium is installed."""
    try:
        import selenium
        return selenium.__version__
    except ImportError:
        return None

print("=" * 50)
print("C2S Selenium Environment Check")
print("=" * 50)

# Check Python version
print(f"\nPython version: {sys.version}")

# Check Selenium
selenium_version = check_selenium()
if selenium_version:
    print(f"[OK] Selenium installed (v{selenium_version})")
else:
    print("[FAIL] Selenium not installed. Run: pip install selenium")

# Check Brave
brave_path = check_brave()
if brave_path:
    print(f"[OK] Brave found at: {brave_path}")
else:
    print("[FAIL] Brave not found. Install Brave or update path in tests.")

# Check ChromeDriver
print("\nChecking ChromeDriver (this may take a moment)...")
result = check_chromedriver()
if result is True:
    print("[OK] ChromeDriver is working")
else:
    print(f"[FAIL] ChromeDriver issue: {result}")
    print("\nTo fix:")
    print("1. Download ChromeDriver from: https://chromedriver.chromium.org/")
    print("2. Add it to your PATH, or place it in the tests/selenium folder")

print("\n" + "=" * 50)
