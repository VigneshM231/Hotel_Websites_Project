from bs4 import BeautifulSoup
import requests
import os
from urllib.parse import urljoin
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from PIL import Image
import urllib.request
import io


url='https://www.marriott.com/en-us/hotels/dxbam-al-maha-a-luxury-collection-desert-resort-and-spa-dubai/photos/'
response=requests.get(url)
soup=BeautifulSoup(response.text,'html.parser')
value_1=soup.find_all('div',class_='container pl-3 pr-2 px-xl-0')[0]
value_2=soup.find_all('div',class_='container pl-3 pr-2 px-xl-0')[1]


Hotel_gallery=value_1.find('div',class_='photo-gallery')
Venue_gallery=value_2.find('div',class_='photo-gallery')
img_1=Hotel_gallery.find_all('img')
img_2=Venue_gallery.find_all('img')
print(img_1)
for idx,i in enumerate(img_1):
    values=i.get('src')
    print(values)
for idx,i in enumerate(img_2):
    values=i.get('src')
    print(values)
    output_folder='MARRIOTT BONVOY HOTEL IMAGES HOTEL'
    os.makedirs(output_folder, exist_ok=True)
    if values:
            filename = os.path.join(output_folder, f'image_{idx + 1}.jpg')
            img_data = requests.get(url).content
            with open(filename, 'wb') as img_file:
                img_file.write(img_data)
            print(f"Image {idx + 1} saved as {filename}")





''' driver=webdriver.Firefox()
driver.get('https://all.accor.com/hotel/B2J7/index.en.shtml')
time.sleep(5)


element_close=driver.find_element(By.XPATH,'//*[@id="onetrust-close-btn-container"]').click()

element_to_click = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="main-opener-popin-gallery"]')))
element_to_click.click()


img=element_to_click.find_elements(By.XPATH,value='/html/body/div[15]/div/div[2]/div')
dat=img.find_elements(By.XPATH,value='/html/body/div[17]/div/div[2]/div/div/div[1]/div[2]')
print(dat)
'''
'''response=requests.get(driver)
soup=BeautifulSoup(response.text,'html.parser')
btn=soup.find('button',class_='button-gallery--picture js-opener-popin-gallery')
img=soup.find('div',class_='carousel-items')
value=img.find_all('img')
for i in value:
    sc=i.get('src')
    print(sc)
'''