from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from myTestCase import MyTestCase

class StatisticalAggregateTest(MyTestCase):
        
    def test_statistical_aggregate(self):
        driver = self.driver
        driver.get(self.base_url + "statisticalAggregatesTest.html")
        self.assertEqual("Statistical aggregate", driver.find_element_by_css_selector("td").text)
        self.assertEqual("Value", driver.find_element_by_xpath("//td[2]").text)
        self.assertEqual("sum", driver.find_element_by_css_selector("tbody > tr > td").text)
        self.assertEqual("31288485.705725998", driver.find_element_by_xpath("//tbody/tr/td[2]").text)
        self.assertEqual("average", driver.find_element_by_xpath("//tr[2]/td").text)
        self.assertEqual("10429495.235242", driver.find_element_by_xpath("//tr[2]/td[2]").text)
        self.assertEqual("max", driver.find_element_by_xpath("//tr[3]/td").text)
        self.assertEqual("10482125.633644", driver.find_element_by_xpath("//tr[3]/td[2]").text)
        self.assertEqual("min", driver.find_element_by_xpath("//tr[4]/td").text)
        self.assertEqual("10351687.69581", driver.find_element_by_xpath("//tr[4]/td[2]").text)
        self.assertEqual("median", driver.find_element_by_xpath("//tr[5]/td").text)
        self.assertEqual("10454672.376272", driver.find_element_by_xpath("//tr[5]/td[2]").text)
        
if __name__ == "__main__":
    unittest.main()
