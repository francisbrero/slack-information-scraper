from bs4 import BeautifulSoup

# Create the output csv file and create headers
f = open('./output/slack_scrape.csv', 'w+')
f.write('"name", "message", "date"\n')

# Open file and parse
with open('./data/C0284GBS76G_20240217.html', 'rb') as file:
    soup = BeautifulSoup(file,"html.parser")

cnt = 0
err = 0

# Find all member DOM elements
elements = soup.find_all("div", class_="c-message_kit__gutter__right".split())

# Process them
for member in elements:
	# Get the name of the user
	name = member.find("span", class_="c-message__sender c-message_kit__sender")
	
	# Get the date of the message
	date_a = member.find_all("a")[0]
	# get aria-label attribute as the date
	date = date_a['aria-label']

	# Get the message
	message_div = member.find("div", class_="c-message_kit__blocks c-message_kit__blocks--rich_text")
	# print(message_div)
	# get all the text in the message and join it
	message = ""
	for text in message_div.strings:
		message += text
	
	# Return results
	try:
		f.write('"' + name.string + '", "' + message + '", "' + date + '"\n')
		cnt =+1
	except:
		print("error with user " + name.string)
		err =+1
res = "inserted " + str(cnt) + " successfully records into the file, there were " + str(err) + " errors"
print(res)