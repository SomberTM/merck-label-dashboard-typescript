# Highest Priority Tasks

-   [x] Merge everyone's pull requests from local branches to get final combined solution
-   [ ] Finish Terri's requests for Pharmeceutical Team **(this is a must have before presentation)**
    -   [x] Add a page to the frontend specifically for the Pharmeceutical Team that has MK, Sample Name, ELN Notebook Number, and Date - [x] How are we displaying samples for the Pharmeceutical Team - Are they on their own view samples page or the same view samples page and if so do we have the ability to filter to get only samples associated with pharmeceutical team?
    -   [x] Add table in database specifically for the Pharmeceutical Team
    -   [ ] Make sure QR code scanning feautre that is present on the frontend works on multiple devices and can communicate with printer as well **(would be nice to be able to demo this in final presentation)**
    -   [x] Finish Audit Trail feature \*(I think this is already done)

# ToDo's From Jonathan

-   [x] Get confirmation message ("sample successfully updated") on frontend when you edit a sample
-   [x] Have edits show up automatically without manually having to refresh page
-   [x] Get confirmation message ("sample successfully created") on frontend when you create a new sample
-   [ ] Add comment field for sample to database and frontend
    -   [ ] Text field for scientists to add any additional information
-   [x] Make expired labels appear RED in View Samples page on Frontend
    -   [x] Sample is expired when current_date > expiration_date
-   [x] Add a filter button to the View Samples page on Frontend to show only expired samples
-   [x] Add option to discard sample in View Samples page on Frontend
    -   [x] Discarding sample removes from table in View Samples
    -   [x] DO NOT delete from database
    -   [x] Should not be able to print discarded samples
    -   [x] Don't make any changes ot database - just don't send to View Samples page
-   [x] Ability to view discarded samples on Frontend
    -   [x] Show all discarded
    -   [x] Ability to see history (audit trail) for discarded as well
-   [ ] Calculate expiration data programatically **(next semester)**
    -   [ ] Add extra columns in database for scientists to add in more info on contents of solution
    -   [ ] Use solution contents to calculate the expiration date

# Thomas' ToDo's

-   [x] Get the audit table working with the new generalized SampleTable component
    -   [x] probably will have to make the functions like onDelete, updateSample, onGenerateLabels
            inside of SampleTableProps optional.
    -   [x] SampleTable should also ensure that generate labels, delete labels, and view audit table buttons
            are not shown inside of the grid toolbar.
-   [x] Implement the necessary functions inside of the SamplesPage and PSamplesPage (onRefresh, onGenerateLabels, onDelete)
-   [x] Work on generalizing the form component
-   [x] Work on the nav bar
-   [x] Get the printer working
-   [ ] MAKE README BETTER!
-   [ ] COMMENT ALL CODE :(((((!
-   [x] LEARN DOCKER!
-   [x] Refactor the deleted samples controller/api
    -   Given an audit_id, find the entry in the deleted table. Now we have access to the team.
        Based on the team query the correct table for all samples with the provided audit_id
-   [x] Refactor routes to have a more, intuitive, name/endpoint
-   [x] Add redux reducers & actions for deleted samples?
-   [~] With the new db design, it might be important for admins to be able to specify the type of a field.
    Such as, DateTime, Number, String, and have it as a drop down when they view the team on the admin panel.

-   [x] Work on the dashboard for creating teams and adding fields to a team.

    -   [x] After that work on updating the samples table and form based on the current team.
    -   [x] Possibly add a drop down on the navbar to select your team. Use react context to access current team from components.

-   [ ] Make UI for creating labels and editing labels better.

!!!!!!

-   [x] CHANGE QR CODE TO STORE THE SAMPLES AUDIT ID. THAT WAY OLDER SAMPLES STILL MAP TO THE NEWEST ONE ON THE SITE. ALSO
        CHANGE THE ID COLUMN OF THE SAMPLES TABLE TO BE THE AUDIT ID.
        !!!!!!
-   [ ] Samples table has some bugs with the way sample information is passed to it. Need to fix that.
    -   [ ] Sample table should store a local copy of samples that way editing is more seamless. We can update the local copy
            and then send the updated sample to the backend. This way we don't have to worry about the backend updating the
            sample and then the frontend updating the sample. We can just update the local copy and send it to the backend.

# Server

-   [x] Generate qr code keys using a seeded or consistent hash algorithm
-   [x] Generate qr codes and be able to send them to front-end

# Client

-   [x] Button to edit a sample in table format
    -   [x] Have a log somewhere that shows who edited what and when
-   [x] Clean up styles, remove unused styles and make website look better
-   [x] Create different pages for (below) using react-router & react-router-dom. On top of this need to set up a router to redirect qr codes when scanned:
    -   [x] Sample viewing
    -   [x] Sample creating
    -   [x] Edit log
    -   [x] QR Code scanning
-   [x] Fix default value for textfields that are supposed to have dates
-   [x] MUI styles works sometimes and sometimes they dont -> could be because no theme is declared?
-   [x] Plan for edit button functionality
    -   When edit button is clicked, switch out the text in the table cell with a text field and change the edit icon to a checkmark and add an x next to it
-   [ ] Make it so you cant create a sample that has the same properties as an existing one
    -   if new_qr_code_key == existing_qr_code_key dont create that new sample
-   [x] Add the ability to scan a qr code using scanner
-   [ ] Possibly add the ability for scientist to have an account, basically just name so that you could sort by analyst. Or find all samples by a scientist. May not need cause you could just search anyway
-   [x] When creating a sample, cache the the form contents so that if the page is changed and then we come back, the form hasnt gone away
