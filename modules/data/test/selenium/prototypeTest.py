from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from myTestCase import MyTestCase

class PrototypeTest(MyTestCase):
        
    def test_prototype(self):
        driver = self.driver
        driver.get(self.base_url + "prototypeTest.html")
        Select(driver.find_element_by_css_selector("select.indicatorSelect")).select_by_visible_text("Arable land (% of land area)")
        Select(driver.find_element_by_css_selector("select.indicatorSelect")).select_by_visible_text("Fertilizer consumption (% of fertilizer production)")
        Select(driver.find_element_by_css_selector("select.indicatorSelect")).select_by_visible_text("Rural population")
        Select(driver.find_element_by_css_selector("select.indicatorSelect")).select_by_visible_text("Rural population growth (annual %)")
        Select(driver.find_element_by_css_selector("select.timeSelect")).select_by_visible_text("2008")
        Select(driver.find_element_by_css_selector("select.timeSelect")).select_by_visible_text("2009")
        Select(driver.find_element_by_css_selector("select.timeSelect")).select_by_visible_text("2007")
        Select(driver.find_element_by_css_selector("select.regionSelect")).select_by_visible_text("Spain")
        Select(driver.find_element_by_css_selector("select.regionSelect")).select_by_visible_text("Brazil")
        Select(driver.find_element_by_css_selector("select.regionSelect")).select_by_visible_text("Italy")
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_css_selector("p").text)
        self.assertEqual("2007", driver.find_element_by_xpath("//div[5]/div/div/p").text)
        self.assertEqual("Spain", driver.find_element_by_xpath("//div[6]/div/div/p").text)
        Select(driver.find_element_by_xpath("//select[2]")).select_by_visible_text("2009")
        Select(driver.find_element_by_xpath("//div[7]/div/div/select")).select_by_visible_text("Arable land (% of land area)")
        Select(driver.find_element_by_xpath("//select[2]")).select_by_visible_text("2007")
        Select(driver.find_element_by_xpath("//div[7]/div/div/select")).select_by_visible_text("Fertilizer consumption (% of fertilizer production)")
        Select(driver.find_element_by_xpath("//select[2]")).select_by_visible_text("2008")
        Select(driver.find_element_by_xpath("//select[2]")).select_by_visible_text("2007")
        Select(driver.find_element_by_xpath("//div[7]/div/div/select")).select_by_visible_text("Rural population")
        Select(driver.find_element_by_xpath("//select[2]")).select_by_visible_text("2009")
        Select(driver.find_element_by_xpath("//div[7]/div/div/select")).select_by_visible_text("Rural population growth (annual %)")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select[2]")).select_by_visible_text("Italy")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select")).select_by_visible_text("Arable land (% of land area)")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select")).select_by_visible_text("Fertilizer consumption (% of fertilizer production)")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select[2]")).select_by_visible_text("Spain")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select")).select_by_visible_text("Rural population")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select[2]")).select_by_visible_text("Italy")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select[2]")).select_by_visible_text("Brazil")
        Select(driver.find_element_by_xpath("//div[8]/div/div/select")).select_by_visible_text("Rural population growth (annual %)")
        Select(driver.find_element_by_xpath("//div[9]/div/div/select[2]")).select_by_visible_text("Italy")
        Select(driver.find_element_by_xpath("//div[9]/div/div/select")).select_by_visible_text("2009")
        Select(driver.find_element_by_xpath("//div[9]/div/div/select[2]")).select_by_visible_text("Spain")
        Select(driver.find_element_by_xpath("//div[9]/div/div/select")).select_by_visible_text("2008")
        Select(driver.find_element_by_xpath("//div[9]/div/div/select[2]")).select_by_visible_text("Brazil")
        Select(driver.find_element_by_xpath("//div[9]/div/div/select")).select_by_visible_text("2007")
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_xpath("//div[10]/div/div/p").text)
        self.assertEqual("2008", driver.find_element_by_xpath("//p[2]").text)
        self.assertEqual("Rural population", driver.find_element_by_xpath("//div[11]/div/div/p").text)
        self.assertEqual("Italy", driver.find_element_by_xpath("//div[11]/div/div/p[2]").text)
        self.assertEqual("2007", driver.find_element_by_xpath("//div[12]/div/div/p").text)
        self.assertEqual("2007", driver.find_element_by_xpath("//div[12]/div/div/p").text)
        Select(driver.find_element_by_xpath("//div[12]/div/div/select[2]")).select_by_visible_text("Italy")
        Select(driver.find_element_by_xpath("//div[12]/div/div/select[2]")).select_by_visible_text("Spain")
        Select(driver.find_element_by_xpath("//div[12]/div/div/select[2]")).select_by_visible_text("Brazil")
    
if __name__ == "__main__":
    unittest.main()
