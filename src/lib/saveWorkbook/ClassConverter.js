import fs from 'fs';

export default class ClassConverter {
  static convertToJson(userWorkbook) {
    if (userWorkbook === null) {
      throw new Error('Empty workbook');
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
      spreadsheet.cells.forEach((cell, position) => {
        cells[position] = {
          color: cell.color,
          type: cell.type,
          value: cell.value,
        };
      });
      sheet.cells = cells;
      sheets.push(sheet);
    });
    jsonWorkbook.sheets = sheets;
    return JSON.stringify(jsonWorkbook);
  }

  static saveJson(userWorkbook, pathToWorkbooks) {
    const file = this.convertToJson(userWorkbook);
    fs.mkdirSync(pathToWorkbooks, true);
    fs.writeFileSync(`${pathToWorkbooks}/${userWorkbook.name}.json`, file);
  }
}