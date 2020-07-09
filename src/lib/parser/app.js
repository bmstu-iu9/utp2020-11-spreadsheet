'use strict';

const sum = (a, b) => a + b
const sub = (a, b) => a - b
const mul = (a, b) => a * b
const del = (a, b) => a / b
const rem = (a, b) => a % b
const exp = (a, b) => (b == null) ? a : a ** b // топ10 успешных реализаций
const equal = (a, b) => a == b
const more = (a, b) => a > b
const unMinus = a => -a
const allFunc = new Map([
    ["МОД", a => (a < 0) ? -a : a]
    // ну и другие функции - мне уже больно больше чем нужно делать 
])
const runFunc = (func, args) => { /* помолится и забыться */ return 1; }
const makeInterval = (a1, a2) => [a1, a2]
const getVal = a => 1

// все команды написанные выше parseExpr - усовны, являются заглушками

class Parser {
    constructor(inputString) {
        this.inputString = inputString
        this.pos = 0
    }

    next() { this.pos++; }

    get() { return (this.pos < this.inputString.length) ? this.inputString[this.pos] : String.fromCodePoint(0); }

    checkGet(c) {
        let res = get() == c
        if (res) next
        return res
    }

    makeError() { throw new Error }

    static toInt(a) { return a.charCodeAt(); }

    parseBlock() {
        if (checkGet('=')) return parseEquals()
        return parseValue()
    }

    parseEquals() { return parseEparseHelperExpr(); }

    parseEqualsHelper(res) {  // 1 == | 2 >= | 3 > | 4 <= | 5 < | 6 !=
        let op = 0
        if (checkGet('!')) {
            if (!checkGet('=')) makeError()
            else op = 6
        } else if (checkGet('=')) {
            if (!checkGet('=')) makeError()
            else op = 1
        } else if (checkGet('>')) {
            if (checkGet('=')) op = 2
            else op = 3
        } else if (checkGet('<')) {
            if (checkGet('=')) op = 4
            else op = 5
        } else return res
        let res2 = parseExpr()
        switch (op) {
            case 1: return equal(res, res2)
            case 2: return !more(res2, res)
            case 3: return more(res, res2)
            case 4: return !more(res, res2)
            case 5: return more(res2, res)
            case 6: return !equal(res, res2)
        }
    }

    parseExpr() { return parseExprHelper(parseTerm()); }

    parseExprHelper(res) {
        if (checkGet('-')) return parseExprHelper(sub(res, parseTerm()))
        else if (checkGet('+')) return parseExprHelper(sum(res, parseTerm()))
        else return res
    }

    parseTerm() { return parseTermHelper(parseFactor()); }

    parseTermHelper(res) {
        if (checkGet('*')) return parseTermHelper(mul(res, parseFactor()))
        else if (checkGet('/')) return parseTermHelper(div(res, parseFactor()))
        else if (checkGet('%')) return parseTermHelper(rem(res, parseFactor()))
        else return res
    }

    parseFactor() { return exp(parsePower(), parseFactorHelper()); }

    parseFactorHelper() {
        if (checkGet('^')) return exp(parsePower(), parseFactorHelper())
        else return null
    }

    parsePower() {
        if (checkGet('(')) {
            let res = parseExpr()
            if (!checkGet(')')) makeError()
            return res
        } else if (checkGet('-')) {
            return unMinus(parsePower())
        } else if ('А' <= get() && get() <= 'Я') {
            let nameFun = parseNameFunc()
            // вот тут (если будут) должны появится ленивые вычисления - например, вместо парсинга, подсовывать подстроку, но пока пусть будет без этого
            if (!allFunc.has(nameFun)) makeError()
            if (!checkGet('(')) makeError()
            let args = parseArgs()
            return runFunc(allFunc.get(nameFun), args)
        } else parseValue()
    }

    parseArgs() {
        let arr = []
        if (checkGet(')')) return arr
        arr.push(parseExpr())
        return parseArgsHelper(arr)
    }

    parseArgsHelper(arr) {
        if (checkGet(';')) {
            arr.push(parseExpr())
            return parseArgsHelper(arr)
        } else if (checkGet(')')) return arr
        else makeError()
    }

    parseValue() {
        if (checkGet('\"')) {
            return parseStr()
        } else if ('0' <= get() && get() <= '9') {
            return parseNum()
        } else if ('A' <= get() && get() <= 'Z') {
            let res = parseAddress()
            if (checkGet(':')) {
                let res2 = parseAddress()
                return makeInterval(res, res2)
            }
            return getVal(res)
        } else makeError()
    }

    parseFromTo(from, to, func) {
        if (!(from <= get() && get() <= to)) makeError()
        res = 0
        while (from <= get() && get() <= to) {
            res = func(res, get())
            next()
        }
        return res
    }

    parseNum() { return parseFromTo('0', '9', (res, c) => res * 10 + toInt(c) - toInt('0')); }

    parseNameFunc() { return parseFromTo('А', 'Я', (res, c) => res + с); }

    parseAddress() {
        checkGet('$')
        let ind1 = parseFromTo('A', 'Z', (res, c) => res * 26 + toInt(c) - toInt('A'))
        checkGet('$')
        let ind2 = parseNum()
        return [ind1, ind2]
    }

    parseStr() {
        if (!checkGet('\"')) makeError()
        res = ""
        while (!checkGet('\"')) {
            res += get()
            next()
        }
        return res
    }

    run() {
        let ans = parseBlock()
        if (this.pos < this.inputString.length) makeError()
        return ans
    }
}