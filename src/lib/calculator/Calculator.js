import Parser from '../parser/Parser.js';
import TreeRunner from './TreeRunner.js';

export default class Calculator {
  constructor(book) {
    this.book = book;
  }

  calculate(cell, page) {
    const tree = new Parser(this.book.spreadsheets[page].getCell(cell).value).run();
    return new TreeRunner(this.book, page, tree).run();
  }
}
