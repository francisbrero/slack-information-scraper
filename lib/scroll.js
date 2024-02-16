const puppeteer = require('puppeteer');
const fs = require('fs');
const browserObject = require('./browser');

require('dotenv').config();
var url = 'https://www.madkudu.com';

async function scrollToBottom(page, selector) {
  await page.evaluate((targetSelector) => {
    const scrollableElement = document.querySelector(targetSelector);
    if (scrollableElement) {
      scrollableElement.scrollTop = scrollableElement.scrollHeight; // Scroll to bottom
    } else {
      console.error('Element not found:', targetSelector);
    }
  }, selector);
}



var main = (async () => {  
  let browserInstance = browserObject.startBrowser();
  let browser;
  try{
    browser = await browserInstance;

    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(600000); // Increase to 600 seconds
    await console.log('we are headed to: '+url);
    await page.goto(url);
    await page.waitForNetworkIdle();
    
    // scroll to the top of the page
    console.log('scrolling to the bottom of the page');
    // await page.evaluate(() => { window.scroll(0,0); });
    await scrollToBottom(page, 'div[class="container-v2"]');
    console.log('scrolled to the bottom of the page');

    // wait for the user to strike a key
    await page.on('keydown', (event) => {
        if (event.key === 'Enter') {
          console.log('Enter key was pressed');
        }
      });
    }
    catch(err){
        console.log(err);
    };

    // close the browser
    await browser.close();
    console.log('I am done')
 });

main()
  .catch((e) => console.log('err: ' + e));

