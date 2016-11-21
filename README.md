# slack-information-scraper
Get all the team member info from a Slack team

# Initialization
## ensure you have node

## ensure you have python 2.7 (at least)

## install dependencies
'''
npm install
'''

## log out of the Slack teams you're about to scrape

We're now ready to go!

# Step 1 => configure the scraper
## input your email and password to log in
```
.type('input[id="email"]', 'EMAIL') 
.type('input[id="password"]', 'PASSWORD')
```

## input the slack team you want to scrape
```
  .goto('https://SLACK_TEAM.slack.com/team')
```

# Step 2 => run the scraper
```
node lib/scraper.js 
```

### Debug:
This creates a couple pictures in debug to ensure everything went smoothly

### Output
The scraper outputs a raw html in ./data called 'slack_team.html' which contains all the goodness you're looking for


# Step 3 => parse the html to get a clean csv
```
python lib/html_parse.py 
```

### this outputs a csv file '/output/slack_scrape.csv' text qualified.
Enjoy!


# Comments/feedback 
are welcome!