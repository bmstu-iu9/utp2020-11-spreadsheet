import FormatError from '../../errors/FormatError.js';

export const defaultCellColor = '#ffffff';
export const valueTypes = {
  number: 'number',
  boolean: 'boolean',
  string: 'string',
  formula: 'formula',
};

export class Cell {
  constructor(
    type = valueTypes.string,
    value = null,
    color = null,
  ) {
    this.setValue(type, value);
    this.setColor(color);
  }

  setValue(type, value = null) {
    if (value === null) {
      this.value = Cell.getDefaultValue(type);
      this.type = type;
    } else if (Cell.isValueCorrect(type, value)) {
      this.type = type;
      this.value = value;
    } else {
      throw new TypeError('value type does not correspond to specified cell type');
    }
  }

  setColor(color = null) {
    if (color === null) {
      this.color = defaultCellColor;
    } else if (Cell.isColorCorrect(color)) {
      this.color = color;
    } else {
      throw new FormatError('specified color is not a correct hexadecimal color');
    }
  }

  static isColorCorrect(color) {
    const colorRegExp = RegExp(
      '^#[0-9a-f]{6}$',
    );
    return colorRegExp.test(color);
  }

  static isValueCorrect(type, value) {
    const currentTypeString = typeof value;
    const requiredTypeString = Cell.getRequiredTypeString(type);
    if (type === valueTypes.number
      && (Number.isNaN(value) || !Number.isFinite(value))) {
      return false;
    }
    return currentTypeString === requiredTypeString;
  }

  static getRequiredTypeString(type) {
    return typeof Cell.getDefaultValue(type);
  }

  static getDefaultValue(type) {
    switch (type) {
      case valueTypes.number:
        return 0;
      case valueTypes.boolean:
        return false;
      case valueTypes.string:
      case valueTypes.formula:
        return '';
      default:
        throw new FormatError('unknown cell type');
    }
  }
}
