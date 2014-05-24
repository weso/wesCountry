from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from myTestCase import MyTestCase

class MultiChartTestCase(MyTestCase):
    def test_multi_chart_test_case1(self):
        driver = self.driver
        driver.get(self.base_url + "multiChartTest.html")
        self.assertEqual("Line", driver.find_element_by_link_text("Line").text)
        self.assertEqual("Bar", driver.find_element_by_link_text("Bar").text)
        self.assertEqual("Pie", driver.find_element_by_link_text("Pie").text)
        self.assertEqual("Area", driver.find_element_by_link_text("Area").text)
        self.assertEqual("active", driver.find_element_by_link_text("Line").get_attribute("class"))
        self.assertEqual("inactive", driver.find_element_by_link_text("Bar").get_attribute("class"))
        self.assertEqual("inactive", driver.find_element_by_link_text("Pie").get_attribute("class"))
        self.assertEqual("inactive", driver.find_element_by_link_text("Area").get_attribute("class"))
        self.assertEqual("First", driver.find_element_by_css_selector("label").text)
        self.assertEqual("Second", driver.find_element_by_xpath("//div[@id='chartDiv']/div/div[2]/label[2]").text)
        self.assertEqual("Third", driver.find_element_by_xpath("//div[@id='chartDiv']/div/div[2]/label[3]").text)
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][1]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][2]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][3]").is_selected())
        driver.find_element_by_xpath("//input[@class = \"checks\"][1]").click()
        self.assertEqual("Second", driver.find_element_by_css_selector("text[value=\"Second\"]").text)
        self.assertEqual("Third", driver.find_element_by_css_selector("text[value=\"Third\"]").text)
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][1]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][2]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][3]").is_selected())
        driver.find_element_by_xpath("//input[@class = \"checks\"][3]").click()
        self.assertEqual("Second", driver.find_element_by_css_selector("text[value=\"Second\"]").text)
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][1]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][2]").is_selected())
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][3]").is_selected())
        driver.find_element_by_xpath("//input[@class = \"checks\"][2]").click()
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][1]").is_selected())
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][2]").is_selected())
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][3]").is_selected())
        driver.find_element_by_xpath("//input[@class = \"checks\"][3]").click()
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][1]").is_selected())
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][2]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][3]").is_selected())
        self.assertEqual("Third", driver.find_element_by_css_selector("text[value=\"Third\"]").text)
        driver.find_element_by_xpath("//input[@class = \"checks\"][2]").click()
        self.assertFalse(driver.find_element_by_xpath("//input[@class = \"checks\"][1]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][2]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][3]").is_selected())
        self.assertEqual("Second", driver.find_element_by_css_selector("text[value=\"Second\"]").text)
        self.assertEqual("Third", driver.find_element_by_css_selector("text[value=\"Third\"]").text)
        driver.find_element_by_xpath("//input[@class = \"checks\"][1]").click()
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][1]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][2]").is_selected())
        self.assertTrue(driver.find_element_by_xpath("//input[@class = \"checks\"][3]").is_selected())
        self.assertEqual("Second", driver.find_element_by_css_selector("text[value=\"Second\"]").text)
        self.assertEqual("Third", driver.find_element_by_css_selector("text[value=\"Third\"]").text)
        self.assertEqual("First", driver.find_element_by_css_selector("text[value=\"First\"]").text)

if __name__ == "__main__":
    unittest.main()
