# slack-information-scraper
Get all the team member info from a Slack team

# Initialization
## ensure you have node
If you don't that's a shame 
	=> with nvm go [here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-with-nvm-node-version-manager-on-a-vps)
	=> old school [here](https://nodejs.org/en/download/)

## ensure you have python 2.7 (at least)
Go [here](https://www.python.org/downloads/)

You will need 2 folders data and debug
create them with
```bash
mkdir data
mkdir debug
```

## install dependencies for the project
```
npm install
```

# Usage
Configure the `.env` file with your slack team name, your slack email and password
It should look something like this:
```
SLACK_INSTANCE_NAME=
SLACK_INSTANCE_ID=
SLACK_USERNAME=
SLACK_PASSWORD=
```
# Scraping
## Get members from the slack instance
``` bash
node ./lib/get_members.js C0284GBS76G
```
## Get messages from channel
Specify the channel you want to parse
``` bash
node ./lib/get_channel_messages.js channel_id
```

ex: `node ./lib/get_channel_messages.js C0284GBS76G`

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