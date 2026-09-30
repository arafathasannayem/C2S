"""
Test 3: Worker Portal
Tests that a worker can log in and access the worker dashboard.
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


class TestWorkerPortal(unittest.TestCase):
    def setUp(self):
        self.driver = get_brave_driver()
        self.driver.implicitly_wait(10)

    def tearDown(self):
        self.driver.quit()

    def test_worker_login(self):
        self.driver.get(f"{BASE_URL}/login")
        worker_tab = self.driver.find_element(By.CSS_SELECTOR, ".role-tab-btn:nth-child(2)")
        worker_tab.click()
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys("worker@c2s.com")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys("worker123")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-dashboard"))
        self.assertIn("/worker-dashboard", self.driver.current_url)

    def test_worker_dashboard_elements(self):
        self.driver.get(f"{BASE_URL}/login")
        worker_tab = self.driver.find_element(By.CSS_SELECTOR, ".role-tab-btn:nth-child(2)")
        worker_tab.click()
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys("worker@c2s.com")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys("worker123")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-dashboard"))
        sidebar = self.driver.find_element(By.CSS_SELECTOR, ".wl-sidebar")
        self.assertTrue(sidebar.is_displayed())
        header = self.driver.find_element(By.CSS_SELECTOR, ".wl-header")
        self.assertTrue(header.is_displayed())

    def test_worker_nav_items(self):
        self.driver.get(f"{BASE_URL}/login")
        worker_tab = self.driver.find_element(By.CSS_SELECTOR, ".role-tab-btn:nth-child(2)")
        worker_tab.click()
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys("worker@c2s.com")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys("worker123")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-dashboard"))
        nav_items = self.driver.find_elements(By.CSS_SELECTOR, ".wl-nav-item")
        self.assertEqual(len(nav_items), 4)


if __name__ == "__main__":
    unittest.main()
