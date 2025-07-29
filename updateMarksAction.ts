// PROPERTIES OF EXCEL SPREADSHEET FORMAT
const AUID_COLUMN = 3;
const labColumns = {
  "Monday 10am-12pm": "E",
  "Tuesday 10am-12pm": "F",
  "Tuesday 1-3pm": "G",
  "Wednesday 12-2pm": "H",
  "Wednesday 2-4pm": "I",
  "Friday 12-2pm": "J",
};

function main(
  workbook: ExcelScript.Workbook,
  currentLabNumber: number,
  currentLabSession: string,
  marks: string[]
) {
  const columnForLabSession: string = labColumns[currentLabSession];
  const worksheetIndex = currentLabNumber - 1;
  workbook.getWorksheets()[worksheetIndex].activate();
  const worksheet = workbook.getActiveWorksheet();

  marks.forEach((string) => {
    const [AUID, marksText] = string.split("|");
    const studentMarks = parseInt(marksText);
    const matches = worksheet
      .findAll(AUID, { completeMatch: true, matchCase: true })
      .getAreas();

    if (matches.length !== 1)
      return console.log(
        `Error: DUPLICATE MATCH OR NO MATCH FOR ${AUID}: ${matches.length} matches `
      );

    if (matches[0].getCellCount() !== 1)
      return console.log(
        `Error: Cell size is not one for AUID ${AUID}: ${matches[0].getCellCount()} cells in range`
      );

    if (matches[0].getColumnIndex() !== AUID_COLUMN)
      return console.log(
        `Error: Found AUID ${AUID} but not in the AUID Column (${AUID_COLUMN}): found in ${matches[0].getColumnIndex()}`
      );

    const studentRow = matches[0].getRowIndex() + 1;

    if (studentMarks > 2 || studentMarks < 0)
      return console.log(
        `Error: student marks are ${studentMarks} which isn't 0, 1 or 2 marks`
      );

    // fill in the marks in student row for the correct lab session
    worksheet
      .getRange(
        `${columnForLabSession}${studentRow}:${columnForLabSession}${studentRow}`
      )
      .setValue(studentMarks);
  });
}
