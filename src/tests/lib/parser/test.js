import { Parser } from '../../../lib/parser/app.js';

const test = (str) => { console.log(`${str} => ${new Parser(str).run()}`); }

test(`1`)
test(`"asdf"`)
test(`12bc`)
test(`="abc"+"def"`)
test(`=(1+5^(1/2))/2`)
test(`=(1-5^(1/2))/2`)
test(`=СУММА(A2:F2;B3:ZA3)`)
test(`=A1`)
test(`=1+"b"+3+"c"`)