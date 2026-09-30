"""
Test 4: Role-Based Access Control
Tests that different roles see different navigation items.
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


class TestRoleBasedAccess(unittest.TestCase):
    def setUp(self):
        self.driver = get_brave_driver()
        self.driver.implicitly_wait(10)

    def tearDown(self):
        self.driver.quit()

    def _login(self, email, password):
        self.driver.get(f"{BASE_URL}/login")
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys(email)
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    def test_admin_sees_all_nav_items(self):
        self._login("admin@c2s.com", "admin123")
        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        nav_items = self.driver.find_elements(By.CSS_SELECTOR, ".sidebar-nav-item")
        self.assertGreaterEqual(len(nav_items), 8)

    def test_admin_cannot_access_worker_pages(self):
        self._login("admin@c2s.com", "admin123")
        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        self.driver.get(f"{BASE_URL}/worker-dashboard")
        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))
        self.assertIn("/dashboard", self.driver.current_url)

    def test_worker_cannot_access_admin_pages(self):
        self._login("worker@c2s.com", "worker123")
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-dashboard"))
        self.driver.get(f"{BASE_URL}/dashboard")
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-dashboard"))
        self.assertIn("/worker-dashboard", self.driver.current_url)


if __name__ == "__main__":
    unittest.main()
