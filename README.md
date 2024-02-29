# slack-information-scraper
Get messages from a slack channel and parse them into a csv file

# Initialization
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
This creates a couple screenshots in debug to ensure everything went smoothly

### Output
The scraper outputs a raw html in ./data called with today's date which contains all the goodness you're looking for.


# Step 3 => parse the html to get a clean csv
## start a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```
## install the requirements
```bash
pip install -r requirements.txt
```
## run the parser
```bash
python lib/messages_html_parse.py
```

this outputs a csv file '/output/slack_scrape.csv' text qualified.

Enjoy!

## Deactivate the virtual environment
```bash
deactivate
```

# Comments/feedback 
are welcome!