// scraper.js
'use strict';

var email = process.argv[1];
var pwd = process.argv[2];

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
  .goto('https://mindtheproduct.slack.com')
  .wait(1500)
  .html('./data/signup.html', 'HTMLComplete')
  .screenshot('./debug/1_screen_load.png')
  .type('input[id="email"]', email)   
  .screenshot('./debug/2_screen_loaded.png')
  .click('.btn.btn_large.full_width.ladda-button')
  .wait(1500)
  .type('input[id="password"]', pwd)
  .screenshot('./debug/3_screen_loaded.png')  
  .type('body','\u0009')
  .type('body','\u000d')
  // .click('.btn.btn_large.full_width.ladda-button')
  .wait(1500)
  .screenshot('./debug/4_screen_loaded.png')
  .html('./data/slack_team.html', 'HTMLComplete')
  .run(function(err, nightmare) {
    if (err) {
      console.log(err);
    }
    process.exit()
  });