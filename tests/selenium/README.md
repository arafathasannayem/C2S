# C2S Selenium Tests (Brave Browser)

## Prerequisites

1. Install Python 3.x
2. Install Selenium: `pip install selenium`
3. Install ChromeDriver (match your Brave/Chrome version)
4. Make sure the application is running at `http://localhost/c2s`
5. Brave browser installed at: `C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe`

## Running Tests

```bash
# Run all tests
python -m unittest discover -s tests/selenium -p "test_*.py"

# Run individual test
python -m unittest tests.selenium.test_01_login
python -m unittest tests.selenium.test_02_dashboard_navigation
python -m unittest tests.selenium.test_03_worker_portal
python -m unittest tests.selenium.test_04_role_based_access
python -m unittest tests.selenium.test_05_safety_report_submission
```

## Test Files

| Test | Description |
|------|-------------|
| `test_01_login.py` | Admin login with valid/invalid credentials |
| `test_02_dashboard_navigation.py` | Dashboard page loads with sidebar, header, footer |
| `test_03_worker_portal.py` | Worker login and worker dashboard access |
| `test_04_role_based_access.py` | Role-based navigation and access control |
| `test_05_safety_report_submission.py` | Worker safety report form submission |

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@c2s.com | admin123 |
| Worker | worker@c2s.com | worker123 |

## Brave Browser Configuration

All tests are configured to use Brave browser with the following settings:
- Binary: `C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe`
- Window size: 1920x1080
- GPU disabled for stability
