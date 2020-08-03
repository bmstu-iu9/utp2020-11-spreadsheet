import fs from 'fs';
import FormatError from '../../errors/FormatError.js';

export default class ClassConverter {
  static saveJson(userWorkbook, pathToWorkbooks) {
    const file = this.convertToJson(userWorkbook);
    fs.mkdirSync(pathToWorkbooks, { recursive: true });
    fs.writeFileSync(`${pathToWorkbooks}/${userWorkbook.name}.json`, file);
  }

  static convertToJson(userWorkbook) {
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
}
