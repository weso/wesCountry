from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re
from myTestCase import MyTestCase

class GeneralSelectorTest(MyTestCase):
    
    def test_general_selector(self):
        driver = self.driver
        driver.get(self.base_url + "generalSelectorTest.html")
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_css_selector("p").text)
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_xpath("//div[@id='indicator']/div[2]/div/div[3]/label").text)
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_xpath("//div[@id='indicator']/div[4]/div/div/p").text)
        self.assertEqual("Fertilizer consumption (% of fertilizer production)", driver.find_element_by_xpath("//div[@id='indicator']/div[5]/div/div/p").text)
        Select(driver.find_element_by_css_selector("select.globalSelect")).select_by_visible_text("Rural population growth (annual %)")
        self.assertEqual("Rural population growth (annual %)", driver.find_element_by_css_selector("p").text)
        self.assertEqual("Rural population growth (annual %)", driver.find_element_by_xpath("//div[@id='indicator']/div[2]/div/div[3]/label").text)
        self.assertEqual("Rural population growth (annual %)", driver.find_element_by_xpath("//div[@id='indicator']/div[4]/div/div/p").text)
        self.assertEqual("Rural population growth (annual %)", driver.find_element_by_xpath("//div[@id='indicator']/div[5]/div/div/p").text)
        Select(driver.find_element_by_css_selector("select.globalSelect")).select_by_visible_text("Arable land (% of land area)")
        self.assertEqual("Arable land (% of land area)", driver.find_element_by_css_selector("p").text)
        self.assertEqual("Arable land (% of land area)", driver.find_element_by_xpath("//div[@id='indicator']/div[2]/div/div[3]/label").text)
        self.assertEqual("Arable land (% of land area)", driver.find_element_by_xpath("//div[@id='indicator']/div[4]/div/div/p").text)
        self.assertEqual("Arable land (% of land area)", driver.find_element_by_xpath("//div[@id='indicator']/div[5]/div/div/p").text)
        Select(driver.find_element_by_css_selector("select.globalSelect")).select_by_visible_text("Agriculture, value added (% of GDP)")
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_css_selector("p").text)
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_xpath("//div[@id='indicator']/div[2]/div/div[3]/label").text)
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_xpath("//div[@id='indicator']/div[4]/div/div/p").text)
        self.assertEqual("Agriculture, value added (% of GDP)", driver.find_element_by_xpath("//div[@id='indicator']/div[5]/div/div/p").text)
        Select(driver.find_element_by_css_selector("select.globalSelect")).select_by_visible_text("Rural population")
        self.assertEqual("Rural population", driver.find_element_by_css_selector("p").text)
        self.assertEqual("Rural population", driver.find_element_by_xpath("//div[@id='indicator']/div[2]/div/div[3]/label").text)
        self.assertEqual("Rural population", driver.find_element_by_xpath("//div[@id='indicator']/div[4]/div/div/p").text)
        self.assertEqual("Rural population", driver.find_element_by_xpath("//div[@id='indicator']/div[5]/div/div/p").text)
        self.assertEqual("Brazil", driver.find_element_by_css_selector("#region > div > div > div.chartDiv > svg > g > text[value=\"Brazil\"]").text)
        self.assertEqual("Brazil", driver.find_element_by_xpath("//div[@id='region']/div[2]/div/div/p").text)
        self.assertEqual("Brazil", driver.find_element_by_xpath("//div[@id='region']/div[3]/div/div[3]/label").text)
        self.assertEqual("Brazil", driver.find_element_by_xpath("//div[@id='region']/div[5]/div/div/p").text)
        self.assertEqual("Brazil", driver.find_element_by_xpath("//div[@id='region']/div[6]/div/div/p").text)
        Select(driver.find_element_by_css_selector("#region > select.globalSelect")).select_by_visible_text("Italy")
        self.assertEqual("Italy", driver.find_element_by_css_selector("#region > div > div > div.chartDiv > svg > g > text[value=\"Italy\"]").text)
        self.assertEqual("Italy", driver.find_element_by_xpath("//div[@id='region']/div[2]/div/div/p").text)
        self.assertEqual("Italy", driver.find_element_by_xpath("//div[@id='region']/div[3]/div/div[3]/label").text)
        self.assertEqual("Italy", driver.find_element_by_xpath("//div[@id='region']/div[5]/div/div/p").text)
        self.assertEqual("Italy", driver.find_element_by_xpath("//div[@id='region']/div[6]/div/div/p").text)
        Select(driver.find_element_by_css_selector("#region > select.globalSelect")).select_by_visible_text("Spain")
        self.assertEqual("Spain", driver.find_element_by_css_selector("#region > div > div > div.chartDiv > svg > g > text[value=\"Spain\"]").text)
        self.assertEqual("Spain", driver.find_element_by_xpath("//div[@id='region']/div[2]/div/div/p").text)
        self.assertEqual("Spain", driver.find_element_by_xpath("//div[@id='region']/div[3]/div/div[3]/label").text)
        self.assertEqual("Spain", driver.find_element_by_xpath("//div[@id='region']/div[5]/div/div/p").text)
        self.assertEqual("Spain", driver.find_element_by_xpath("//div[@id='region']/div[6]/div/div/p").text)
        self.assertEqual("2009", driver.find_element_by_xpath("//div[@id='time']/div[3]/div/div/p").text)
        self.assertEqual("2009", driver.find_element_by_xpath("//div[@id='time']/div[4]/div/div/p").text)
        self.assertEqual("2009", driver.find_element_by_xpath("//div[@id='time']/div[6]/div/div/p").text)
        Select(driver.find_element_by_css_selector("#time > select.globalSelect")).select_by_visible_text("2007")
        self.assertEqual("2007", driver.find_element_by_xpath("//div[@id='time']/div[3]/div/div/p").text)
        self.assertEqual("2007", driver.find_element_by_xpath("//div[@id='time']/div[4]/div/div/p").text)
        self.assertEqual("2007", driver.find_element_by_xpath("//div[@id='time']/div[6]/div/div/p").text)
        Select(driver.find_element_by_css_selector("#time > select.globalSelect")).select_by_visible_text("2008")
        Select(driver.find_element_by_css_selector("#time > select.globalSelect")).select_by_visible_text("2007")
        Select(driver.find_element_by_css_selector("#time > select.globalSelect")).select_by_visible_text("2008")
        self.assertEqual("2008", driver.find_element_by_xpath("//div[@id='time']/div[3]/div/div/p").text)
        self.assertEqual("2008", driver.find_element_by_xpath("//div[@id='time']/div[4]/div/div/p").text)
        self.assertEqual("2008", driver.find_element_by_xpath("//div[@id='time']/div[6]/div/div/p").text)

if __name__ == "__main__":
    unittest.main()
