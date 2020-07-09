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

    next() { pos++; }

    get() { return (pos < inputString.length) ? inputString[pos] : String.fromCodePoint(0); }

    checkGet(c) {
        let res = get() == c
        if (res) next
        return res
    }

    error() { throw new Error }

    static toInt(a) { return a.charCodeAt(); }

    block() {
        if (checkGet('=')) return equals()
        return value()
    }

    equals() { return _equals(expr()); }

    _equals(res) {  // 1 == | 2 >= | 3 > | 4 <= | 5 < | 6 !=
        let op = 0
        if (checkGet('!')) {
            if (!checkGet('=')) error()
            else op = 6
        } else if (checkGet('=')) {
            if (!checkGet('=')) error()
            else op = 1
        } else if (checkGet('>')) {
            if (checkGet('=')) op = 2
            else op = 3
        } else if (checkGet('<')) {
            if (checkGet('=')) op = 4
            else op = 5
        } else return res
        let res2 = expr()
        switch (op) {
            case 1: return equal(res, res2)
            case 2: return !more(res2, res)
            case 3: return more(res, res2)
            case 4: return !more(res, res2)
            case 5: return more(res2, res)
            case 6: return !equal(res, res2)
        }
    }

    expr() { return _expr(term()); }

    _expr(res) {
        if (checkGet('-')) return _expr(sub(res, term()))
        else if (checkGet('+')) return _expr(sum(res, term()))
        else return res
    }

    term() { return _term(factor()); }

    _term(res) {
        if (checkGet('*')) return _term(mul(res, factor()))
        else if (checkGet('/')) return _term(div(res, factor()))
        else if (checkGet('%')) return _term(rem(res, factor()))
        else return res
    }

    factor() { return exp(power(), _factor()); }

    _factor() {
        if (checkGet('^')) return exp(power(), _factor())
        else return null
    }

    power() {
        if (checkGet('(')) {
            let res = expr()
            if (!checkGet(')')) error()
            return res
        } else if (checkGet('-')) {
            return unMinus(power())
        } else if ('А' <= get() && get() <= 'Я') {
            let nameFun = parseNameFunc()
            // вот тут (если будут) должны появится ленивые вычисления - например, вместо парсинга, подсовывать подстроку, но пока пусть будет без этого
            if (!allFunc.has(nameFun)) error()
            if (!checkGet('(')) error()
            let args = parseArgs()
            return runFunc(allFunc.get(nameFun), args)
        } else value()
    }

    parseArgs() {
        let arr = []
        if (checkGet(')')) return arr
        arr.push(expr())
        return _parseArgs(arr)
    }
    _parseArgs(arr) {
        if (checkGet(';')) {
            arr.push(expr())
            return _parseArgs(arr)
        } else if (checkGet(')')) return arr
        else error()
    }

    value() {
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
        } else error()
    }

    parseFromTo(from, to, func) {
        if (!(from <= get() && get() <= to)) error()
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
        if (!checkGet('\"')) error()
        res = ""
        while (!checkGet('\"')) {
            res += get()
            next()
        }
        return res
    }

    run() {
        let ans = block()
        if (pos < inputString.length) error()
        return ans
    }
}
