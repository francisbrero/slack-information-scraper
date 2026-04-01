const puppeteer = require('puppeteer');
const { connectToMongo } = require('../db/mongo_client');

async function scrapeMessages(cookies, channels) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set cookies for Slack authentication
  await page.setCookie(...cookies);

  const db = await connectToMongo();
  const messagesCollection = db.collection('messages');

  for (const channel of channels) {
    console.log(`Scraping channel: ${channel}`);
    const channelURL = `https://yourworkspace.slack.com/archives/${channel}`;
    await page.goto(channelURL, { waitUntil: 'networkidle2' });

    // Wait for messages to load
    await page.waitForSelector('.c-virtual_list__item');

    // Scroll to load more messages
    let loadMore = true;
    while (loadMore) {
      loadMore = await page.evaluate(() => {
        const scrollContainer = document.querySelector('.c-scrollbar__hider');
        if (scrollContainer) {
          scrollContainer.scrollBy(0, 500);
          return true;
        }
        return false;
      });
      await page.waitForTimeout(1000);
    }

    // Extract messages
    const messages = await page.$$eval('.c-virtual_list__item', items => {
      return items.map(item => {
        const text = item.querySelector('.c-message_kit__text')?.innerText || '';
        const timestamp = item.querySelector('time')?.getAttribute('datetime') || '';
        const user = item.querySelector('.c-message_kit__sender')?.innerText || '';
        return { text, timestamp, user };
      });
    });

    // Save to database
    if (messages.length > 0) {
      await messagesCollection.insertMany(messages, { ordered: false });
      console.log(`Saved ${messages.length} messages from ${channel}`);
    }
  }

  await browser.close();
  console.log("Scraping completed.");
}

module.exports = scrapeMessages;
