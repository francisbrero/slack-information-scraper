try: 
    from BeautifulSoup import BeautifulSoup
except ImportError:
    from bs4 import BeautifulSoup

# Change encoding to avoid silly errors
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

# Create the output csv file and create headers
f = open('./output/slack_scrape.csv', 'w+')
f.write('"name", "title", "email", "phone"\n')

# Open file and parse
with open('./data/slack_team.html', 'rb') as file:
    soup = BeautifulSoup(file,"html.parser")

cnt = 0
err = 0

# Find all member DOM elements
elements = soup.find_all("div", class_="team_list_item member_item cursor_pointer active expanded clearfix".split())

# Process them
for member in elements:
	# Get the name of the user
	name_title = member.find("div", class_="member_name_and_title")
	name = name_title.find("a")
	# Get the tile when available
	title_o = name_title.find_all("div", class_="member_title")
	if (len(title_o) > 0):
		title = title_o[0].string
	else:
		title = ''
	# Get the email address and phone number
	email_phone = member.find("div", class_="expanded_member_details small_top_padding col span_6_of_12 no_bottom_margin")
	email_phone_table = email_phone.find_all("tr")
	phone = ''
	email = ''
	for tr in email_phone_table:
		#Phone
		phone_o = tr.find_all("span", title="Phone Number")
		if (len(phone_o) > 0):
			phone = tr.find("a").string
		#Email
		email_o = tr.find_all("span", title="Email")
		if (len(email_o) > 0):
			email = tr.find("a").string
	# Return results
	try:
		f.write('"' + name.string + '", "' + title + '", "' + email + '"' +',"' + phone + '"\n')
		cnt =+1
	except:
		print("error with user " + name.string)
		err =+1
message = "inserted " + str(cnt) + " successfully records into the file, there were " + str(err) + " errors"
print(message)