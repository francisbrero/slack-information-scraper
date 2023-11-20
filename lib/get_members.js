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


var main = (async () => {  
  let browserInstance = browserObject.startBrowser();
  let browser;
  try{
      browser = await browserInstance;
      await console.log('slack instance name: '+slack_instance_name);
  
      let page = await browser.newPage();
      await console.log('we are headed to: '+url);
      await page.goto(url);
      // make sure we're ready to log in
      await page.waitForSelector('input[id="email"]')
      await page.screenshot({ path: './debug/login_page.png' });
      // input values
      await page.waitForTimeout(500);
      await page.type('input[id="email"]', email);
      await page.screenshot({ path: './debug/login_page_email.png' });
      await page.waitForTimeout(500);
      await page.type('input[id="password"]', pwd);
      await page.screenshot({ path: './debug/login_page_pwd.png' });
      await page.click('button[id="signin_btn"]');
      // close the pop-up asking us to open Slack app
      await page.waitForTimeout(5000);
      await page.on('alert', async dialog => {
        await page.screenshot({ path: './debug/login_page_pop_up.png' });
        await console.log(dialog.message());
        await dialog.dismiss();    
      });

      await page.waitForTimeout(10000);
      if (page.url().indexOf('login') > 0) {
        console.log('we are not getting past the login page');
        await page.screenshot({ path: './debug/not_thru_login.png' });
        await browser.close();
        return;
      };
      console.log('boom, we are in!');
      // head to the intro channel
      url = 'https://app.slack.com/client/'+slack_instance_id+'/'+channel+'/';
      await console.log('we are headed to: '+url);
      await page.goto(url);
      await page.waitForTimeout(5000);
      await page.screenshot({ path: './debug/channel.png' });
      await page.evaluate(() => { window.scroll(0,0); });
      await page.waitForTimeout(2000);
      const html = await page.content();
      // console.log(html);
      await fs.writeFile('./data/page.html', html, (err) => {
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
