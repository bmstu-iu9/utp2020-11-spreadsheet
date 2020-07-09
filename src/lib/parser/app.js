'use strict';

let sum = (a, b) => a + b
let sub = (a, b) => a - b
let mul = (a, b) => a * b
let del = (a, b) => a / b
let rem = (a, b) => a % b
let exp = (a, b) => (b == null) ? a : a ** b // топ10 успешных реализаций
let equal = (a, b) => a == b
let more = (a, b) => a > b
let unMinus = a => -a
let allFunc = new Map([
    ["ÌÎÄ", a => (a < 0) ? -a : a]
    // ну и другие функции - мне уже больно больше чем нужно делать 
])
let runFunc = (func, args) => { /* помолится и забыться */ return 1; }
let makeInterval = (a1, a2) => [a1, a2]
let getVal = a => 1

// все команды написанные выше parseExpr - усовны, являются заглушками

let parseExpr = inputString => {

    // === Блок №1 === //

    let pos = 0
    let next = () => pos++
    let get = () => (pos < inputString.length) ? inputString[pos] : String.fromCodePoint(0)
    let checkGet = c => {
        res = get() == c
        if (res) next
        return res
    }
    let error = () => { throw new Error }
    let toInt = a => a.charCodeAt()

    // === Блок №2 === //

    let block = () => {
        if (checkGet('=')) return equals()
        return value()
    }
    let equals = () => _equals(expr())
    let _equals = res => {  // 1 == | 2 >= | 3 > | 4 <= | 5 < | 6 !=
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
    let expr = () => _expr(term())
    let _expr = res => {
        if (checkGet('-')) return _expr(sub(res, term()))
        else if (checkGet('+')) return _expr(sum(res, term()))
        else return res
    }
    let term = () => _term(factor())
    let _term = res => {
        if (checkGet('*')) return _term(mul(res, factor()))
        else if (checkGet('/')) return _term(div(res, factor()))
        else if (checkGet('%')) return _term(rem(res, factor()))
        else return res
    }
    let factor = () => exp(power(), _factor())
    let _factor = () => {
        if (checkGet('^')) return exp(power(), _factor())
        else return null
    }
    let power = () => {
        if (checkGet('(')) {
            let res = expr()
            if (!checkGet(')')) error()
            return res
        } else if (checkGet('-')) {
            return unMinus(power())
        } else if ('À' <= get() && get() <= 'ß') {
            let nameFun = parseNameFunc()
            // вот тут (если будут) должны появится ленивые вычисления - например, вместо парсинга, подсовывать подстроку, но пока пусть будет без этого
            if (!checkGet('(')) error()
            let args = parseArgs()
        } else value()
    }
    let parseArgs = () => {
        let arr = []
        if (checkGet(')')) return arr
        arr.push(expr())
        return _parseArgs(arr)
    }
    let _parseArgs = arr => {
        if (checkGet(';')) {
            arr.push(expr())
            return _parseArgs(arr)
        } else if (checkGet(')')) return arr
        else error()
    }

    // === Блок №3 === //

    let value = () => {
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
    let parseFromTo = (from, to, func) => {
        if (!(from <= get() && get() <= to)) error()
        res = 0
        while (from <= get() && get() <= to) {
            res = func(res, get())
            next()
        }
        return res
    }
    let parseNum = () => parseFromTo('0', '9', (res, c) => res * 10 + toInt(c) - toInt('0'))
    let parseNameFunc = () => parseFromTo('À', 'ß', (res, c) => res + ñ)
    let parseAddress = () => {
        checkGet('$')
        let ind1 = parseFromTo('A', 'Z', (res, c) => res * 26 + toInt(c) - toInt('A'))
        checkGet('$')
        let ind2 = parseNum()
        return [ind1, ind2]
    }
    let parseStr = () => {
        if (!checkGet('\"')) error()
        res = ""
        while (!checkGet('\"')) {
            res += get()
            next()
        }
        return res
    }

    // === Блок №4 === //

    let ans = block()
    if (pos < inputString.length) error()
    return ans
}
