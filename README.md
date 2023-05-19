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

# Usage
``` bash
node ./lib/get_channel_messages.js your_slack_id your_email  your_password your_channel_id
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