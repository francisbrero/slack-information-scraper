const puppeteer = require('puppeteer');
const fs = require('fs');

var slack_instance = process.argv[2];
var email = process.argv[3];
var pwd = process.argv[4];


var main = (async () => {
  const browser = await puppeteer.launch({
      headless: false // change to false for debugging
      // ,args: ['--start-fullscreen']
    });
  console.log('oh yeah, about to log in');
  const page = await browser.newPage();
  await page.goto('https://'+slack_instance+'.slack.com');
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
  await page.waitForTimeout(500);
  await page.on('dialog', async dialog => {
    await page.screenshot({ path: './debug/login_page_pop_up.png' });
    await console.log(dialog.message());
    await dialog.dismiss();    
  });

  await page.waitForTimeout(15000);
  if (page.url().indexOf('login') > 0) {
    console.log('we are not getting past the login page');
    await page.screenshot({ path: './debug/not_thru_login.png' });
    await browser.close();
    return;
  };
  console.log('boom, we are in!');
  // head to the intro channel
  await page.goto('https://app.slack.com/client/T01T4HHS2V8/C0284GBS76G');
  await page.waitForTimeout(10000);
  await page.screenshot({ path: './debug/channel.png' });
  const html = await page.content();
  // console.log(html);
  await fs.writeFile('./data/page.html', html, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
    }
  });

  // close the browser
  await browser.close();
  console.log('I am done')
 });

main()
  .catch((e) => console.log('err: ' + e));