const puppeteer = require('puppeteer');
const fs = require('fs');
const browserObject = require('./browser');

require('dotenv').config();
var slack_instance_name = process.env.SLACK_INSTANCE_NAME;
var slack_instance_id = process.env.SLACK_INSTANCE_ID;
var email = process.env.SLACK_USERNAME;
var pwd = process.env.SLACK_PASSWORD;

var url = 'https://'+slack_instance_name+'.slack.com/sign_in_with_password'

var channel = process.argv[2];

async function scrollToTop(page, selector) {
  await page.evaluate((targetSelector) => {
    const scrollableElement = document.querySelector(targetSelector);
    if (scrollableElement) {
      scrollableElement.scrollTop = 0; // Scroll to top
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
      console.log('slack instance name: ' + slack_instance_name);
  
      let page = await browser.newPage();
      // close the pop-up asking us to open Slack app
      page.on('dialog', async dialog => {
        await page.screenshot({ path: './debug/page_pop_up_dialog.png' });
        console.log(dialog.message());
        await dialog.dismiss();
      });
      page.on('alert', async alert => {
        await page.screenshot({ path: './debug/page_pop_up_alert.png' });
        console.log(alert.message());
        await alert.dismiss();
      });
      page.on('confirm', async confirm => {
        await page.screenshot({ path: './debug/page_pop_up_confirm.png' });
        console.log(confirm.message());
        await confirm.dismiss();
      });
      page.setDefaultNavigationTimeout(60000); // Increase to 60 seconds
      console.log('we are headed to: ' + url);
      await page.goto(url);
      // make sure we're ready to log in
      await page.waitForSelector('input[id="email"]')
      await page.screenshot({ path: './debug/login_page.png' });
      // input values
      await page.waitForSelector('input[id="email"]');
      await page.type('input[id="email"]', email);
      await page.screenshot({ path: './debug/login_page_email.png' });
      await page.waitForSelector('input[id="password"]');
      await page.type('input[id="password"]', pwd);
      await page.screenshot({ path: './debug/login_page_pwd.png' });
      await page.click('button[id="signin_btn"]');
      console.log('signing in, waiting for navigation');
      await page.waitForNavigation();
      console.log('boom, we are in!');

      // head to the intro channel
      url = 'https://app.slack.com/client/'+slack_instance_id+'/'+channel+'/';
      console.log('we are headed to: ' + url);
      await page.goto(url);
      console.log('we are in the channel, waiting for navigation');
      await page.waitForNavigation();

      // check that we made it to the channel
      if (page.url().indexOf('login') > 0) {
        console.log('we are not getting past the login page');
        await page.screenshot({ path: './debug/not_thru_login.png' });
        await browser.close();
        return;
      };
      console.log('we are in the channel, waiting for the content to load');

      // wait for all data to be loaded and ensure we don't timeout
      await page.waitForSelector('div[data-qa="slack_kit_scrollbar"]', { timeout: 600000 });
      console.log('we are in the channel, we see the scrollbar');
      await page.screenshot({ path: './debug/channel.png' });

      // scroll to the top of the page
      console.log('scrolling to the top of the page');
      var top = false;
      // scroll until we see the element span[data-qa="inline_channel_entity__name"]
      while (top == false) {
        console.log('scrolling up');
        await page.focus('div[class="c-virtual_list__item"]');
        await page.keyboard.press('ArrowUp');
        // we define the top of the channel as the place where we see the title of the channel
        if (await page.$('span[data-qa="inline_channel_entity__name"]')) {
          console.log('we are at the top');
          top = true;
        }
      }
      await page.screenshot({ path: './debug/channel_top.png' });
      
      // get today's date as YYYYMMDD
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + mm + dd;
      // write the html to a file with today's date
      const html = await page.content();
      filename = './data/'+channel+'_'+today+'.html';

      fs.writeFile(filename, html, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
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
