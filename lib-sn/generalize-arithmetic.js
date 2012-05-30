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
//   GenericMath("<op>", <left>, <right>)
function genericOp(op, left, right) {
    return [ "call",
             [ "name", "GenericMath" ],
             [ [ "string", op ], left, right ] ];
}

// Returns an AST for the expression:
//   GenericMath("<op>", 0, <expr>)
//
// This of course only makes sense for - or +.
function genericUnaryOp(op, expr) {
    return [ "call",
             [ "name", "GenericMath" ],
             [ [ "string", op ], [ "num", 0 ], expr ] ];
}

// Returns an AST for the expression:
//   (<expr> = GenericMath("<op*>", <expr>, 1), <expr>)
function genericUnaryPrefixModifOp(op, expr) {
    return [ "seq",
             [ "assign", true,
               expr,
               [ "call",
                 [ "name", "GenericMath" ],
                 [ [ "string", op.charAt(0) ], expr, [ "num", 1 ] ] ] ],
             expr ];
}

// Returns an AST for the expression:
//   (function () {
//     var __generic_math_tmp = <expr>;
//     <expr> = GenericMath("<op*>", __generic_math_tmp, 1);
//     return __generic_math_tmp;
//   })();
function genericUnaryPostfixOp(op, expr) {
    return [ "call",
             [ "function", null, [],
               [ [ "var", [ [ "__generic_math_tmp", expr ] ] ],
                 [ "stat",
                   [ "assign", true,
                     expr,
                     [ "call",
                       [ "name", "GenericMath" ],
                       [ [ "string", op.charAt(0) ],
                         [ "name", "__generic_math_tmp" ],
                         [ "num", 1 ] ] ] ] ],
                 [ "return",
                   [ "name", "__generic_math_tmp" ] ] ] ] ];
}

// Returns an AST for the expression:
//   <lvalue> = GenericMath("<op>", <lvalue>, <rvalue>)
function genericAssignment(op, lvalue, rvalue) {
    return [ "assign", true,
             lvalue,
             genericOp(op, lvalue, rvalue) ]
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
        },
        "unary-prefix": function(op, expr) {
            switch (op) {
            case "-": case "+":
                return genericUnaryOp(op, walk(expr));
            case "++": case "--":
                return genericUnaryPrefixOp(op, walk(expr));
            default:
                return [ this[0], op, walk(expr) ];
            }
        },
        "unary-postfix": function(op, expr) {
            switch (op) {
            case "++": case "--":
                return genericUnaryPostfixOp(op, walk(expr));
            default:
                return [ this[0], op, walk(expr) ];
            }
        },
        "assign": function(op, lvalue, rvalue) {
            switch (op) {
            case "+": case "-": case "*": case "/": case "%":
                return genericAssignment(op, walk(lvalue), walk(rvalue));
            default:
                return [ this[0], op, walk(lvalue), walk(rvalue) ];
            }
        }
    }, function() { return walk(ast); });
}

var finalCode = pro.gen_code(generalizeArithmetic(ast), {beautify: true});

//console.log("BEFORE ===========================");
//console.log(pro.gen_code(ast, {beautify: true}));
//console.log("AFTER ============================");
console.log(finalCode);
