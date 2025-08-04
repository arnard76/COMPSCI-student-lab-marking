# Marking Assistant for COMPSCI 235 Labs

## Problem: Marking

Marking means specifying 0, 1 or 2 marks for a student for the current lab based on amount of lab tasks completed by the student.

So in order to mark for a student, the tutor needs to do the following

### choose which lab number or week

### choose the lab session or datetime

### identify the student

- name e.g. Arnav Shekaran
- ID photo
- AUID number e.g. 835020202
- UPI e.g. ashe292
- email e.g. ashe292@aucklanduni.ac.nz

### assess student's tasks

Depending on how many tasks the student has completed, provide a mark of 0, 1 or 2.

## Design Ideas

- lab number and lab session can be selected before each session to avoid accidentally providing a mark for the correct student but on the wrong session.

- instead of typing 0, 1 or 2, press it for speed

- one more click to go back to search page

- scroll through students for quick find or perform a text search using any id property

- show how many students done so far (extension)

- show if student has already been marked

- for phone or tablet (extension) or touchscreen laptop (extension)

- if they are multiple students with the same name, show a warning when searching or assigning marks to them (extension)

## UI Design

[Figma Design File](https://www.figma.com/design/L3uzvKARzsDWAlpAvsCMji/mark-COMPSCI-235-student-lab-tasks?node-id=0-1&t=MxjMkn8ajomZBip1-1)

## Implementation Design (Architecture)

- get students list
- update shared excel file
- log all changes for backup in database
  - log these events
    - lab number or lab session selected
    - add student marks
    - student not being shown in list
    - any errors!
  - each log should contain
    - event details
    - datetime
    - lab TA id
- UI

## 1 ideas

- manually upload once?
- power automate (couldn't find tables in file)
- zapier (requires uoa admin access :( )

## 2 ideas - update shared excel file

- manually after each lab using excel scripts

## Improvement Ideas

After the first lab session, I noticed these issues!

- add loading after 'mark student' button is clicked ✅
- ~~automatic screenshot capture~~ not as useful as 👇
- automatic download a log and the marks ✅(even if database works)
- some students weren't found in the app search so I noted them on whatsapp
  some students weren't in the app's database/server storage
  because the source is the excel file which was updated
  TEMP solution: update from excel ✅
  permanent solution: read excel automatically or use a common database for both?

After second lab issues:

- have to go to database to export mark students data for excel automate script
  once lab is over, would be great to display the inputs for the excel script
  e.g. as 3 copy-paste actions on a laptop ✅

- small wait time after finished marking ✅ reduced and added success message feedback

- encourage tutor to put all marks in db into excel spreadsheet (not just the one being marked currently!)
