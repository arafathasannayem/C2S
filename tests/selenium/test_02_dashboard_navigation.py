"""
Test 2: Dashboard Navigation
Tests that the admin dashboard loads and key elements are visible.
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


class TestDashboardNavigation(unittest.TestCase):
    def setUp(self):
        self.driver = get_brave_driver()
        self.driver.implicitly_wait(10)
        self._login_as_admin()

    def tearDown(self):
        self.driver.quit()

    def _login_as_admin(self):
        self.driver.get(f"{BASE_URL}/login")
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys("admin@c2s.com")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.clear()
        password_input.send_keys("admin123")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/dashboard"))

    def test_dashboard_loads(self):
        self.assertIn("/dashboard", self.driver.current_url)

    def test_sidebar_visible(self):
        sidebar = self.driver.find_element(By.CSS_SELECTOR, ".layout-sidebar")
        self.assertTrue(sidebar.is_displayed())

    def test_header_visible(self):
        header = self.driver.find_element(By.CSS_SELECTOR, ".layout-header")
        self.assertTrue(header.is_displayed())

    def test_nav_items_present(self):
        nav_items = self.driver.find_elements(By.CSS_SELECTOR, ".sidebar-nav-item")
        self.assertGreater(len(nav_items), 0)

    def test_footer_visible(self):
        footer = self.driver.find_element(By.CSS_SELECTOR, ".layout-footer")
        self.assertTrue(footer.is_displayed())


if __name__ == "__main__":
    unittest.main()
