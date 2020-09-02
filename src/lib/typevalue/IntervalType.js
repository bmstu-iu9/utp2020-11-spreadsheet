import EW from '../parser/ExpressionWrapper.js';

const toInt = (a) => a.charCodeAt();
const toChar = (a) => String.fromCharCode(a);
const div = (a, b) => (a - (a % b)) / b;

export default class IntervalType {
  constructor(interval) {
    [this.address1, this.address2] = interval.slice(1);
  }

  static makeTypeError(str) {
    throw new TypeError(`IntervalType: impossible type for ${str}() with not IntervalType`);
  }

  getArrayAddresses() {
    const left = (this.address1[2] < this.address2[2] ? this.address1[2] : this.address2[2]);
    const right = this.address1[2] + this.address2[2] - left;
    const up = (this.address1[3] < this.address2[3] ? this.address1[3] : this.address2[3]);
    const down = this.address1[3] + this.address2[3] - up;
    const ans = [];
    for (let number = up; number <= down; number += 1) {
      for (let words = left; words <= right; words += 1) {
        let address = '';
        let buf = words;
        if (buf < 26) {
          address = toChar(buf + toInt('A'));
        } else {
          while (buf >= 26) {
            address = toChar((buf % 26) + toInt('A')) + address;
            buf = div(buf, 26);
          }
          address = toChar((buf % 26) + toInt('A') - 1) + address;
        }
        ans.push(EW.makeAddress(address, number + 1, words, number));
      }
    }
    return ans;
  }
}
