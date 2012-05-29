var GenericMath = (function(){
    var sn = SchemeNumber, fn = SchemeNumber.fn;

    function isString(s) {
        return typeof s === "string" || s instanceof String;
    }

    function isNumber(n) {
        return typeof n === "number" || n instanceof Number;
    }

    function ensureSN(x) {
        try {
            var sx = sn(x);
            if (sx === x || fn["nan?"](sx) || fn["infinite?"](sx))
                return sx;
        } catch (error) {}

        return sn(Number(x).toString());
    }

    function maybeNaturalize(sx) {
        // this returns NaN for complex numbers and Infinity for
        // sufficiently large Bignums, so let's not consider those as
        // lossless conversions to native floats.
        var x = sx.valueOf();
        return fn["eqv?"](sx, ensureSN(x)) ? x : sx;
    }

    return function(op, x, y) {
        if (!isNumber(x) || !isNumber(y)) {
            switch (op) {
            case "==": return x == y;
            case "===": return x === y;
            case "<": return x < y;
            case ">": return x > y;
            case ">=": return x >= y;
            case "<=": return x <= y;
            case "+": return x + y;
            case "-": return x - y;
            case "/": return x / y;
            case "*": return x * y;
            default: throw "missing op: " + op;
            }
        }

        switch (op) {
        case "==": // is this right?
        case "===": op = "eqv?"; break;
        case "%": op = "mod"; break;
        }

        var res = fn[op](ensureSN(x), ensureSN(y));
        return (res instanceof Number) ? maybeNaturalize(res) : res;
    }
})();
