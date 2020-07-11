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

  static saveJson(userName, userWorkbook, pathToWorkbooks = '.') {
    const file = this.convertToJson(userWorkbook);
    if (!fs.existsSync(`${pathToWorkbooks}/${userName}`)) {
      try {
        fs.mkdirSync(`${pathToWorkbooks}/${userName}`);
      } catch (err) {
        throw new Error('Incorrect path to workbooks');
      }
    }
    fs.writeFileSync(`${pathToWorkbooks}/${userName}/${userWorkbook.name}.json`, file);
    return true;
  }
}
