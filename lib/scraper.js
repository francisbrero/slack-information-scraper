// scraper.js
'use strict';

var Nightmare = require('nightmare');
new Nightmare()
// // signout => use this is you need to signout first (required if you run multiple time)
//   .goto("https://slack.com/signout/YOUR_SLACK_SIGNOUT_ID")
//   .wait(5000)
//   .screenshot('logout.png')
//   .click('a.btn.btn_large')
//   .wait(5000)
//   .screenshot('./debug/0_logged_out.png')
//signin
  .goto('https://YOUR_SLACK_TEAM.slack.com/team')
  .wait(15000)
  .screenshot('./debug/1_screen_load.png')
  .type('input[id="email"]', 'YOUR_EMAIL') 
  .type('input[id="password"]', 'YOUR_PASSWORD') 
  .click('.btn.btn_large.full_width.ladda-button')
  .wait(15000)
  .screenshot('./debug/2_screen_loaded.png')
  .html('./data/slack_team.html', 'HTMLComplete')
  .run(function(err, nightmare) {
    if (err) {
      console.log(err);
    }
    process.exit()
  });