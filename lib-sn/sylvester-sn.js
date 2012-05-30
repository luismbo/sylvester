var Sylvester = {
    precision: 1e-6
};

Sylvester.Vector = function() {};

Sylvester.Vector.create = function(elements) {
    var V = new Sylvester.Vector;
    return V.setElements(elements);
};

var $V = Sylvester.Vector.create;

Sylvester.Vector.Random = function(n) {
    var elements = [];
    while (function() {
        var __generic_math_tmp = n;
        n = GenericMath("-", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        elements.push(Math.random());
    }
    return Sylvester.Vector.create(elements);
};

Sylvester.Vector.Zero = function(n) {
    var elements = [];
    while (function() {
        var __generic_math_tmp = n;
        n = GenericMath("-", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        elements.push(0);
    }
    return Sylvester.Vector.create(elements);
};

Sylvester.Vector.prototype = {
    e: function(i) {
        return GenericMath("<", i, 1) || GenericMath(">", i, this.elements.length) ? null : this.elements[GenericMath("-", i, 1)];
    },
    dimensions: function() {
        return this.elements.length;
    },
    modulus: function() {
        return Math.sqrt(this.dot(this));
    },
    eql: function(vector) {
        var n = this.elements.length;
        var V = vector.elements || vector;
        if (GenericMath("!==", n, V.length)) {
            return false;
        }
        while (function() {
            var __generic_math_tmp = n;
            n = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            if (GenericMath(">", Math.abs(GenericMath("-", this.elements[n], V[n])), Sylvester.precision)) {
                return false;
            }
        }
        return true;
    },
    dup: function() {
        return Sylvester.Vector.create(this.elements);
    },
    map: function(fn, context) {
        var elements = [];
        this.each(function(x, i) {
            elements.push(fn.call(context, x, i));
        });
        return Sylvester.Vector.create(elements);
    },
    forEach: function(fn, context) {
        var n = this.elements.length;
        for (var i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            fn.call(context, this.elements[i], GenericMath("+", i, 1));
        }
    },
    toUnitVector: function() {
        var r = this.modulus();
        if (GenericMath("===", r, 0)) {
            return this.dup();
        }
        return this.map(function(x) {
            return GenericMath("/", x, r);
        });
    },
    angleFrom: function(vector) {
        var V = vector.elements || vector;
        var n = this.elements.length, k = n, i;
        if (GenericMath("!==", n, V.length)) {
            return null;
        }
        var dot = 0, mod1 = 0, mod2 = 0;
        this.each(function(x, i) {
            dot = GenericMath("+", dot, GenericMath("*", x, V[GenericMath("-", i, 1)]));
            mod1 = GenericMath("+", mod1, GenericMath("*", x, x));
            mod2 = GenericMath("+", mod2, GenericMath("*", V[GenericMath("-", i, 1)], V[GenericMath("-", i, 1)]));
        });
        mod1 = Math.sqrt(mod1);
        mod2 = Math.sqrt(mod2);
        if (GenericMath("===", GenericMath("*", mod1, mod2), 0)) {
            return null;
        }
        var theta = GenericMath("/", dot, GenericMath("*", mod1, mod2));
        if (GenericMath("<", theta, GenericMath("-", 0, 1))) {
            theta = GenericMath("-", 0, 1);
        }
        if (GenericMath(">", theta, 1)) {
            theta = 1;
        }
        return Math.acos(theta);
    },
    isParallelTo: function(vector) {
        var angle = this.angleFrom(vector);
        return GenericMath("===", angle, null) ? null : GenericMath("<=", angle, Sylvester.precision);
    },
    isAntiparallelTo: function(vector) {
        var angle = this.angleFrom(vector);
        return GenericMath("===", angle, null) ? null : GenericMath("<=", Math.abs(GenericMath("-", angle, Math.PI)), Sylvester.precision);
    },
    isPerpendicularTo: function(vector) {
        var dot = this.dot(vector);
        return GenericMath("===", dot, null) ? null : GenericMath("<=", Math.abs(dot), Sylvester.precision);
    },
    add: function(vector) {
        var V = vector.elements || vector;
        if (GenericMath("!==", this.elements.length, V.length)) {
            return null;
        }
        return this.map(function(x, i) {
            return GenericMath("+", x, V[GenericMath("-", i, 1)]);
        });
    },
    subtract: function(vector) {
        var V = vector.elements || vector;
        if (GenericMath("!==", this.elements.length, V.length)) {
            return null;
        }
        return this.map(function(x, i) {
            return GenericMath("-", x, V[GenericMath("-", i, 1)]);
        });
    },
    multiply: function(k) {
        return this.map(function(x) {
            return GenericMath("*", x, k);
        });
    },
    dot: function(vector) {
        var V = vector.elements || vector;
        var i, product = 0, n = this.elements.length;
        if (GenericMath("!==", n, V.length)) {
            return null;
        }
        while (function() {
            var __generic_math_tmp = n;
            n = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            product = GenericMath("+", product, GenericMath("*", this.elements[n], V[n]));
        }
        return product;
    },
    cross: function(vector) {
        var B = vector.elements || vector;
        if (GenericMath("!==", this.elements.length, 3) || GenericMath("!==", B.length, 3)) {
            return null;
        }
        var A = this.elements;
        return Sylvester.Vector.create([ GenericMath("-", GenericMath("*", A[1], B[2]), GenericMath("*", A[2], B[1])), GenericMath("-", GenericMath("*", A[2], B[0]), GenericMath("*", A[0], B[2])), GenericMath("-", GenericMath("*", A[0], B[1]), GenericMath("*", A[1], B[0])) ]);
    },
    max: function() {
        var m = 0, i = this.elements.length;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            if (GenericMath(">", Math.abs(this.elements[i]), Math.abs(m))) {
                m = this.elements[i];
            }
        }
        return m;
    },
    indexOf: function(x) {
        var index = null, n = this.elements.length;
        for (var i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            if (GenericMath("===", index, null) && GenericMath("===", this.elements[i], x)) {
                index = GenericMath("+", i, 1);
            }
        }
        return index;
    },
    toDiagonalMatrix: function() {
        return Sylvester.Matrix.Diagonal(this.elements);
    },
    round: function() {
        return this.map(function(x) {
            return Math.round(x);
        });
    },
    snapTo: function(x) {
        return this.map(function(y) {
            return GenericMath("<=", Math.abs(GenericMath("-", y, x)), Sylvester.precision) ? x : y;
        });
    },
    distanceFrom: function(obj) {
        if (obj.anchor || obj.start && obj.end) {
            return obj.distanceFrom(this);
        }
        var V = obj.elements || obj;
        if (GenericMath("!==", V.length, this.elements.length)) {
            return null;
        }
        var sum = 0, part;
        this.each(function(x, i) {
            part = GenericMath("-", x, V[GenericMath("-", i, 1)]);
            sum = GenericMath("+", sum, GenericMath("*", part, part));
        });
        return Math.sqrt(sum);
    },
    liesOn: function(line) {
        return line.contains(this);
    },
    liesIn: function(plane) {
        return plane.contains(this);
    },
    rotate: function(t, obj) {
        var V, R = null, x, y, z;
        if (t.determinant) {
            R = t.elements;
        }
        switch (this.elements.length) {
          case 2:
            V = obj.elements || obj;
            if (GenericMath("!==", V.length, 2)) {
                return null;
            }
            if (!R) {
                R = Sylvester.Matrix.Rotation(t).elements;
            }
            x = GenericMath("-", this.elements[0], V[0]);
            y = GenericMath("-", this.elements[1], V[1]);
            return Sylvester.Vector.create([ GenericMath("+", GenericMath("+", V[0], GenericMath("*", R[0][0], x)), GenericMath("*", R[0][1], y)), GenericMath("+", GenericMath("+", V[1], GenericMath("*", R[1][0], x)), GenericMath("*", R[1][1], y)) ]);
            break;
          case 3:
            if (!obj.direction) {
                return null;
            }
            var C = obj.pointClosestTo(this).elements;
            if (!R) {
                R = Sylvester.Matrix.Rotation(t, obj.direction).elements;
            }
            x = GenericMath("-", this.elements[0], C[0]);
            y = GenericMath("-", this.elements[1], C[1]);
            z = GenericMath("-", this.elements[2], C[2]);
            return Sylvester.Vector.create([ GenericMath("+", GenericMath("+", GenericMath("+", C[0], GenericMath("*", R[0][0], x)), GenericMath("*", R[0][1], y)), GenericMath("*", R[0][2], z)), GenericMath("+", GenericMath("+", GenericMath("+", C[1], GenericMath("*", R[1][0], x)), GenericMath("*", R[1][1], y)), GenericMath("*", R[1][2], z)), GenericMath("+", GenericMath("+", GenericMath("+", C[2], GenericMath("*", R[2][0], x)), GenericMath("*", R[2][1], y)), GenericMath("*", R[2][2], z)) ]);
            break;
          default:
            return null;
        }
    },
    reflectionIn: function(obj) {
        if (obj.anchor) {
            var P = this.elements.slice();
            var C = obj.pointClosestTo(P).elements;
            return Sylvester.Vector.create([ GenericMath("+", C[0], GenericMath("-", C[0], P[0])), GenericMath("+", C[1], GenericMath("-", C[1], P[1])), GenericMath("+", C[2], GenericMath("-", C[2], P[2] || 0)) ]);
        } else {
            var Q = obj.elements || obj;
            if (GenericMath("!==", this.elements.length, Q.length)) {
                return null;
            }
            return this.map(function(x, i) {
                return GenericMath("+", Q[GenericMath("-", i, 1)], GenericMath("-", Q[GenericMath("-", i, 1)], x));
            });
        }
    },
    to3D: function() {
        var V = this.dup();
        switch (V.elements.length) {
          case 3:
            break;
          case 2:
            V.elements.push(0);
            break;
          default:
            return null;
        }
        return V;
    },
    inspect: function() {
        return GenericMath("+", GenericMath("+", "[", this.elements.join(", ")), "]");
    },
    setElements: function(els) {
        this.elements = (els.elements || els).slice();
        return this;
    }
};

Sylvester.Vector.prototype.x = Sylvester.Vector.prototype.multiply;

Sylvester.Vector.prototype.each = Sylvester.Vector.prototype.forEach;

Sylvester.Vector.i = Sylvester.Vector.create([ 1, 0, 0 ]);

Sylvester.Vector.j = Sylvester.Vector.create([ 0, 1, 0 ]);

Sylvester.Vector.k = Sylvester.Vector.create([ 0, 0, 1 ]);

Sylvester.Matrix = function() {};

Sylvester.Matrix.create = function(elements) {
    var M = new Sylvester.Matrix;
    return M.setElements(elements);
};

var $M = Sylvester.Matrix.create;

Sylvester.Matrix.I = function(n) {
    var els = [], i = n, j;
    while (function() {
        var __generic_math_tmp = i;
        i = GenericMath("-", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        j = n;
        els[i] = [];
        while (function() {
            var __generic_math_tmp = j;
            j = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            els[i][j] = GenericMath("===", i, j) ? 1 : 0;
        }
    }
    return Sylvester.Matrix.create(els);
};

Sylvester.Matrix.Diagonal = function(elements) {
    var i = elements.length;
    var M = Sylvester.Matrix.I(i);
    while (function() {
        var __generic_math_tmp = i;
        i = GenericMath("-", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        M.elements[i][i] = elements[i];
    }
    return M;
};

Sylvester.Matrix.Rotation = function(theta, a) {
    if (!a) {
        return Sylvester.Matrix.create([ [ Math.cos(theta), GenericMath("-", 0, Math.sin(theta)) ], [ Math.sin(theta), Math.cos(theta) ] ]);
    }
    var axis = a.dup();
    if (GenericMath("!==", axis.elements.length, 3)) {
        return null;
    }
    var mod = axis.modulus();
    var x = GenericMath("/", axis.elements[0], mod), y = GenericMath("/", axis.elements[1], mod), z = GenericMath("/", axis.elements[2], mod);
    var s = Math.sin(theta), c = Math.cos(theta), t = GenericMath("-", 1, c);
    return Sylvester.Matrix.create([ [ GenericMath("+", GenericMath("*", GenericMath("*", t, x), x), c), GenericMath("-", GenericMath("*", GenericMath("*", t, x), y), GenericMath("*", s, z)), GenericMath("+", GenericMath("*", GenericMath("*", t, x), z), GenericMath("*", s, y)) ], [ GenericMath("+", GenericMath("*", GenericMath("*", t, x), y), GenericMath("*", s, z)), GenericMath("+", GenericMath("*", GenericMath("*", t, y), y), c), GenericMath("-", GenericMath("*", GenericMath("*", t, y), z), GenericMath("*", s, x)) ], [ GenericMath("-", GenericMath("*", GenericMath("*", t, x), z), GenericMath("*", s, y)), GenericMath("+", GenericMath("*", GenericMath("*", t, y), z), GenericMath("*", s, x)), GenericMath("+", GenericMath("*", GenericMath("*", t, z), z), c) ] ]);
};

Sylvester.Matrix.RotationX = function(t) {
    var c = Math.cos(t), s = Math.sin(t);
    return Sylvester.Matrix.create([ [ 1, 0, 0 ], [ 0, c, GenericMath("-", 0, s) ], [ 0, s, c ] ]);
};

Sylvester.Matrix.RotationY = function(t) {
    var c = Math.cos(t), s = Math.sin(t);
    return Sylvester.Matrix.create([ [ c, 0, s ], [ 0, 1, 0 ], [ GenericMath("-", 0, s), 0, c ] ]);
};

Sylvester.Matrix.RotationZ = function(t) {
    var c = Math.cos(t), s = Math.sin(t);
    return Sylvester.Matrix.create([ [ c, GenericMath("-", 0, s), 0 ], [ s, c, 0 ], [ 0, 0, 1 ] ]);
};

Sylvester.Matrix.Random = function(n, m) {
    return Sylvester.Matrix.Zero(n, m).map(function() {
        return Math.random();
    });
};

Sylvester.Matrix.Zero = function(n, m) {
    var els = [], i = n, j;
    while (function() {
        var __generic_math_tmp = i;
        i = GenericMath("-", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        j = m;
        els[i] = [];
        while (function() {
            var __generic_math_tmp = j;
            j = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            els[i][j] = 0;
        }
    }
    return Sylvester.Matrix.create(els);
};

Sylvester.Matrix.prototype = {
    e: function(i, j) {
        if (GenericMath("<", i, 1) || GenericMath(">", i, this.elements.length) || GenericMath("<", j, 1) || GenericMath(">", j, this.elements[0].length)) {
            return null;
        }
        return this.elements[GenericMath("-", i, 1)][GenericMath("-", j, 1)];
    },
    row: function(i) {
        if (GenericMath(">", i, this.elements.length)) {
            return null;
        }
        return Sylvester.Vector.create(this.elements[GenericMath("-", i, 1)]);
    },
    col: function(j) {
        if (GenericMath("===", this.elements.length, 0)) {
            return null;
        }
        if (GenericMath(">", j, this.elements[0].length)) {
            return null;
        }
        var col = [], n = this.elements.length;
        for (var i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            col.push(this.elements[i][GenericMath("-", j, 1)]);
        }
        return Sylvester.Vector.create(col);
    },
    dimensions: function() {
        var cols = GenericMath("===", this.elements.length, 0) ? 0 : this.elements[0].length;
        return {
            rows: this.elements.length,
            cols: cols
        };
    },
    rows: function() {
        return this.elements.length;
    },
    cols: function() {
        if (GenericMath("===", this.elements.length, 0)) {
            return 0;
        }
        return this.elements[0].length;
    },
    eql: function(matrix) {
        var M = matrix.elements || matrix;
        if (!M[0] || GenericMath("===", typeof M[0][0], "undefined")) {
            M = Sylvester.Matrix.create(M).elements;
        }
        if (GenericMath("===", this.elements.length, 0) || GenericMath("===", M.length, 0)) {
            return GenericMath("===", this.elements.length, M.length);
        }
        if (GenericMath("!==", this.elements.length, M.length)) {
            return false;
        }
        if (GenericMath("!==", this.elements[0].length, M[0].length)) {
            return false;
        }
        var i = this.elements.length, nj = this.elements[0].length, j;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            j = nj;
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                if (GenericMath(">", Math.abs(GenericMath("-", this.elements[i][j], M[i][j])), Sylvester.precision)) {
                    return false;
                }
            }
        }
        return true;
    },
    dup: function() {
        return Sylvester.Matrix.create(this.elements);
    },
    map: function(fn, context) {
        if (GenericMath("===", this.elements.length, 0)) {
            return Sylvester.Matrix.create([]);
        }
        var els = [], i = this.elements.length, nj = this.elements[0].length, j;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            j = nj;
            els[i] = [];
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                els[i][j] = fn.call(context, this.elements[i][j], GenericMath("+", i, 1), GenericMath("+", j, 1));
            }
        }
        return Sylvester.Matrix.create(els);
    },
    isSameSizeAs: function(matrix) {
        var M = matrix.elements || matrix;
        if (GenericMath("===", typeof M[0][0], "undefined")) {
            M = Sylvester.Matrix.create(M).elements;
        }
        if (GenericMath("===", this.elements.length, 0)) {
            return GenericMath("===", M.length, 0);
        }
        return GenericMath("===", this.elements.length, M.length) && GenericMath("===", this.elements[0].length, M[0].length);
    },
    add: function(matrix) {
        if (GenericMath("===", this.elements.length, 0)) return this.map(function(x) {
            return x;
        });
        var M = matrix.elements || matrix;
        if (GenericMath("===", typeof M[0][0], "undefined")) {
            M = Sylvester.Matrix.create(M).elements;
        }
        if (!this.isSameSizeAs(M)) {
            return null;
        }
        return this.map(function(x, i, j) {
            return GenericMath("+", x, M[GenericMath("-", i, 1)][GenericMath("-", j, 1)]);
        });
    },
    subtract: function(matrix) {
        if (GenericMath("===", this.elements.length, 0)) return this.map(function(x) {
            return x;
        });
        var M = matrix.elements || matrix;
        if (GenericMath("===", typeof M[0][0], "undefined")) {
            M = Sylvester.Matrix.create(M).elements;
        }
        if (!this.isSameSizeAs(M)) {
            return null;
        }
        return this.map(function(x, i, j) {
            return GenericMath("-", x, M[GenericMath("-", i, 1)][GenericMath("-", j, 1)]);
        });
    },
    canMultiplyFromLeft: function(matrix) {
        if (GenericMath("===", this.elements.length, 0)) {
            return false;
        }
        var M = matrix.elements || matrix;
        if (GenericMath("===", typeof M[0][0], "undefined")) {
            M = Sylvester.Matrix.create(M).elements;
        }
        return GenericMath("===", this.elements[0].length, M.length);
    },
    multiply: function(matrix) {
        if (GenericMath("===", this.elements.length, 0)) {
            return null;
        }
        if (!matrix.elements) {
            return this.map(function(x) {
                return GenericMath("*", x, matrix);
            });
        }
        var returnVector = matrix.modulus ? true : false;
        var M = matrix.elements || matrix;
        if (GenericMath("===", typeof M[0][0], "undefined")) {
            M = Sylvester.Matrix.create(M).elements;
        }
        if (!this.canMultiplyFromLeft(M)) {
            return null;
        }
        var i = this.elements.length, nj = M[0].length, j;
        var cols = this.elements[0].length, c, elements = [], sum;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            j = nj;
            elements[i] = [];
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                c = cols;
                sum = 0;
                while (function() {
                    var __generic_math_tmp = c;
                    c = GenericMath("-", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                }()) {
                    sum = GenericMath("+", sum, GenericMath("*", this.elements[i][c], M[c][j]));
                }
                elements[i][j] = sum;
            }
        }
        var M = Sylvester.Matrix.create(elements);
        return returnVector ? M.col(1) : M;
    },
    minor: function(a, b, c, d) {
        if (GenericMath("===", this.elements.length, 0)) {
            return null;
        }
        var elements = [], ni = c, i, nj, j;
        var rows = this.elements.length, cols = this.elements[0].length;
        while (function() {
            var __generic_math_tmp = ni;
            ni = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            i = GenericMath("-", GenericMath("-", c, ni), 1);
            elements[i] = [];
            nj = d;
            while (function() {
                var __generic_math_tmp = nj;
                nj = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                j = GenericMath("-", GenericMath("-", d, nj), 1);
                elements[i][j] = this.elements[GenericMath("-", GenericMath("+", a, i), 1) % rows][GenericMath("-", GenericMath("+", b, j), 1) % cols];
            }
        }
        return Sylvester.Matrix.create(elements);
    },
    transpose: function() {
        if (GenericMath("===", this.elements.length, 0)) return Sylvester.Matrix.create([]);
        var rows = this.elements.length, i, cols = this.elements[0].length, j;
        var elements = [], i = cols;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            j = rows;
            elements[i] = [];
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                elements[i][j] = this.elements[j][i];
            }
        }
        return Sylvester.Matrix.create(elements);
    },
    isSquare: function() {
        var cols = GenericMath("===", this.elements.length, 0) ? 0 : this.elements[0].length;
        return GenericMath("===", this.elements.length, cols);
    },
    max: function() {
        if (GenericMath("===", this.elements.length, 0)) {
            return null;
        }
        var m = 0, i = this.elements.length, nj = this.elements[0].length, j;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            j = nj;
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                if (GenericMath(">", Math.abs(this.elements[i][j]), Math.abs(m))) {
                    m = this.elements[i][j];
                }
            }
        }
        return m;
    },
    indexOf: function(x) {
        if (GenericMath("===", this.elements.length, 0)) {
            return null;
        }
        var index = null, ni = this.elements.length, i, nj = this.elements[0].length, j;
        for (i = 0; GenericMath("<", i, ni); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            for (j = 0; GenericMath("<", j, nj); function() {
                var __generic_math_tmp = j;
                j = GenericMath("+", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                if (GenericMath("===", this.elements[i][j], x)) {
                    return {
                        i: GenericMath("+", i, 1),
                        j: GenericMath("+", j, 1)
                    };
                }
            }
        }
        return null;
    },
    diagonal: function() {
        if (!this.isSquare) {
            return null;
        }
        var els = [], n = this.elements.length;
        for (var i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            els.push(this.elements[i][i]);
        }
        return Sylvester.Vector.create(els);
    },
    toRightTriangular: function() {
        if (GenericMath("===", this.elements.length, 0)) return Sylvester.Matrix.create([]);
        var M = this.dup(), els;
        var n = this.elements.length, i, j, np = this.elements[0].length, p;
        for (i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            if (GenericMath("===", M.elements[i][i], 0)) {
                for (j = GenericMath("+", i, 1); GenericMath("<", j, n); function() {
                    var __generic_math_tmp = j;
                    j = GenericMath("+", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                }()) {
                    if (GenericMath("!==", M.elements[j][i], 0)) {
                        els = [];
                        for (p = 0; GenericMath("<", p, np); function() {
                            var __generic_math_tmp = p;
                            p = GenericMath("+", __generic_math_tmp, 1);
                            return __generic_math_tmp;
                        }()) {
                            els.push(GenericMath("+", M.elements[i][p], M.elements[j][p]));
                        }
                        M.elements[i] = els;
                        break;
                    }
                }
            }
            if (GenericMath("!==", M.elements[i][i], 0)) {
                for (j = GenericMath("+", i, 1); GenericMath("<", j, n); function() {
                    var __generic_math_tmp = j;
                    j = GenericMath("+", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                }()) {
                    var multiplier = GenericMath("/", M.elements[j][i], M.elements[i][i]);
                    els = [];
                    for (p = 0; GenericMath("<", p, np); function() {
                        var __generic_math_tmp = p;
                        p = GenericMath("+", __generic_math_tmp, 1);
                        return __generic_math_tmp;
                    }()) {
                        els.push(GenericMath("<=", p, i) ? 0 : GenericMath("-", M.elements[j][p], GenericMath("*", M.elements[i][p], multiplier)));
                    }
                    M.elements[j] = els;
                }
            }
        }
        return M;
    },
    determinant: function() {
        if (GenericMath("===", this.elements.length, 0)) {
            return 1;
        }
        if (!this.isSquare()) {
            return null;
        }
        var M = this.toRightTriangular();
        var det = M.elements[0][0], n = M.elements.length;
        for (var i = 1; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            det = GenericMath("*", det, M.elements[i][i]);
        }
        return det;
    },
    isSingular: function() {
        return this.isSquare() && GenericMath("===", this.determinant(), 0);
    },
    trace: function() {
        if (GenericMath("===", this.elements.length, 0)) {
            return 0;
        }
        if (!this.isSquare()) {
            return null;
        }
        var tr = this.elements[0][0], n = this.elements.length;
        for (var i = 1; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            tr = GenericMath("+", tr, this.elements[i][i]);
        }
        return tr;
    },
    rank: function() {
        if (GenericMath("===", this.elements.length, 0)) {
            return 0;
        }
        var M = this.toRightTriangular(), rank = 0;
        var i = this.elements.length, nj = this.elements[0].length, j;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            j = nj;
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                if (GenericMath(">", Math.abs(M.elements[i][j]), Sylvester.precision)) {
                    (function() {
                        var __generic_math_tmp = rank;
                        rank = GenericMath("+", __generic_math_tmp, 1);
                        return __generic_math_tmp;
                    })();
                    break;
                }
            }
        }
        return rank;
    },
    augment: function(matrix) {
        if (GenericMath("===", this.elements.length, 0)) {
            return this.dup();
        }
        var M = matrix.elements || matrix;
        if (GenericMath("===", typeof M[0][0], "undefined")) {
            M = Sylvester.Matrix.create(M).elements;
        }
        var T = this.dup(), cols = T.elements[0].length;
        var i = T.elements.length, nj = M[0].length, j;
        if (GenericMath("!==", i, M.length)) {
            return null;
        }
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            j = nj;
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                T.elements[i][GenericMath("+", cols, j)] = M[i][j];
            }
        }
        return T;
    },
    inverse: function() {
        if (GenericMath("===", this.elements.length, 0)) {
            return null;
        }
        if (!this.isSquare() || this.isSingular()) {
            return null;
        }
        var n = this.elements.length, i = n, j;
        var M = this.augment(Sylvester.Matrix.I(n)).toRightTriangular();
        var np = M.elements[0].length, p, els, divisor;
        var inverse_elements = [], new_element;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            els = [];
            inverse_elements[i] = [];
            divisor = M.elements[i][i];
            for (p = 0; GenericMath("<", p, np); function() {
                var __generic_math_tmp = p;
                p = GenericMath("+", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                new_element = GenericMath("/", M.elements[i][p], divisor);
                els.push(new_element);
                if (GenericMath(">=", p, n)) {
                    inverse_elements[i].push(new_element);
                }
            }
            M.elements[i] = els;
            j = i;
            while (function() {
                var __generic_math_tmp = j;
                j = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                els = [];
                for (p = 0; GenericMath("<", p, np); function() {
                    var __generic_math_tmp = p;
                    p = GenericMath("+", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                }()) {
                    els.push(GenericMath("-", M.elements[j][p], GenericMath("*", M.elements[i][p], M.elements[j][i])));
                }
                M.elements[j] = els;
            }
        }
        return Sylvester.Matrix.create(inverse_elements);
    },
    round: function() {
        return this.map(function(x) {
            return Math.round(x);
        });
    },
    snapTo: function(x) {
        return this.map(function(p) {
            return GenericMath("<=", Math.abs(GenericMath("-", p, x)), Sylvester.precision) ? x : p;
        });
    },
    inspect: function() {
        var matrix_rows = [];
        var n = this.elements.length;
        if (GenericMath("===", n, 0)) return "[]";
        for (var i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            matrix_rows.push(Sylvester.Vector.create(this.elements[i]).inspect());
        }
        return matrix_rows.join("\n");
    },
    setElements: function(els) {
        var i, j, elements = els.elements || els;
        if (elements[0] && GenericMath("!==", typeof elements[0][0], "undefined")) {
            i = elements.length;
            this.elements = [];
            while (function() {
                var __generic_math_tmp = i;
                i = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                j = elements[i].length;
                this.elements[i] = [];
                while (function() {
                    var __generic_math_tmp = j;
                    j = GenericMath("-", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                }()) {
                    this.elements[i][j] = elements[i][j];
                }
            }
            return this;
        }
        var n = elements.length;
        this.elements = [];
        for (i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            this.elements.push([ elements[i] ]);
        }
        return this;
    }
};

Sylvester.Matrix.prototype.toUpperTriangular = Sylvester.Matrix.prototype.toRightTriangular;

Sylvester.Matrix.prototype.det = Sylvester.Matrix.prototype.determinant;

Sylvester.Matrix.prototype.tr = Sylvester.Matrix.prototype.trace;

Sylvester.Matrix.prototype.rk = Sylvester.Matrix.prototype.rank;

Sylvester.Matrix.prototype.inv = Sylvester.Matrix.prototype.inverse;

Sylvester.Matrix.prototype.x = Sylvester.Matrix.prototype.multiply;

Sylvester.Line = function() {};

Sylvester.Line.prototype = {
    eql: function(line) {
        return this.isParallelTo(line) && this.contains(line.anchor);
    },
    dup: function() {
        return Sylvester.Line.create(this.anchor, this.direction);
    },
    translate: function(vector) {
        var V = vector.elements || vector;
        return Sylvester.Line.create([ GenericMath("+", this.anchor.elements[0], V[0]), GenericMath("+", this.anchor.elements[1], V[1]), GenericMath("+", this.anchor.elements[2], V[2] || 0) ], this.direction);
    },
    isParallelTo: function(obj) {
        if (obj.normal || obj.start && obj.end) {
            return obj.isParallelTo(this);
        }
        var theta = this.direction.angleFrom(obj.direction);
        return GenericMath("<=", Math.abs(theta), Sylvester.precision) || GenericMath("<=", Math.abs(GenericMath("-", theta, Math.PI)), Sylvester.precision);
    },
    distanceFrom: function(obj) {
        if (obj.normal || obj.start && obj.end) {
            return obj.distanceFrom(this);
        }
        if (obj.direction) {
            if (this.isParallelTo(obj)) {
                return this.distanceFrom(obj.anchor);
            }
            var N = this.direction.cross(obj.direction).toUnitVector().elements;
            var A = this.anchor.elements, B = obj.anchor.elements;
            return Math.abs(GenericMath("+", GenericMath("+", GenericMath("*", GenericMath("-", A[0], B[0]), N[0]), GenericMath("*", GenericMath("-", A[1], B[1]), N[1])), GenericMath("*", GenericMath("-", A[2], B[2]), N[2])));
        } else {
            var P = obj.elements || obj;
            var A = this.anchor.elements, D = this.direction.elements;
            var PA1 = GenericMath("-", P[0], A[0]), PA2 = GenericMath("-", P[1], A[1]), PA3 = GenericMath("-", P[2] || 0, A[2]);
            var modPA = Math.sqrt(GenericMath("+", GenericMath("+", GenericMath("*", PA1, PA1), GenericMath("*", PA2, PA2)), GenericMath("*", PA3, PA3)));
            if (GenericMath("===", modPA, 0)) return 0;
            var cosTheta = GenericMath("/", GenericMath("+", GenericMath("+", GenericMath("*", PA1, D[0]), GenericMath("*", PA2, D[1])), GenericMath("*", PA3, D[2])), modPA);
            var sin2 = GenericMath("-", 1, GenericMath("*", cosTheta, cosTheta));
            return Math.abs(GenericMath("*", modPA, Math.sqrt(GenericMath("<", sin2, 0) ? 0 : sin2)));
        }
    },
    contains: function(obj) {
        if (obj.start && obj.end) {
            return this.contains(obj.start) && this.contains(obj.end);
        }
        var dist = this.distanceFrom(obj);
        return GenericMath("!==", dist, null) && GenericMath("<=", dist, Sylvester.precision);
    },
    positionOf: function(point) {
        if (!this.contains(point)) {
            return null;
        }
        var P = point.elements || point;
        var A = this.anchor.elements, D = this.direction.elements;
        return GenericMath("+", GenericMath("+", GenericMath("*", GenericMath("-", P[0], A[0]), D[0]), GenericMath("*", GenericMath("-", P[1], A[1]), D[1])), GenericMath("*", GenericMath("-", P[2] || 0, A[2]), D[2]));
    },
    liesIn: function(plane) {
        return plane.contains(this);
    },
    intersects: function(obj) {
        if (obj.normal) {
            return obj.intersects(this);
        }
        return !this.isParallelTo(obj) && GenericMath("<=", this.distanceFrom(obj), Sylvester.precision);
    },
    intersectionWith: function(obj) {
        if (obj.normal || obj.start && obj.end) {
            return obj.intersectionWith(this);
        }
        if (!this.intersects(obj)) {
            return null;
        }
        var P = this.anchor.elements, X = this.direction.elements, Q = obj.anchor.elements, Y = obj.direction.elements;
        var X1 = X[0], X2 = X[1], X3 = X[2], Y1 = Y[0], Y2 = Y[1], Y3 = Y[2];
        var PsubQ1 = GenericMath("-", P[0], Q[0]), PsubQ2 = GenericMath("-", P[1], Q[1]), PsubQ3 = GenericMath("-", P[2], Q[2]);
        var XdotQsubP = GenericMath("-", GenericMath("-", GenericMath("*", GenericMath("-", 0, X1), PsubQ1), GenericMath("*", X2, PsubQ2)), GenericMath("*", X3, PsubQ3));
        var YdotPsubQ = GenericMath("+", GenericMath("+", GenericMath("*", Y1, PsubQ1), GenericMath("*", Y2, PsubQ2)), GenericMath("*", Y3, PsubQ3));
        var XdotX = GenericMath("+", GenericMath("+", GenericMath("*", X1, X1), GenericMath("*", X2, X2)), GenericMath("*", X3, X3));
        var YdotY = GenericMath("+", GenericMath("+", GenericMath("*", Y1, Y1), GenericMath("*", Y2, Y2)), GenericMath("*", Y3, Y3));
        var XdotY = GenericMath("+", GenericMath("+", GenericMath("*", X1, Y1), GenericMath("*", X2, Y2)), GenericMath("*", X3, Y3));
        var k = GenericMath("/", GenericMath("+", GenericMath("/", GenericMath("*", XdotQsubP, YdotY), XdotX), GenericMath("*", XdotY, YdotPsubQ)), GenericMath("-", YdotY, GenericMath("*", XdotY, XdotY)));
        return Sylvester.Vector.create([ GenericMath("+", P[0], GenericMath("*", k, X1)), GenericMath("+", P[1], GenericMath("*", k, X2)), GenericMath("+", P[2], GenericMath("*", k, X3)) ]);
    },
    pointClosestTo: function(obj) {
        if (obj.start && obj.end) {
            var P = obj.pointClosestTo(this);
            return GenericMath("===", P, null) ? null : this.pointClosestTo(P);
        } else if (obj.direction) {
            if (this.intersects(obj)) {
                return this.intersectionWith(obj);
            }
            if (this.isParallelTo(obj)) {
                return null;
            }
            var D = this.direction.elements, E = obj.direction.elements;
            var D1 = D[0], D2 = D[1], D3 = D[2], E1 = E[0], E2 = E[1], E3 = E[2];
            var x = GenericMath("-", GenericMath("*", D3, E1), GenericMath("*", D1, E3)), y = GenericMath("-", GenericMath("*", D1, E2), GenericMath("*", D2, E1)), z = GenericMath("-", GenericMath("*", D2, E3), GenericMath("*", D3, E2));
            var N = [ GenericMath("-", GenericMath("*", x, E3), GenericMath("*", y, E2)), GenericMath("-", GenericMath("*", y, E1), GenericMath("*", z, E3)), GenericMath("-", GenericMath("*", z, E2), GenericMath("*", x, E1)) ];
            var P = Sylvester.Plane.create(obj.anchor, N);
            return P.intersectionWith(this);
        } else {
            var P = obj.elements || obj;
            if (this.contains(P)) {
                return Sylvester.Vector.create(P);
            }
            var A = this.anchor.elements, D = this.direction.elements;
            var D1 = D[0], D2 = D[1], D3 = D[2], A1 = A[0], A2 = A[1], A3 = A[2];
            var x = GenericMath("-", GenericMath("*", D1, GenericMath("-", P[1], A2)), GenericMath("*", D2, GenericMath("-", P[0], A1))), y = GenericMath("-", GenericMath("*", D2, GenericMath("-", P[2] || 0, A3)), GenericMath("*", D3, GenericMath("-", P[1], A2))), z = GenericMath("-", GenericMath("*", D3, GenericMath("-", P[0], A1)), GenericMath("*", D1, GenericMath("-", P[2] || 0, A3)));
            var V = Sylvester.Vector.create([ GenericMath("-", GenericMath("*", D2, x), GenericMath("*", D3, z)), GenericMath("-", GenericMath("*", D3, y), GenericMath("*", D1, x)), GenericMath("-", GenericMath("*", D1, z), GenericMath("*", D2, y)) ]);
            var k = GenericMath("/", this.distanceFrom(P), V.modulus());
            return Sylvester.Vector.create([ GenericMath("+", P[0], GenericMath("*", V.elements[0], k)), GenericMath("+", P[1], GenericMath("*", V.elements[1], k)), GenericMath("+", P[2] || 0, GenericMath("*", V.elements[2], k)) ]);
        }
    },
    rotate: function(t, line) {
        if (GenericMath("===", typeof line.direction, "undefined")) {
            line = Sylvester.Line.create(line.to3D(), Sylvester.Vector.k);
        }
        var R = Sylvester.Matrix.Rotation(t, line.direction).elements;
        var C = line.pointClosestTo(this.anchor).elements;
        var A = this.anchor.elements, D = this.direction.elements;
        var C1 = C[0], C2 = C[1], C3 = C[2], A1 = A[0], A2 = A[1], A3 = A[2];
        var x = GenericMath("-", A1, C1), y = GenericMath("-", A2, C2), z = GenericMath("-", A3, C3);
        return Sylvester.Line.create([ GenericMath("+", GenericMath("+", GenericMath("+", C1, GenericMath("*", R[0][0], x)), GenericMath("*", R[0][1], y)), GenericMath("*", R[0][2], z)), GenericMath("+", GenericMath("+", GenericMath("+", C2, GenericMath("*", R[1][0], x)), GenericMath("*", R[1][1], y)), GenericMath("*", R[1][2], z)), GenericMath("+", GenericMath("+", GenericMath("+", C3, GenericMath("*", R[2][0], x)), GenericMath("*", R[2][1], y)), GenericMath("*", R[2][2], z)) ], [ GenericMath("+", GenericMath("+", GenericMath("*", R[0][0], D[0]), GenericMath("*", R[0][1], D[1])), GenericMath("*", R[0][2], D[2])), GenericMath("+", GenericMath("+", GenericMath("*", R[1][0], D[0]), GenericMath("*", R[1][1], D[1])), GenericMath("*", R[1][2], D[2])), GenericMath("+", GenericMath("+", GenericMath("*", R[2][0], D[0]), GenericMath("*", R[2][1], D[1])), GenericMath("*", R[2][2], D[2])) ]);
    },
    reverse: function() {
        return Sylvester.Line.create(this.anchor, this.direction.x(GenericMath("-", 0, 1)));
    },
    reflectionIn: function(obj) {
        if (obj.normal) {
            var A = this.anchor.elements, D = this.direction.elements;
            var A1 = A[0], A2 = A[1], A3 = A[2], D1 = D[0], D2 = D[1], D3 = D[2];
            var newA = this.anchor.reflectionIn(obj).elements;
            var AD1 = GenericMath("+", A1, D1), AD2 = GenericMath("+", A2, D2), AD3 = GenericMath("+", A3, D3);
            var Q = obj.pointClosestTo([ AD1, AD2, AD3 ]).elements;
            var newD = [ GenericMath("-", GenericMath("+", Q[0], GenericMath("-", Q[0], AD1)), newA[0]), GenericMath("-", GenericMath("+", Q[1], GenericMath("-", Q[1], AD2)), newA[1]), GenericMath("-", GenericMath("+", Q[2], GenericMath("-", Q[2], AD3)), newA[2]) ];
            return Sylvester.Line.create(newA, newD);
        } else if (obj.direction) {
            return this.rotate(Math.PI, obj);
        } else {
            var P = obj.elements || obj;
            return Sylvester.Line.create(this.anchor.reflectionIn([ P[0], P[1], P[2] || 0 ]), this.direction);
        }
    },
    setVectors: function(anchor, direction) {
        anchor = Sylvester.Vector.create(anchor);
        direction = Sylvester.Vector.create(direction);
        if (GenericMath("===", anchor.elements.length, 2)) {
            anchor.elements.push(0);
        }
        if (GenericMath("===", direction.elements.length, 2)) {
            direction.elements.push(0);
        }
        if (GenericMath(">", anchor.elements.length, 3) || GenericMath(">", direction.elements.length, 3)) {
            return null;
        }
        var mod = direction.modulus();
        if (GenericMath("===", mod, 0)) {
            return null;
        }
        this.anchor = anchor;
        this.direction = Sylvester.Vector.create([ GenericMath("/", direction.elements[0], mod), GenericMath("/", direction.elements[1], mod), GenericMath("/", direction.elements[2], mod) ]);
        return this;
    }
};

Sylvester.Line.create = function(anchor, direction) {
    var L = new Sylvester.Line;
    return L.setVectors(anchor, direction);
};

var $L = Sylvester.Line.create;

Sylvester.Line.X = Sylvester.Line.create(Sylvester.Vector.Zero(3), Sylvester.Vector.i);

Sylvester.Line.Y = Sylvester.Line.create(Sylvester.Vector.Zero(3), Sylvester.Vector.j);

Sylvester.Line.Z = Sylvester.Line.create(Sylvester.Vector.Zero(3), Sylvester.Vector.k);

Sylvester.Line.Segment = function() {};

Sylvester.Line.Segment.prototype = {
    eql: function(segment) {
        return this.start.eql(segment.start) && this.end.eql(segment.end) || this.start.eql(segment.end) && this.end.eql(segment.start);
    },
    dup: function() {
        return Sylvester.Line.Segment.create(this.start, this.end);
    },
    length: function() {
        var A = this.start.elements, B = this.end.elements;
        var C1 = GenericMath("-", B[0], A[0]), C2 = GenericMath("-", B[1], A[1]), C3 = GenericMath("-", B[2], A[2]);
        return Math.sqrt(GenericMath("+", GenericMath("+", GenericMath("*", C1, C1), GenericMath("*", C2, C2)), GenericMath("*", C3, C3)));
    },
    toVector: function() {
        var A = this.start.elements, B = this.end.elements;
        return Sylvester.Vector.create([ GenericMath("-", B[0], A[0]), GenericMath("-", B[1], A[1]), GenericMath("-", B[2], A[2]) ]);
    },
    midpoint: function() {
        var A = this.start.elements, B = this.end.elements;
        return Sylvester.Vector.create([ GenericMath("/", GenericMath("+", B[0], A[0]), 2), GenericMath("/", GenericMath("+", B[1], A[1]), 2), GenericMath("/", GenericMath("+", B[2], A[2]), 2) ]);
    },
    bisectingPlane: function() {
        return Sylvester.Plane.create(this.midpoint(), this.toVector());
    },
    translate: function(vector) {
        var V = vector.elements || vector;
        var S = this.start.elements, E = this.end.elements;
        return Sylvester.Line.Segment.create([ GenericMath("+", S[0], V[0]), GenericMath("+", S[1], V[1]), GenericMath("+", S[2], V[2] || 0) ], [ GenericMath("+", E[0], V[0]), GenericMath("+", E[1], V[1]), GenericMath("+", E[2], V[2] || 0) ]);
    },
    isParallelTo: function(obj) {
        return this.line.isParallelTo(obj);
    },
    distanceFrom: function(obj) {
        var P = this.pointClosestTo(obj);
        return GenericMath("===", P, null) ? null : P.distanceFrom(obj);
    },
    contains: function(obj) {
        if (obj.start && obj.end) {
            return this.contains(obj.start) && this.contains(obj.end);
        }
        var P = (obj.elements || obj).slice();
        if (GenericMath("===", P.length, 2)) {
            P.push(0);
        }
        if (this.start.eql(P)) {
            return true;
        }
        var S = this.start.elements;
        var V = Sylvester.Vector.create([ GenericMath("-", S[0], P[0]), GenericMath("-", S[1], P[1]), GenericMath("-", S[2], P[2] || 0) ]);
        var vect = this.toVector();
        return V.isAntiparallelTo(vect) && GenericMath("<=", V.modulus(), vect.modulus());
    },
    intersects: function(obj) {
        return GenericMath("!==", this.intersectionWith(obj), null);
    },
    intersectionWith: function(obj) {
        if (!this.line.intersects(obj)) {
            return null;
        }
        var P = this.line.intersectionWith(obj);
        return this.contains(P) ? P : null;
    },
    pointClosestTo: function(obj) {
        if (obj.normal) {
            var V = this.line.intersectionWith(obj);
            if (GenericMath("===", V, null)) {
                return null;
            }
            return this.pointClosestTo(V);
        } else {
            var P = this.line.pointClosestTo(obj);
            if (GenericMath("===", P, null)) {
                return null;
            }
            if (this.contains(P)) {
                return P;
            }
            return (GenericMath("<", this.line.positionOf(P), 0) ? this.start : this.end).dup();
        }
    },
    setPoints: function(startPoint, endPoint) {
        startPoint = Sylvester.Vector.create(startPoint).to3D();
        endPoint = Sylvester.Vector.create(endPoint).to3D();
        if (GenericMath("===", startPoint, null) || GenericMath("===", endPoint, null)) {
            return null;
        }
        this.line = Sylvester.Line.create(startPoint, endPoint.subtract(startPoint));
        this.start = startPoint;
        this.end = endPoint;
        return this;
    }
};

Sylvester.Line.Segment.create = function(v1, v2) {
    var S = new Sylvester.Line.Segment;
    return S.setPoints(v1, v2);
};

Sylvester.Plane = function() {};

Sylvester.Plane.prototype = {
    eql: function(plane) {
        return this.contains(plane.anchor) && this.isParallelTo(plane);
    },
    dup: function() {
        return Sylvester.Plane.create(this.anchor, this.normal);
    },
    translate: function(vector) {
        var V = vector.elements || vector;
        return Sylvester.Plane.create([ GenericMath("+", this.anchor.elements[0], V[0]), GenericMath("+", this.anchor.elements[1], V[1]), GenericMath("+", this.anchor.elements[2], V[2] || 0) ], this.normal);
    },
    isParallelTo: function(obj) {
        var theta;
        if (obj.normal) {
            theta = this.normal.angleFrom(obj.normal);
            return GenericMath("<=", Math.abs(theta), Sylvester.precision) || GenericMath("<=", Math.abs(GenericMath("-", Math.PI, theta)), Sylvester.precision);
        } else if (obj.direction) {
            return this.normal.isPerpendicularTo(obj.direction);
        }
        return null;
    },
    isPerpendicularTo: function(plane) {
        var theta = this.normal.angleFrom(plane.normal);
        return GenericMath("<=", Math.abs(GenericMath("-", GenericMath("/", Math.PI, 2), theta)), Sylvester.precision);
    },
    distanceFrom: function(obj) {
        if (this.intersects(obj) || this.contains(obj)) {
            return 0;
        }
        if (obj.anchor) {
            var A = this.anchor.elements, B = obj.anchor.elements, N = this.normal.elements;
            return Math.abs(GenericMath("+", GenericMath("+", GenericMath("*", GenericMath("-", A[0], B[0]), N[0]), GenericMath("*", GenericMath("-", A[1], B[1]), N[1])), GenericMath("*", GenericMath("-", A[2], B[2]), N[2])));
        } else {
            var P = obj.elements || obj;
            var A = this.anchor.elements, N = this.normal.elements;
            return Math.abs(GenericMath("+", GenericMath("+", GenericMath("*", GenericMath("-", A[0], P[0]), N[0]), GenericMath("*", GenericMath("-", A[1], P[1]), N[1])), GenericMath("*", GenericMath("-", A[2], P[2] || 0), N[2])));
        }
    },
    contains: function(obj) {
        if (obj.normal) {
            return null;
        }
        if (obj.direction) {
            return this.contains(obj.anchor) && this.contains(obj.anchor.add(obj.direction));
        } else {
            var P = obj.elements || obj;
            var A = this.anchor.elements, N = this.normal.elements;
            var diff = Math.abs(GenericMath("+", GenericMath("+", GenericMath("*", N[0], GenericMath("-", A[0], P[0])), GenericMath("*", N[1], GenericMath("-", A[1], P[1]))), GenericMath("*", N[2], GenericMath("-", A[2], P[2] || 0))));
            return GenericMath("<=", diff, Sylvester.precision);
        }
    },
    intersects: function(obj) {
        if (GenericMath("===", typeof obj.direction, "undefined") && GenericMath("===", typeof obj.normal, "undefined")) {
            return null;
        }
        return !this.isParallelTo(obj);
    },
    intersectionWith: function(obj) {
        if (!this.intersects(obj)) {
            return null;
        }
        if (obj.direction) {
            var A = obj.anchor.elements, D = obj.direction.elements, P = this.anchor.elements, N = this.normal.elements;
            var multiplier = GenericMath("/", GenericMath("+", GenericMath("+", GenericMath("*", N[0], GenericMath("-", P[0], A[0])), GenericMath("*", N[1], GenericMath("-", P[1], A[1]))), GenericMath("*", N[2], GenericMath("-", P[2], A[2]))), GenericMath("+", GenericMath("+", GenericMath("*", N[0], D[0]), GenericMath("*", N[1], D[1])), GenericMath("*", N[2], D[2])));
            return Sylvester.Vector.create([ GenericMath("+", A[0], GenericMath("*", D[0], multiplier)), GenericMath("+", A[1], GenericMath("*", D[1], multiplier)), GenericMath("+", A[2], GenericMath("*", D[2], multiplier)) ]);
        } else if (obj.normal) {
            var direction = this.normal.cross(obj.normal).toUnitVector();
            var N = this.normal.elements, A = this.anchor.elements, O = obj.normal.elements, B = obj.anchor.elements;
            var solver = Sylvester.Matrix.Zero(2, 2), i = 0;
            while (solver.isSingular()) {
                (function() {
                    var __generic_math_tmp = i;
                    i = GenericMath("+", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                })();
                solver = Sylvester.Matrix.create([ [ N[i % 3], N[GenericMath("+", i, 1) % 3] ], [ O[i % 3], O[GenericMath("+", i, 1) % 3] ] ]);
            }
            var inverse = solver.inverse().elements;
            var x = GenericMath("+", GenericMath("+", GenericMath("*", N[0], A[0]), GenericMath("*", N[1], A[1])), GenericMath("*", N[2], A[2]));
            var y = GenericMath("+", GenericMath("+", GenericMath("*", O[0], B[0]), GenericMath("*", O[1], B[1])), GenericMath("*", O[2], B[2]));
            var intersection = [ GenericMath("+", GenericMath("*", inverse[0][0], x), GenericMath("*", inverse[0][1], y)), GenericMath("+", GenericMath("*", inverse[1][0], x), GenericMath("*", inverse[1][1], y)) ];
            var anchor = [];
            for (var j = 1; GenericMath("<=", j, 3); function() {
                var __generic_math_tmp = j;
                j = GenericMath("+", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                anchor.push(GenericMath("===", i, j) ? 0 : intersection[GenericMath("+", j, GenericMath("-", 5, i) % 3) % 3]);
            }
            return Sylvester.Line.create(anchor, direction);
        }
    },
    pointClosestTo: function(point) {
        var P = point.elements || point;
        var A = this.anchor.elements, N = this.normal.elements;
        var dot = GenericMath("+", GenericMath("+", GenericMath("*", GenericMath("-", A[0], P[0]), N[0]), GenericMath("*", GenericMath("-", A[1], P[1]), N[1])), GenericMath("*", GenericMath("-", A[2], P[2] || 0), N[2]));
        return Sylvester.Vector.create([ GenericMath("+", P[0], GenericMath("*", N[0], dot)), GenericMath("+", P[1], GenericMath("*", N[1], dot)), GenericMath("+", P[2] || 0, GenericMath("*", N[2], dot)) ]);
    },
    rotate: function(t, line) {
        var R = t.determinant ? t.elements : Sylvester.Matrix.Rotation(t, line.direction).elements;
        var C = line.pointClosestTo(this.anchor).elements;
        var A = this.anchor.elements, N = this.normal.elements;
        var C1 = C[0], C2 = C[1], C3 = C[2], A1 = A[0], A2 = A[1], A3 = A[2];
        var x = GenericMath("-", A1, C1), y = GenericMath("-", A2, C2), z = GenericMath("-", A3, C3);
        return Sylvester.Plane.create([ GenericMath("+", GenericMath("+", GenericMath("+", C1, GenericMath("*", R[0][0], x)), GenericMath("*", R[0][1], y)), GenericMath("*", R[0][2], z)), GenericMath("+", GenericMath("+", GenericMath("+", C2, GenericMath("*", R[1][0], x)), GenericMath("*", R[1][1], y)), GenericMath("*", R[1][2], z)), GenericMath("+", GenericMath("+", GenericMath("+", C3, GenericMath("*", R[2][0], x)), GenericMath("*", R[2][1], y)), GenericMath("*", R[2][2], z)) ], [ GenericMath("+", GenericMath("+", GenericMath("*", R[0][0], N[0]), GenericMath("*", R[0][1], N[1])), GenericMath("*", R[0][2], N[2])), GenericMath("+", GenericMath("+", GenericMath("*", R[1][0], N[0]), GenericMath("*", R[1][1], N[1])), GenericMath("*", R[1][2], N[2])), GenericMath("+", GenericMath("+", GenericMath("*", R[2][0], N[0]), GenericMath("*", R[2][1], N[1])), GenericMath("*", R[2][2], N[2])) ]);
    },
    reflectionIn: function(obj) {
        if (obj.normal) {
            var A = this.anchor.elements, N = this.normal.elements;
            var A1 = A[0], A2 = A[1], A3 = A[2], N1 = N[0], N2 = N[1], N3 = N[2];
            var newA = this.anchor.reflectionIn(obj).elements;
            var AN1 = GenericMath("+", A1, N1), AN2 = GenericMath("+", A2, N2), AN3 = GenericMath("+", A3, N3);
            var Q = obj.pointClosestTo([ AN1, AN2, AN3 ]).elements;
            var newN = [ GenericMath("-", GenericMath("+", Q[0], GenericMath("-", Q[0], AN1)), newA[0]), GenericMath("-", GenericMath("+", Q[1], GenericMath("-", Q[1], AN2)), newA[1]), GenericMath("-", GenericMath("+", Q[2], GenericMath("-", Q[2], AN3)), newA[2]) ];
            return Sylvester.Plane.create(newA, newN);
        } else if (obj.direction) {
            return this.rotate(Math.PI, obj);
        } else {
            var P = obj.elements || obj;
            return Sylvester.Plane.create(this.anchor.reflectionIn([ P[0], P[1], P[2] || 0 ]), this.normal);
        }
    },
    setVectors: function(anchor, v1, v2) {
        anchor = Sylvester.Vector.create(anchor);
        anchor = anchor.to3D();
        if (GenericMath("===", anchor, null)) {
            return null;
        }
        v1 = Sylvester.Vector.create(v1);
        v1 = v1.to3D();
        if (GenericMath("===", v1, null)) {
            return null;
        }
        if (GenericMath("===", typeof v2, "undefined")) {
            v2 = null;
        } else {
            v2 = Sylvester.Vector.create(v2);
            v2 = v2.to3D();
            if (GenericMath("===", v2, null)) {
                return null;
            }
        }
        var A1 = anchor.elements[0], A2 = anchor.elements[1], A3 = anchor.elements[2];
        var v11 = v1.elements[0], v12 = v1.elements[1], v13 = v1.elements[2];
        var normal, mod;
        if (GenericMath("!==", v2, null)) {
            var v21 = v2.elements[0], v22 = v2.elements[1], v23 = v2.elements[2];
            normal = Sylvester.Vector.create([ GenericMath("-", GenericMath("*", GenericMath("-", v12, A2), GenericMath("-", v23, A3)), GenericMath("*", GenericMath("-", v13, A3), GenericMath("-", v22, A2))), GenericMath("-", GenericMath("*", GenericMath("-", v13, A3), GenericMath("-", v21, A1)), GenericMath("*", GenericMath("-", v11, A1), GenericMath("-", v23, A3))), GenericMath("-", GenericMath("*", GenericMath("-", v11, A1), GenericMath("-", v22, A2)), GenericMath("*", GenericMath("-", v12, A2), GenericMath("-", v21, A1))) ]);
            mod = normal.modulus();
            if (GenericMath("===", mod, 0)) {
                return null;
            }
            normal = Sylvester.Vector.create([ GenericMath("/", normal.elements[0], mod), GenericMath("/", normal.elements[1], mod), GenericMath("/", normal.elements[2], mod) ]);
        } else {
            mod = Math.sqrt(GenericMath("+", GenericMath("+", GenericMath("*", v11, v11), GenericMath("*", v12, v12)), GenericMath("*", v13, v13)));
            if (GenericMath("===", mod, 0)) {
                return null;
            }
            normal = Sylvester.Vector.create([ GenericMath("/", v1.elements[0], mod), GenericMath("/", v1.elements[1], mod), GenericMath("/", v1.elements[2], mod) ]);
        }
        this.anchor = anchor;
        this.normal = normal;
        return this;
    }
};

Sylvester.Plane.create = function(anchor, v1, v2) {
    var P = new Sylvester.Plane;
    return P.setVectors(anchor, v1, v2);
};

var $P = Sylvester.Plane.create;

Sylvester.Plane.XY = Sylvester.Plane.create(Sylvester.Vector.Zero(3), Sylvester.Vector.k);

Sylvester.Plane.YZ = Sylvester.Plane.create(Sylvester.Vector.Zero(3), Sylvester.Vector.i);

Sylvester.Plane.ZX = Sylvester.Plane.create(Sylvester.Vector.Zero(3), Sylvester.Vector.j);

Sylvester.Plane.YX = Sylvester.Plane.XY;

Sylvester.Plane.ZY = Sylvester.Plane.YZ;

Sylvester.Plane.XZ = Sylvester.Plane.ZX;

Sylvester.Plane.fromPoints = function(points) {
    var np = points.length, list = [], i, P, n, N, A, B, C, D, theta, prevN, totalN = Sylvester.Vector.Zero(3);
    for (i = 0; GenericMath("<", i, np); function() {
        var __generic_math_tmp = i;
        i = GenericMath("+", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        P = Sylvester.Vector.create(points[i]).to3D();
        if (GenericMath("===", P, null)) {
            return null;
        }
        list.push(P);
        n = list.length;
        if (GenericMath(">", n, 2)) {
            A = list[GenericMath("-", n, 1)].elements;
            B = list[GenericMath("-", n, 2)].elements;
            C = list[GenericMath("-", n, 3)].elements;
            N = Sylvester.Vector.create([ GenericMath("-", GenericMath("*", GenericMath("-", A[1], B[1]), GenericMath("-", C[2], B[2])), GenericMath("*", GenericMath("-", A[2], B[2]), GenericMath("-", C[1], B[1]))), GenericMath("-", GenericMath("*", GenericMath("-", A[2], B[2]), GenericMath("-", C[0], B[0])), GenericMath("*", GenericMath("-", A[0], B[0]), GenericMath("-", C[2], B[2]))), GenericMath("-", GenericMath("*", GenericMath("-", A[0], B[0]), GenericMath("-", C[1], B[1])), GenericMath("*", GenericMath("-", A[1], B[1]), GenericMath("-", C[0], B[0]))) ]).toUnitVector();
            if (GenericMath(">", n, 3)) {
                theta = N.angleFrom(prevN);
                if (GenericMath("!==", theta, null)) {
                    if (!(GenericMath("<=", Math.abs(theta), Sylvester.precision) || GenericMath("<=", Math.abs(GenericMath("-", theta, Math.PI)), Sylvester.precision))) {
                        return null;
                    }
                }
            }
            totalN = totalN.add(N);
            prevN = N;
        }
    }
    A = list[1].elements;
    B = list[0].elements;
    C = list[GenericMath("-", n, 1)].elements;
    D = list[GenericMath("-", n, 2)].elements;
    totalN = totalN.add(Sylvester.Vector.create([ GenericMath("-", GenericMath("*", GenericMath("-", A[1], B[1]), GenericMath("-", C[2], B[2])), GenericMath("*", GenericMath("-", A[2], B[2]), GenericMath("-", C[1], B[1]))), GenericMath("-", GenericMath("*", GenericMath("-", A[2], B[2]), GenericMath("-", C[0], B[0])), GenericMath("*", GenericMath("-", A[0], B[0]), GenericMath("-", C[2], B[2]))), GenericMath("-", GenericMath("*", GenericMath("-", A[0], B[0]), GenericMath("-", C[1], B[1])), GenericMath("*", GenericMath("-", A[1], B[1]), GenericMath("-", C[0], B[0]))) ]).toUnitVector()).add(Sylvester.Vector.create([ GenericMath("-", GenericMath("*", GenericMath("-", B[1], C[1]), GenericMath("-", D[2], C[2])), GenericMath("*", GenericMath("-", B[2], C[2]), GenericMath("-", D[1], C[1]))), GenericMath("-", GenericMath("*", GenericMath("-", B[2], C[2]), GenericMath("-", D[0], C[0])), GenericMath("*", GenericMath("-", B[0], C[0]), GenericMath("-", D[2], C[2]))), GenericMath("-", GenericMath("*", GenericMath("-", B[0], C[0]), GenericMath("-", D[1], C[1])), GenericMath("*", GenericMath("-", B[1], C[1]), GenericMath("-", D[0], C[0]))) ]).toUnitVector());
    return Sylvester.Plane.create(list[0], totalN);
};

Sylvester.Polygon = function() {};

Sylvester.Polygon.prototype = {
    v: function(i) {
        return this.vertices.at(GenericMath("-", i, 1)).data;
    },
    nodeFor: function(vertex) {
        return this.vertices.withData(vertex);
    },
    dup: function() {
        return Sylvester.Polygon.create(this.vertices, this.plane);
    },
    translate: function(vector) {
        var P = vector.elements || vector;
        this.vertices.each(function(node) {
            var E = node.data.elements;
            node.data.setElements([ GenericMath("+", E[0], P[0]), GenericMath("+", E[1], P[1]), GenericMath("+", E[2], P[2] || 0) ]);
        });
        this.plane = this.plane.translate(vector);
        this.updateTrianglePlanes(function(plane) {
            return plane.translate(vector);
        });
        return this;
    },
    rotate: function(t, line) {
        var R = Sylvester.Matrix.Rotation(t, line.direction);
        this.vertices.each(function(node) {
            node.data.setElements(node.data.rotate(R, line).elements);
        });
        this.plane = this.plane.rotate(R, line);
        this.updateTrianglePlanes(function(plane) {
            return plane.rotate(R, line);
        });
        return this;
    },
    scale: function(k, point) {
        var P = point.elements || point;
        this.vertices.each(function(node) {
            var E = node.data.elements;
            node.data.setElements([ GenericMath("+", P[0], GenericMath("*", k, GenericMath("-", E[0], P[0]))), GenericMath("+", P[1], GenericMath("*", k, GenericMath("-", E[1], P[1]))), GenericMath("+", P[2] || 0, GenericMath("*", k, GenericMath("-", E[2], P[2] || 0))) ]);
        });
        var anchor = this.vertices.first.data;
        this.plane.anchor.setElements(anchor);
        this.updateTrianglePlanes(function(plane) {
            return Sylvester.Plane.create(anchor, plane.normal);
        });
        return this;
    },
    updateTrianglePlanes: function(fn) {
        var i;
        if (GenericMath("!==", this.cached.triangles, null)) {
            i = this.cached.triangles.length;
            while (function() {
                var __generic_math_tmp = i;
                i = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                this.cached.triangles[i].plane = fn(this.cached.triangles[i].plane);
            }
        }
        if (GenericMath("!==", this.cached.surfaceIntegralElements, null)) {
            i = this.cached.surfaceIntegralElements.length;
            while (function() {
                var __generic_math_tmp = i;
                i = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                this.cached.surfaceIntegralElements[i].plane = fn(this.cached.surfaceIntegralElements[i].plane);
            }
        }
    },
    isTriangle: function() {
        return GenericMath("===", this.vertices.length, 3);
    },
    trianglesForSurfaceIntegral: function() {
        if (GenericMath("!==", this.cached.surfaceIntegralElements, null)) {
            return this.cached.surfaceIntegralElements;
        }
        var triangles = [];
        var firstVertex = this.vertices.first.data;
        var plane = this.plane;
        this.vertices.each(function(node, i) {
            if (GenericMath("<", i, 2)) {
                return;
            }
            var points = [ firstVertex, node.prev.data, node.data ];
            triangles.push(Sylvester.Polygon.create(points, Sylvester.Plane.fromPoints(points) || plane));
        });
        return this.setCache("surfaceIntegralElements", triangles);
    },
    area: function() {
        if (this.isTriangle()) {
            var A = this.vertices.first, B = A.next, C = B.next;
            A = A.data.elements;
            B = B.data.elements;
            C = C.data.elements;
            return GenericMath("*", .5, Sylvester.Vector.create([ GenericMath("-", GenericMath("*", GenericMath("-", A[1], B[1]), GenericMath("-", C[2], B[2])), GenericMath("*", GenericMath("-", A[2], B[2]), GenericMath("-", C[1], B[1]))), GenericMath("-", GenericMath("*", GenericMath("-", A[2], B[2]), GenericMath("-", C[0], B[0])), GenericMath("*", GenericMath("-", A[0], B[0]), GenericMath("-", C[2], B[2]))), GenericMath("-", GenericMath("*", GenericMath("-", A[0], B[0]), GenericMath("-", C[1], B[1])), GenericMath("*", GenericMath("-", A[1], B[1]), GenericMath("-", C[0], B[0]))) ]).modulus());
        } else {
            var trigs = this.trianglesForSurfaceIntegral(), area = 0;
            var i = trigs.length;
            while (function() {
                var __generic_math_tmp = i;
                i = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                area = GenericMath("+", area, GenericMath("*", trigs[i].area(), trigs[i].plane.normal.dot(this.plane.normal)));
            }
            return area;
        }
    },
    centroid: function() {
        if (this.isTriangle()) {
            var A = this.v(1).elements, B = this.v(2).elements, C = this.v(3).elements;
            return Sylvester.Vector.create([ GenericMath("/", GenericMath("+", GenericMath("+", A[0], B[0]), C[0]), 3), GenericMath("/", GenericMath("+", GenericMath("+", A[1], B[1]), C[1]), 3), GenericMath("/", GenericMath("+", GenericMath("+", A[2], B[2]), C[2]), 3) ]);
        } else {
            var A, M = 0, V = Sylvester.Vector.Zero(3), P, C, trigs = this.trianglesForSurfaceIntegral();
            var i = trigs.length;
            while (function() {
                var __generic_math_tmp = i;
                i = GenericMath("-", __generic_math_tmp, 1);
                return __generic_math_tmp;
            }()) {
                A = GenericMath("*", trigs[i].area(), trigs[i].plane.normal.dot(this.plane.normal));
                M = GenericMath("+", M, A);
                P = V.elements;
                C = trigs[i].centroid().elements;
                V.setElements([ GenericMath("+", P[0], GenericMath("*", C[0], A)), GenericMath("+", P[1], GenericMath("*", C[1], A)), GenericMath("+", P[2], GenericMath("*", C[2], A)) ]);
            }
            return V.x(GenericMath("/", 1, M));
        }
    },
    projectionOn: function(plane) {
        var points = [];
        this.vertices.each(function(node) {
            points.push(plane.pointClosestTo(node.data));
        });
        return Sylvester.Polygon.create(points);
    },
    removeVertex: function(vertex) {
        if (this.isTriangle()) {
            return;
        }
        var node = this.nodeFor(vertex);
        if (GenericMath("===", node, null)) {
            return null;
        }
        this.clearCache();
        var prev = node.prev, next = node.next;
        var prevWasConvex = prev.data.isConvex(this);
        var nextWasConvex = next.data.isConvex(this);
        if (node.data.isConvex(this)) {
            this.convexVertices.remove(this.convexVertices.withData(node.data));
        } else {
            this.reflexVertices.remove(this.reflexVertices.withData(node.data));
        }
        this.vertices.remove(node);
        if (GenericMath("!==", prevWasConvex, prev.data.isConvex(this))) {
            if (prevWasConvex) {
                this.convexVertices.remove(this.convexVertices.withData(prev.data));
                this.reflexVertices.append(new Sylvester.LinkedList.Node(prev.data));
            } else {
                this.reflexVertices.remove(this.reflexVertices.withData(prev.data));
                this.convexVertices.append(new Sylvester.LinkedList.Node(prev.data));
            }
        }
        if (GenericMath("!==", nextWasConvex, next.data.isConvex(this))) {
            if (nextWasConvex) {
                this.convexVertices.remove(this.convexVertices.withData(next.data));
                this.reflexVertices.append(new Sylvester.LinkedList.Node(next.data));
            } else {
                this.reflexVertices.remove(this.reflexVertices.withData(next.data));
                this.convexVertices.append(new Sylvester.LinkedList.Node(next.data));
            }
        }
        return this;
    },
    contains: function(point) {
        return this.containsByWindingNumber(point);
    },
    containsByWindingNumber: function(point) {
        var P = point.elements || point;
        if (!this.plane.contains(P)) {
            return false;
        }
        if (this.hasEdgeContaining(P)) {
            return false;
        }
        var V, W, A, B, theta = 0, dt, loops = 0, self = this;
        this.vertices.each(function(node) {
            V = node.data.elements;
            W = node.next.data.elements;
            A = Sylvester.Vector.create([ GenericMath("-", V[0], P[0]), GenericMath("-", V[1], P[1]), GenericMath("-", V[2], P[2] || 0) ]);
            B = Sylvester.Vector.create([ GenericMath("-", W[0], P[0]), GenericMath("-", W[1], P[1]), GenericMath("-", W[2], P[2] || 0) ]);
            dt = A.angleFrom(B);
            if (GenericMath("===", dt, null) || GenericMath("===", dt, 0)) {
                return;
            }
            theta = GenericMath("+", theta, GenericMath("*", A.cross(B).isParallelTo(self.plane.normal) ? 1 : GenericMath("-", 0, 1), dt));
            if (GenericMath(">=", theta, GenericMath("-", GenericMath("*", 2, Math.PI), Sylvester.precision))) {
                (function() {
                    var __generic_math_tmp = loops;
                    loops = GenericMath("+", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                })();
                theta = GenericMath("-", theta, GenericMath("*", 2, Math.PI));
            }
            if (GenericMath("<=", theta, GenericMath("+", GenericMath("*", GenericMath("-", 0, 2), Math.PI), Sylvester.precision))) {
                (function() {
                    var __generic_math_tmp = loops;
                    loops = GenericMath("-", __generic_math_tmp, 1);
                    return __generic_math_tmp;
                })();
                theta = GenericMath("+", theta, GenericMath("*", 2, Math.PI));
            }
        });
        return GenericMath("!==", loops, 0);
    },
    hasEdgeContaining: function(point) {
        var P = point.elements || point;
        var success = false;
        this.vertices.each(function(node) {
            if (Sylvester.Line.Segment.create(node.data, node.next.data).contains(P)) {
                success = true;
            }
        });
        return success;
    },
    toTriangles: function() {
        if (GenericMath("!==", this.cached.triangles, null)) {
            return this.cached.triangles;
        }
        return this.setCache("triangles", this.triangulateByEarClipping());
    },
    triangulateByEarClipping: function() {
        var poly = this.dup(), triangles = [], success, convexNode, mainNode, trig;
        while (!poly.isTriangle()) {
            success = false;
            while (!success) {
                success = true;
                convexNode = poly.convexVertices.randomNode();
                mainNode = poly.vertices.withData(convexNode.data);
                trig = Sylvester.Polygon.create([ mainNode.data, mainNode.next.data, mainNode.prev.data ], this.plane);
                poly.reflexVertices.each(function(node) {
                    if (GenericMath("!==", node.data, mainNode.prev.data) && GenericMath("!==", node.data, mainNode.next.data)) {
                        if (trig.contains(node.data) || trig.hasEdgeContaining(node.data)) {
                            success = false;
                        }
                    }
                });
            }
            triangles.push(trig);
            poly.removeVertex(mainNode.data);
        }
        triangles.push(Sylvester.Polygon.create(poly.vertices, this.plane));
        return triangles;
    },
    setVertices: function(points, plane) {
        var pointSet = points.toArray ? points.toArray() : points;
        this.plane = plane && plane.normal ? plane.dup() : Sylvester.Plane.fromPoints(pointSet);
        if (GenericMath("===", this.plane, null)) {
            return null;
        }
        this.vertices = new Sylvester.LinkedList.Circular;
        var i = pointSet.length, newVertex;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            newVertex = pointSet[i].isConvex ? pointSet[i] : new Sylvester.Polygon.Vertex(pointSet[i]);
            this.vertices.prepend(new Sylvester.LinkedList.Node(newVertex));
        }
        this.clearCache();
        this.populateVertexTypeLists();
        return this;
    },
    populateVertexTypeLists: function() {
        this.convexVertices = new Sylvester.LinkedList.Circular;
        this.reflexVertices = new Sylvester.LinkedList.Circular;
        var self = this;
        this.vertices.each(function(node) {
            self[GenericMath("+", node.data.type(self), "Vertices")].append(new Sylvester.LinkedList.Node(node.data));
        });
    },
    copyVertices: function() {
        this.clearCache();
        this.vertices.each(function(node) {
            node.data = new Sylvester.Polygon.Vertex(node.data);
        });
        this.populateVertexTypeLists();
    },
    clearCache: function() {
        this.cached = {
            triangles: null,
            surfaceIntegralElements: null
        };
    },
    setCache: function(key, value) {
        this.cached[key] = value;
        return value;
    },
    inspect: function() {
        var points = [];
        this.vertices.each(function(node) {
            points.push(node.data.inspect());
        });
        return points.join(" -> ");
    }
};

Sylvester.Polygon.create = function(points, plane) {
    var P = new Sylvester.Polygon;
    return P.setVertices(points, plane);
};

Sylvester.Polygon.Vertex = function(point) {
    this.setElements(point);
    if (GenericMath("===", this.elements.length, 2)) {
        this.elements.push(0);
    }
    if (GenericMath("!==", this.elements.length, 3)) {
        return null;
    }
};

Sylvester.Polygon.Vertex.prototype = new Sylvester.Vector;

Sylvester.Polygon.Vertex.prototype.isConvex = function(polygon) {
    var node = polygon.nodeFor(this);
    if (GenericMath("===", node, null)) {
        return null;
    }
    var prev = node.prev.data, next = node.next.data;
    var A = next.subtract(this);
    var B = prev.subtract(this);
    var theta = A.angleFrom(B);
    if (GenericMath("<=", theta, Sylvester.precision)) {
        return true;
    }
    if (GenericMath("<=", Math.abs(GenericMath("-", theta, Math.PI)), Sylvester.precision)) {
        return false;
    }
    return GenericMath(">", A.cross(B).dot(polygon.plane.normal), 0);
};

Sylvester.Polygon.Vertex.prototype.isReflex = function(polygon) {
    var result = this.isConvex(polygon);
    return GenericMath("===", result, null) ? null : !result;
};

Sylvester.Polygon.Vertex.prototype.type = function(polygon) {
    var result = this.isConvex(polygon);
    return GenericMath("===", result, null) ? null : result ? "convex" : "reflex";
};

Sylvester.Polygon.Vertex.convert = function(points) {
    var pointSet = points.toArray ? points.toArray() : points;
    var list = [], n = pointSet.length;
    for (var i = 0; GenericMath("<", i, n); function() {
        var __generic_math_tmp = i;
        i = GenericMath("+", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        list.push(new Sylvester.Polygon.Vertex(pointSet[i]));
    }
    return list;
};

Sylvester.LinkedList = function() {};

Sylvester.LinkedList.prototype = {
    length: 0,
    first: null,
    last: null,
    forEach: function(fn, context) {
        var node = this.first, n = this.length;
        for (var i = 0; GenericMath("<", i, n); function() {
            var __generic_math_tmp = i;
            i = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            fn.call(context, node, i);
            node = node.next;
        }
    },
    at: function(i) {
        if (!(GenericMath(">=", i, 0) && GenericMath("<", i, this.length))) {
            return null;
        }
        var node = this.first;
        while (function() {
            var __generic_math_tmp = i;
            i = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            node = node.next;
        }
        return node;
    },
    randomNode: function() {
        var n = Math.floor(GenericMath("*", Math.random(), this.length));
        return this.at(n);
    },
    toArray: function() {
        var arr = [], node = this.first, n = this.length;
        while (function() {
            var __generic_math_tmp = n;
            n = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            arr.push(node.data || node);
            node = node.next;
        }
        return arr;
    }
};

Sylvester.LinkedList.prototype.each = Sylvester.LinkedList.prototype.forEach;

Sylvester.LinkedList.Node = function(data) {
    this.prev = null;
    this.next = null;
    this.data = data;
};

Sylvester.LinkedList.Circular = function() {};

Sylvester.LinkedList.Circular.Methods = {
    append: function(node) {
        if (GenericMath("===", this.first, null)) {
            node.prev = node;
            node.next = node;
            this.first = node;
            this.last = node;
        } else {
            node.prev = this.last;
            node.next = this.first;
            this.first.prev = node;
            this.last.next = node;
            this.last = node;
        }
        (function() {
            var __generic_math_tmp = this.length;
            this.length = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        })();
    },
    prepend: function(node) {
        if (GenericMath("===", this.first, null)) {
            this.append(node);
            return;
        } else {
            node.prev = this.last;
            node.next = this.first;
            this.first.prev = node;
            this.last.next = node;
            this.first = node;
        }
        (function() {
            var __generic_math_tmp = this.length;
            this.length = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        })();
    },
    insertAfter: function(node, newNode) {
        newNode.prev = node;
        newNode.next = node.next;
        node.next.prev = newNode;
        node.next = newNode;
        if (GenericMath("===", newNode.prev, this.last)) {
            this.last = newNode;
        }
        (function() {
            var __generic_math_tmp = this.length;
            this.length = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        })();
    },
    insertBefore: function(node, newNode) {
        newNode.prev = node.prev;
        newNode.next = node;
        node.prev.next = newNode;
        node.prev = newNode;
        if (GenericMath("===", newNode.next, this.first)) {
            this.first = newNode;
        }
        (function() {
            var __generic_math_tmp = this.length;
            this.length = GenericMath("+", __generic_math_tmp, 1);
            return __generic_math_tmp;
        })();
    },
    remove: function(node) {
        if (GenericMath(">", this.length, 1)) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
            if (GenericMath("===", node, this.first)) {
                this.first = node.next;
            }
            if (GenericMath("===", node, this.last)) {
                this.last = node.prev;
            }
        } else {
            this.first = null;
            this.last = null;
        }
        node.prev = null;
        node.next = null;
        (function() {
            var __generic_math_tmp = this.length;
            this.length = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        })();
    },
    withData: function(data) {
        var nodeFromStart = this.first, nodeFromEnd = this.last, n = Math.ceil(GenericMath("/", this.length, 2));
        while (function() {
            var __generic_math_tmp = n;
            n = GenericMath("-", __generic_math_tmp, 1);
            return __generic_math_tmp;
        }()) {
            if (GenericMath("===", nodeFromStart.data, data)) {
                return nodeFromStart;
            }
            if (GenericMath("===", nodeFromEnd.data, data)) {
                return nodeFromEnd;
            }
            nodeFromStart = nodeFromStart.next;
            nodeFromEnd = nodeFromEnd.prev;
        }
        return null;
    }
};

Sylvester.LinkedList.Circular.prototype = new Sylvester.LinkedList;

for (var method in Sylvester.LinkedList.Circular.Methods) {
    Sylvester.LinkedList.Circular.prototype[method] = Sylvester.LinkedList.Circular.Methods[method];
}

Sylvester.LinkedList.Circular.fromArray = function(list, useNodes) {
    var linked = new Sylvester.LinkedList.Circular;
    var n = list.length;
    while (function() {
        var __generic_math_tmp = n;
        n = GenericMath("-", __generic_math_tmp, 1);
        return __generic_math_tmp;
    }()) {
        linked.prepend(useNodes ? new Sylvester.LinkedList.Node(list[n]) : list[n]);
    }
    return linked;
};

(function() {
    var api = GenericMath("===", typeof require, "function") && GenericMath("===", typeof exports, "object") ? exports : this;
    api.Line = Sylvester.Line;
    api.Matrix = Sylvester.Matrix;
    api.Plane = Sylvester.Plane;
    api.Polygon = Sylvester.Polygon;
    api.Vector = Sylvester.Vector;
    if (GenericMath("!==", typeof WScript, "undefined")) this.Sylvester = Sylvester;
})();
