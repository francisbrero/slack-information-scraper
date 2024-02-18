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
      url = 'https://app.slack.com/client/'+slack_instance_id+'/people/';
      console.log('we are headed to: ' + url);
      await page.goto(url);
      console.log('we are in the channel members page, waiting for navigation');
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
      await page.waitForSelector('div[data-qa="search_input_box"]', { timeout: 600000 });
      console.log('we are in the channel, we see the search bar');
      await page.screenshot({ path: './debug/members.png' });

      // sort the members by name using the data-qa="sort-explorer-select" element and pick the "A to Z" option
      await page.waitForSelector('button[data-qa="sort-explorer-select"]');
      await page.click('button[data-qa="sort-explorer-select"]');
      console.log('sorting the members');
      await page.waitForSelector('div[id="sort-explorer-select_listbox"]');
      await page.focus('div[id="sort-explorer-select_listbox"]');
      await page.screenshot({ path: './debug/members_sort.png' });
      await page.waitForSelector('div[class="p-search_filter__select-list"]');
      await page.waitForSelector('div[data-qa="undefined_option_1"]');
      await page.click('div[data-qa="undefined_option_1"]');
      
      // Go to the next page
      i = 0;
      while (i<10) {
        await page.waitForSelector('button[data-qa="c-pagination_forward_btn"]');
        await page.waitForSelector('div[data-qa="c-member_list"]');
        await page.screenshot({ path: './debug/members_'+ i.toString() +'.png' });
        
        // write the html to a file with today's date
        const html = await page.content();
        filename = './data/members_'+ i.toString()+ '.html';

        fs.writeFile(filename, html, (err) => {
        if (err)
          console.log(err);
        else {
          console.log("File written successfully\n");
          }
        });
        // go to the next page
        await page.click('button[data-qa="c-pagination_forward_btn"]');
        i++;
      }

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
