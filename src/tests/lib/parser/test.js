import { Parser } from '../../../lib/parser/app.js';

const test = str => { new Parser(str).run() }

const checkAns = (str, ans) => test(str) == ans

const checkManyAns = strs => {
    for (let x = 0; x < strs.length; x++) {
        if (!checkAns(strs[x][0], strs[x][1])) {
            console.log("Find miss!")
            console.log(`True ans: ${strs[x][1]} \nFind ans: ${test(strs[x][0])}`)
            return;
        }
    }
    console.log("All true!")
}

checkManyAns([
    [`1`, `1`],
    [`"asdf"`, `"asdf"`],
    [`12bc`, `12bc`],
    [`="abc"+"def"`, `abcdef`],
    [`=(1+5^(1/2))/2`, (1 + Math.sqrt(5)) / 2],
    [`=(1-5^(1/2))/2`, (1 - Math.sqrt(5)) / 2],
    [`=СУММА(A2:F2;B3:ZA3)`, [`СУММА`, [[[0, 2], [5, 2]], [[2, 3], [550, 3]]]]],
    [`=A1`, [0, 1]],
    [`=1+"b"+3+"c"`, `1b3c`],
])