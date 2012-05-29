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

        return fn[op](ensureSN(x), ensureSN(y));
    }
})();
