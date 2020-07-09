'use strict';

const sum = (a, b) => a + b
const sub = (a, b) => a - b
const mul = (a, b) => a * b
const del = (a, b) => a / b
const rem = (a, b) => a % b
const exp = (a, b) => (b == null) ? a : a ** b 
const unMinus = a => -a

const equal = (a, b) => a == b
const more = (a, b) => a > b

const makeFunc = (func, args) => [func, args]
const makeInterval = (a1, a2) => [a1, a2]
const makeAddress = a => a

// все команды написанные выше - усовны, являются заглушками

class Parser {
    constructor(inputString) {
        this.inputString = inputString
        this.pos = 0
    }

    makeParserError(str) { throw new SyntaxError(`Parser syntax error in ${str} !`); }

    next() { this.pos++; }

    hasNext() { return this.pos < this.inputString.length; }

    get() { return hasNext() ? this.inputString[this.pos] : makeParserError("get"); }

    checkGet(c) {
        let res = hasNext() && (get() == c)
        if (res) next
        return res
    }

    static toInt(a) { return a.charCodeAt(); }

    parseBlock() {
        if (checkGet('=')) return parseEquals()
        return parseValue()
    }

    parseEquals() { return parseEparseHelperExpr(); }

    parseEqualsHelper(res) {  // 1 == | 2 >= | 3 > | 4 <= | 5 < | 6 !=
        let op = 0
        if (checkGet('!')) {
            if (!checkGet('=')) makeParserError("parseEqualsHelper (only !)")
            else op = 6
        } else if (checkGet('=')) {
            if (!checkGet('=')) makeParserError("parseEqualsHelper (only =)")
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
            if (!checkGet(')')) makeParserError("parsePower (wrong bracket sequence)")
            return res
        } else if (checkGet('-')) {
            return unMinus(parsePower())
        } else if (hasNext() && 'А' <= get() && get() <= 'Я') {
            let nameFun = parseNameFunc()
            if (!allFunc.has(nameFun)) makeParserError("parsePower (no function)")
            if (!checkGet('(')) makeParserError("parsePower (no argument)")
            let args = parseArgs()
            return runFunc(nameFun, args)
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
        else makeParserError("parseArgsHelper")
    }

    parseValue() {
        if (checkGet('\"')) {
            return parseStr()
        } else if (hasNext() && '0' <= get() && get() <= '9') {
            return parseNum()
        } else if (hasNext() && 'A' <= get() && get() <= 'Z') {
            let res = makeAddress(parseAddress())
            if (checkGet(':')) {
                let res2 = makeAddress(parseAddress())
                return makeInterval(res, res2)
            }
            return res
        } else makeParserError("parseValue")
    }

    parseFromTo(from, to, func) {
        if (!(hasNext() && from <= get() && get() <= to)) makeParserError("parseFromTo")
        res = 0
        while (hasNext() && from <= get() && get() <= to) {
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
        if (!checkGet('\"')) makeParserError("parseStr")
        res = ""
        while (!checkGet('\"')) {
            res += get()
            next()
        }
        return res
    }

    run() {
        let ans = parseBlock()
        if (this.pos < this.inputString.length) makeParserError("run")
        return ans
    }
}