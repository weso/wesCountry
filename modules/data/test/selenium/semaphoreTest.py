from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from myTestCase import MyTestCase

class SemaphoreTest(MyTestCase):

    def test_semaphore_test1(self):
        driver = self.driver
        driver.get(self.base_url + "semaphoreTest.html")
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_css_selector("td").text)
        self.assertEqual("Arable land (% of land area)", driver.find_element_by_xpath("//tr[2]/td").text)
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_xpath("//tr[3]/td").text)
        self.assertEqual("Rural population", driver.find_element_by_xpath("//tr[4]/td").text)
        self.assertEqual("Rural population growth (annual %)", driver.find_element_by_xpath("//tr[5]/td").text)
        self.assertEqual("326.59", driver.find_element_by_xpath("//td[2]").text)
        self.assertEqual("8.02", driver.find_element_by_xpath("//tr[2]/td[2]").text)
        self.assertEqual("5.56", driver.find_element_by_xpath("//tr[3]/td[2]").text)
        self.assertEqual("31474139.06", driver.find_element_by_xpath("//tr[4]/td[2]").text)
        self.assertEqual("-0.81", driver.find_element_by_xpath("//tr[5]/td[2]").text)
        self.assertIn("background-color: rgb(255, 0, 0)", driver.find_element_by_xpath("//tr[1]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(0, 255, 0)", driver.find_element_by_xpath("//tr[2]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(0, 255, 0)", driver.find_element_by_xpath("//tr[3]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(255, 0, 0)", driver.find_element_by_xpath("//tr[4]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(0, 255, 0)", driver.find_element_by_xpath("//tr[5]/td[2]").get_attribute("style"))
        Select(driver.find_element_by_css_selector("select.timeSelect")).select_by_visible_text("2008")
        Select(driver.find_element_by_css_selector("select.regionSelect")).select_by_visible_text("Spain")
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_css_selector("td").text)
        self.assertEqual("Arable land (% of land area)", driver.find_element_by_xpath("//tr[2]/td").text)
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_xpath("//tr[3]/td").text)
        self.assertEqual("Rural population", driver.find_element_by_xpath("//tr[4]/td").text)
        self.assertEqual("Rural population growth (annual %)", driver.find_element_by_xpath("//tr[5]/td").text)
        self.assertEqual("89.17", driver.find_element_by_xpath("//td[2]").text)
        self.assertEqual("25.04", driver.find_element_by_xpath("//tr[2]/td[2]").text)
        self.assertEqual("2.66", driver.find_element_by_xpath("//tr[3]/td[2]").text)
        self.assertEqual("10454672.38", driver.find_element_by_xpath("//tr[4]/td[2]").text)
        self.assertEqual("0.99", driver.find_element_by_xpath("//tr[5]/td[2]").text)
        self.assertIn("background-color: rgb(255, 128, 0)", driver.find_element_by_xpath("//tr[1]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(255, 128, 0)", driver.find_element_by_xpath("//tr[2]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(0, 255, 0)", driver.find_element_by_xpath("//tr[3]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(255, 0, 0)", driver.find_element_by_xpath("//tr[4]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(0, 255, 0)", driver.find_element_by_xpath("//tr[5]/td[2]").get_attribute("style"))
        Select(driver.find_element_by_css_selector("select.timeSelect")).select_by_visible_text("2009")
        Select(driver.find_element_by_css_selector("select.regionSelect")).select_by_visible_text("Italy")
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_css_selector("td").text)
        self.assertEqual("Arable land (% of land area)", driver.find_element_by_xpath("//tr[2]/td").text)
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_xpath("//tr[3]/td").text)
        self.assertEqual("Rural population", driver.find_element_by_xpath("//tr[4]/td").text)
        self.assertEqual("Rural population growth (annual %)", driver.find_element_by_xpath("//tr[5]/td").text)
        self.assertEqual("256.27", driver.find_element_by_xpath("//td[2]").text)
        self.assertEqual("23.55", driver.find_element_by_xpath("//tr[2]/td[2]").text)
        self.assertEqual("1.89", driver.find_element_by_xpath("//tr[3]/td[2]").text)
        self.assertEqual("19205322.99", driver.find_element_by_xpath("//tr[4]/td[2]").text)
        self.assertEqual("0.21", driver.find_element_by_xpath("//tr[5]/td[2]").text)
        self.assertIn("background-color: rgb(255, 0, 0)", driver.find_element_by_xpath("//tr[1]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(255, 128, 0)", driver.find_element_by_xpath("//tr[2]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(0, 255, 0)", driver.find_element_by_xpath("//tr[3]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(255, 0, 0)", driver.find_element_by_xpath("//tr[4]/td[2]").get_attribute("style"))
        self.assertIn("background-color: rgb(0, 255, 0)", driver.find_element_by_xpath("//tr[5]/td[2]").get_attribute("style"))

if __name__ == "__main__":
    unittest.main()
