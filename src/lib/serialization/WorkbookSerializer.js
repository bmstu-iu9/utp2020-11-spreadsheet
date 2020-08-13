import FormatError from '../../lib/errors/FormatError.js';

export default class WorkbookJsonSerializer {
  static serialize(userWorkbook) {
    if (userWorkbook === null) {
      throw new FormatError('Empty workbook');
    }
    const jsonWorkbook = {
      name: userWorkbook.name,
    };
    const sheets = [];
    userWorkbook.spreadsheets.forEach((spreadsheet) => {
      const sheet = {
        name: spreadsheet.name,
      };
      const cells = {};
      let obj = spreadsheet.cells;
      if (!(obj instanceof Map)) {
        obj = new Map(Object.entries(spreadsheet.cells));
      }
      obj.forEach((cell, position) => {
        cells[position] = {
          color: cell.color,
          type: cell.type,
          value: cell.value,
        };
      });
      sheet.cells = cells;
      sheets.push(sheet);
    });
    jsonWorkbook.spreadsheets = sheets;
    return jsonWorkbook;
  }
}
