function main(workbook: ExcelScript.Workbook) {
  let selectedRange = workbook.getSelectedRange();
  let selectedSheet = workbook.getActiveWorksheet();
  // Find first 290510288 on F1 on selectedSheet
  selectedRange.find("290510288", {
    completeMatch: false,
    matchCase: false,
    searchDirection: ExcelScript.SearchDirection.forward,
  });
  let selectedCell = workbook.getActiveCell();
  // Find first 130215087 on F6 on selectedSheet
  selectedCell.getOffsetRange(5, 0).find("130215087", {
    completeMatch: false,
    matchCase: false,
    searchDirection: ExcelScript.SearchDirection.forward,
  });
  // Select cell on selectedSheet offset by 2 row(s) and 1 column(s) relative to selectedCell
  selectedCell.getOffsetRange(2, 1).select();
}
