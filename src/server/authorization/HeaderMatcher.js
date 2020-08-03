import FormatError from '../../Errors/FormatError.js';

export default class HeaderMatcher {
  constructor(name, prefix) {
    this.name = HeaderMatcher.getValueIfString(name, 'name');
    this.prefix = HeaderMatcher.getValueIfString(prefix, 'prefix');
  }

  doesHeaderMatch(name, value) {
    const parsedName = HeaderMatcher.getValueIfString(name, 'name');
    const parsedValue = HeaderMatcher.getValueIfString(value, 'value');
    return parsedName === this.name && parsedValue.startsWith(this.prefix);
  }

  fetchPayload(name, value) {
    if (!this.doesHeaderMatch(name, value)) {
      throw new FormatError('Header does not match specified format');
    }
    const prefixLength = this.prefix.length;
    return value.substr(prefixLength);
  }

  static getValueIfString(value, valueName) {
    if (typeof value !== 'string') {
      throw new TypeError(`${valueName} must be a string`);
    }
    return value;
  }
}
