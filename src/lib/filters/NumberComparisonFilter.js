import CellColumnFilter from './CellColumnFilter.js';
import { valueTypes } from '../spreadsheets/Cell.js';
import FormatError from '../../Errors/FormatError.js';

export const operators = {
  equal: 'equal',
  more: 'more',
  moreOrEqual: 'moreOrEqual',
  less: 'less',
  lessOrEqual: 'lessOrEqual',
  notEqual: 'notEqual',
};

export class NumberComparisonFilter extends CellColumnFilter {
  constructor(column, operator, constant) {
    super(column);
    this.setOperator(operator);
    this.setConstant(constant);
  }

  setOperator(operator) {
    let operatorPredicate;
    switch (operator) {
      case operators.equal:
        operatorPredicate = (a, b) => a === b;
        break;
      case operators.more:
        operatorPredicate = (a, b) => a > b;
        break;
      case operators.moreOrEqual:
        operatorPredicate = (a, b) => a >= b;
        break;
      case operators.less:
        operatorPredicate = (a, b) => a < b;
        break;
      case operators.lessOrEqual:
        operatorPredicate = (a, b) => a <= b;
        break;
      case operators.notEqual:
        operatorPredicate = (a, b) => a !== b;
        break;
      default:
        throw new FormatError('unknown operator');
    }
    this.operatorPredicate = operatorPredicate;
  }

  setConstant(constant) {
    this.constant = constant;
  }

  doesCellMatch(cell) {
    return cell.type === valueTypes.number && this.operatorPredicate(cell.value, this.constant);
  }
}
