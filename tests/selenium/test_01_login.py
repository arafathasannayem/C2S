"""
Test 1: Admin Login
Tests that an admin can log in and is redirected to the dashboard.
"""

import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


def get_brave_driver():
    options = Options()
    options.binary_location = r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver


BASE_URL = "http://localhost:3000"


class TestAdminLogin(unittest.TestCase):
    def setUp(self):
        self.driver = get_brave_driver()
        self.driver.implicitly_wait(10)

    def tearDown(self):
        self.driver.quit()

    def test_admin_login_success(self):
        self.driver.get(f"{BASE_URL}/login")
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys("admin@c2s.com")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys("admin123")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        self.assertIn("/dashboard", self.driver.current_url)

    def test_admin_login_invalid_credentials(self):
        self.driver.get(f"{BASE_URL}/login")
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys("wrong@c2s.com")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys("wrongpassword")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(self.driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".login-error-banner"))
        )


if __name__ == "__main__":
    unittest.main()
