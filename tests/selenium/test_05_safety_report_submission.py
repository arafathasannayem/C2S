"""
Test 5: Safety Report Submission
Tests that a worker can submit a safety incident report.
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


class TestSafetyReportSubmission(unittest.TestCase):
    def setUp(self):
        self.driver = get_brave_driver()
        self.driver.implicitly_wait(10)

    def tearDown(self):
        self.driver.quit()

    def _login_as_worker(self):
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

    def test_navigate_to_safety_report(self):
        self._login_as_worker()
        nav_items = self.driver.find_elements(By.CSS_SELECTOR, ".wl-nav-item")
        for item in nav_items:
            if "Reporting" in item.text:
                item.click()
                break
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-reporting"))
        self.assertIn("/worker-reporting", self.driver.current_url)

    def test_safety_report_form_elements(self):
        self._login_as_worker()
        nav_items = self.driver.find_elements(By.CSS_SELECTOR, ".wl-nav-item")
        for item in nav_items:
            if "Reporting" in item.text:
                item.click()
                break
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-reporting"))
        form = self.driver.find_element(By.CSS_SELECTOR, ".wir-form")
        self.assertTrue(form.is_displayed())
        selects = self.driver.find_elements(By.CSS_SELECTOR, ".wir-form select")
        self.assertGreaterEqual(len(selects), 2)
        textareas = self.driver.find_elements(By.CSS_SELECTOR, ".wir-form textarea")
        self.assertGreaterEqual(len(textareas), 2)

    def test_submit_safety_report(self):
        self._login_as_worker()
        nav_items = self.driver.find_elements(By.CSS_SELECTOR, ".wl-nav-item")
        for item in nav_items:
            if "Reporting" in item.text:
                item.click()
                break
        WebDriverWait(self.driver, 10).until(EC.url_contains("/worker-reporting"))
        title_input = self.driver.find_element(By.CSS_SELECTOR, ".wir-form input[type='text']")
        title_input.send_keys("Test Safety Incident")
        severity_select = self.driver.find_elements(By.CSS_SELECTOR, ".wir-form select")[1]
        severity_select.click()
        textareas = self.driver.find_elements(By.CSS_SELECTOR, ".wir-form textarea")
        textareas[0].send_keys("টেস্ট নিরাপত্তা ঘটনা")
        submit_btn = self.driver.find_element(By.CSS_SELECTOR, ".wir-submit-btn")
        submit_btn.click()
        WebDriverWait(self.driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".wir-toast"))
        )


if __name__ == "__main__":
    unittest.main()
