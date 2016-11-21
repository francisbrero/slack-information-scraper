# slack-information-scraper
Get all the team member info from a Slack team

# Initialization
## ensure you have node
If you don't that's a shame 
	=> with nvm go [here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-with-nvm-node-version-manager-on-a-vps)
	=> old school [here](https://nodejs.org/en/download/)

## ensure you have python 2.7 (at least)
Go [here](https://www.python.org/downloads/)

## install dependencies for the project
```
npm install
```

## log out of the Slack teams you're about to scrape

We're now ready to go!

# Step 1 => configure the scraper

Open lib/scraper.js and: 

## input your email and password to log in
```
.type('input[id="email"]', 'EMAIL') 
.type('input[id="password"]', 'PASSWORD')
```

## input the slack team you want to scrape
```
  .goto('https://SLACK_TEAM.slack.com/team')
```

Save

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

this outputs a csv file '/output/slack_scrape.csv' text qualified.

Enjoy!


# Comments/feedback 
are welcome!