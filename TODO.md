# Highest Priority Tasks
- [ ] Merge everyone's pull requests from local branches to get final combined solution
- [ ] Finish Terri's requests for Pharmeceutical Team **(this is a must have before presentation)**
    - [x] Add a page to the frontend specifically for the Pharmeceutical Team that has MK, Sample Name, ELN Notebook Number, and Date
          - [ ] How are we displaying samples for the Pharmeceutical Team - Are they on their own view samples page or the same view samples page and if so do we have the ability to filter to get only samples associated with pharmeceutical team?
    - [ ] Add table in database specifically for the Pharmeceutical Team
    - [x] Finish Audit Trail feature *(I think this is already done)

# ToDo's From Jonathan
- [ ] Get confirmation message ("sample successfully updated") on frontend when you edit a sample
- [ ] Have edits show up automatically without manually having to refresh page
- [ ] Get confirmation message ("sample successfully created") on frontend when you create a new sample
- [ ] Add comment field for sample to database and frontend
    - [ ] Text field for scientists to add any additional information
- [ ] Make expired labels appear RED in View Samples page on Frontend
    - [ ] Sample is expired when current_date > expiration_date
- [ ] Add a filter button to the View Samples page on Frontend to show only expired samples
- [ ] Add option to discard sample in View Samples page on Frontend
    - [ ] Discarding sample removes from table in View Samples
    - [ ] DO NOT delete from database
    - [ ] Add a variable in database indicating that sample is discarded
    - [ ] Should not be able to print discarded samples
    - [ ] Don't make any changes ot database - just don't send to View Samples page
- [ ] Ability to view discarded samples on Frontend
    - [ ] Show all discarded
    - [ ] Ability to see history (audit trail) for discarded as well
- [ ] Calculate expiration data programatically **(next semester)**
    - [ ] Add extra columns in database for scientists to add in more info on contents of solution
    - [ ] Use solution contents to calculate the expiration date




# Server
- [x] Implement printing using node-brother-lable-printer library
    - [ ] Not sure if it's the libraries fault but printer keeps giving error "Wrong roll type! Check the print data and try again". Hence I've tried setup printing through the IPP protocol, which is what the library uses under the hood, but with some modifications and still get the same error. Not sure if the data being passed is in the wrong format but Ive spent many hours on it to no avail
- [x] Generate qr code keys using a seeded or consistent hash algorithm
- [x] Generate qr codes and be able to send them to front-end

# Client
- [x] Button to edit a sample in table format
    - [ ] Have a log somewhere that shows who edited what and when
- [ ] Clean up styles, remove unused styles and make website look better
- [x] Create different pages for (below) using react-router & react-router-dom. On top of this need to set up a router to redirect qr codes when scanned:
    - [x] Sample viewing
    - [x] Sample creating
    - [ ] Edit log
    - [ ] QR Code scanning
- [x] Fix default value for textfields that are supposed to have dates
- [ ] MUI styles works sometimes and sometimes they dont -> could be because no theme is declared?
- [x] Plan for edit button functionality
    - When edit button is clicked, switch out the text in the table cell with a text field and change the edit icon to a checkmark and add an x next to it
- [ ] Use luxon to format dates properlly
- [ ] Make it so you cant create a sample that has the same properties as an existing one
    - if new_qr_code_key == existing_qr_code_key dont create that new sample
- [ ] Add the ability to scan a qr code using scanner
- [ ] Possibly add the ability for scientist to have an account, basically just name so that you could sort by analyst. Or find all samples by a scientist. May not need cause you could just search anyway
- [ ] When creating a sample, cache the the form contents so that if the page is changed and then we come back, the form hasnt gone away

# Label Management
- Labels are generated once upon request and cached
- Labels will be re-generated when edited
- If we get the same label twice just generate once then return cached base64 string or img obj
- ### Big Question
    - If labels are updated should their qr code key be changed? 
    - The qr code key is based off the properties of the sample so if the properties change the qr code key would as well
    - (Currently it doesnt change upon updates)
