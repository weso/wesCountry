from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from myTestCase import MyTestCase

class OneElementChangingByYear(MyTestCase):
    def test_one_element_changing_by_year(self):
        driver = self.driver
        driver.get(self.base_url + "oneElementChangingByYear.html")
        try: self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "div.indicatorSelector > p"))
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_css_selector("div.indicatorSelector > p").text)
        try: self.assertTrue(self.is_element_present(By.XPATH, "//p[2]"))
        except AssertionError as e: self.verificationErrors.append(str(e))
        self.assertEqual("Spain", driver.find_element_by_xpath("//p[2]").text)
        self.assertEqual("2007", driver.find_element_by_css_selector("div.indicatorSelector > div > div").text)
        try: self.assertTrue(self.is_element_present(By.XPATH, "//button[2]"))
        except AssertionError as e: self.verificationErrors.append(str(e))
        try: self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "button"))
        except AssertionError as e: self.verificationErrors.append(str(e))
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | //button[2] | ]]
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | css=button | ]]
        driver.find_element_by_xpath("//button[2]").click()
        self.assertEqual("2008", driver.find_element_by_css_selector("div.indicatorSelector > div > div").text)
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | css=button | ]]
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | //button[2] | ]]
        driver.find_element_by_xpath("//button[2]").click()
        self.assertEqual("2009", driver.find_element_by_css_selector("div.indicatorSelector > div > div").text)
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | css=button | ]]
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | //button[2] | ]]
        driver.find_element_by_css_selector("button").click()
        self.assertEqual("2008", driver.find_element_by_css_selector("div.indicatorSelector > div > div").text)
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | css=button | ]]
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | //button[2] | ]]
        driver.find_element_by_css_selector("button").click()
        self.assertEqual("2007", driver.find_element_by_css_selector("div.indicatorSelector > div > div").text)
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | css=button | ]]
        # ERROR: Caught exception [ERROR: Unsupported command [isEditable | //button[2] | ]]
    
if __name__ == "__main__":
    unittest.main()
