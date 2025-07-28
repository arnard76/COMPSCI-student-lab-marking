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
