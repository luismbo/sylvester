var fs = require('fs');
var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;
var map = pro.MAP;

try {
    var data = fs.readFileSync(process.argv[2], 'utf-8');
} catch (err) {
    console.error('Could not open file: %s', err);
    process.exit(1);
}

var ast = jsp.parse(data);

// Returns an AST for the expression:
//   SchemeNumber.fn["<op>"](<left>, <right>)
function genericOp(op, left, right) {
    return [ "call",
             [ "name", "GenericMath" ],
             [ [ "string", op ], left, right ] ];
}

function generalizeArithmetic(ast) {
    var walker = pro.ast_walker(), walk = walker.walk;
    return walker.with_walkers({
        "binary": function(op, left, right) {
            switch (op) {
            case "+": case "-": case "*": case "/":
            case "==": case "===": case "!=": case "!==":
            case ">": case "<": case ">=": case "<=":
                return genericOp(op, walk(left), walk(right));
            default:
                return [ this[0], op, walk(left), walk(right) ];
            }
        }
    }, function() { return walk(ast); });
}

var finalCode = pro.gen_code(generalizeArithmetic(ast), {beautify: true});

//console.log("BEFORE ===========================");
//console.log(pro.gen_code(ast, {beautify: true}));
//console.log("AFTER ============================");
console.log(finalCode);
