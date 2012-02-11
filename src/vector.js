// This file is required in order for any other classes to work. Some Vector methods work with the
// other Sylvester classes and are useless unless they are included. Other classes such as Line and
// Plane will not function at all without Vector being loaded first.

var Sylvester = {
  precision: 1e-6,

  // The internal _fn object holds various arithmetic functions that
  // know how to deal with whatever object type the user has chosen to
  // fill matrices/vectors with.
  //
  // For convenience, we've chosen to follow the javascript-bignum's
  // Scheme-like nomenclature so that we can use its `fn' object
  // directly without some sort of proxy.
  //
  // This default object deals with Javascript Numbers, accounting for
  // Sylvester.precision when performing comparisons.
  _fn: {
    // Returns true if x and y are equal
    "=": function(x, y) { return Math.abs(x - y) <= Sylvester.precision; },

    // Returns the sum of x and y. When invoked without arguments,
    // returns the neutral element of addition
    "+": function(x, y) { return (x != null && y != null) ? x + y : 0; },

    // Returns the result of subtracting y to x. If passed only one
    // argument, returns -x
    "-": function(x, y) { return y == null ? -x : x - y; },

    // Returns the product between x and y. When invoked without
    // arguments, returns the neutral element of multiplication
    "*": function(x, y) { return (x != null && y != null) ? x * y : 1; },

    // Returns x divided by y
    "/": function(x, y) { return x / y; },

    // Returns true if x is larger than y
    ">": function(x, y) { return x > y; },

    // Returns true if x is equal or larger than y
    ">=": function(x, y) { return x >= y; },

    // Returns true if x is less than y
    "<": function(x, y) { return x < y; },

    // Returns true if x is equal or less than y
    "<=": function(x, y) { return x <= y; },

    // Returns the absolute value of x
    abs: Math.abs,

    // Returns true if x is zero
    "zero?": function(x) { return Math.abs(x) <= Sylvester.precision; },

    // Returns true if x is positive
    "positive?": function(x) { return x > Sylvester.precision; },

    // Returns the closest integer to x
    round: Math.round,

    // Returns the sine of x
    sin: Math.sin,

    // Returns the cosine of x
    cos: Math.cos,

    // Returns the arc cosine of x
    acos: Math.acos,

    // Returns the arc sine of x
    asin: Math.asin,

    // Returns a random number within the interval [0, limit[
    random: function(limit) { return Math.floor(Math.random() * limit); },

    // Returns the square root of x
    sqrt: Math.sqrt,

    // Some constants
    PI: Math.PI,
    ZERO: 0,
    F_ZERO: 0,
    ONE: 1,
    F_ONE: 1
  }
};

function Vector() {}
Vector.prototype = {
  _fn: Sylvester._fn,

  // Returns element i of the vector
  e: function(i) {
    return (i < 1 || i > this.elements.length) ? null : this.elements[i-1];
  },

  // Returns the number of elements the vector has
  dimensions: function() {
    return this.elements.length;
  },

  // Returns the modulus ('length') of the vector
  modulus: function() {
    return Math.sqrt(this.dot(this));
  },

  // Returns true iff the vector is equal to the argument
  eql: function(vector) {
    var n = this.elements.length;
    var V = vector.elements || vector;
    if (n != V.length) { return false; }
    while (n--) {
      if (!this._fn["="](this.elements[n], V[n])) { return false; }
    }
    return true;
  },

  // Returns a copy of the vector
  dup: function() {
    return Vector.create(this.elements, this._fn);
  },

  // Maps the vector to another vector according to the given function
  map: function(fn) {
    var elements = [];
    this.each(function(x, i) {
      elements.push(fn(x, i));
    });
    return Vector.create(elements, this._fn);
  },

  // Calls the iterator for each element of the vector in turn
  each: function(fn) {
    var n = this.elements.length;
    for (var i = 0; i < n; i++) {
      fn(this.elements[i], i+1);
    }
  },

  // Returns a new vector created by normalizing the receiver
  toUnitVector: function() {
    var r = this.modulus();
    if (r === 0) { return this.dup(); }
    var fn = this._fn;
    return this.map(function(x) { return fn["/"](x, r); });
  },

  // Returns the angle between the vector and the argument (also a vector)
  angleFrom: function(vector) {
    var V = vector.elements || vector;
    var n = this.elements.length, k = n, i;
    if (n != V.length) { return null; }
    var fn = this._fn;
    var dot = fn.ZERO, mod1 = fn.ZERO, mod2 = fn.ZERO;
    // Work things out in parallel to save time
    this.each(function(x, i) {
      dot = fn["+"](dot, fn["*"](x, V[i-1]));
      mod1 = fn["+"](mod1, fn["*"](x, x));
      mod2 = fn["+"](mod2, fn["*"](V[i-1], V[i-1]));
    });
    mod1 = fn.sqrt(mod1);
    mod2 = fn.sqrt(mod2);
    if (fn["zero?"](fn["*"](mod1, mod2))) { return null; }
    var theta = fn["/"](dot, fn["*"](mod1, mod2));
    if (fn["<"](theta, -1)) { theta = fn["-"](fn.ONE); }
    if (fn[">"](theta, 1)) { theta = fn.ONE; }
    return fn.acos(theta);
  },

  // Returns true iff the vector is parallel to the argument
  isParallelTo: function(vector) {
    var angle = this.angleFrom(vector);
    return (angle === null) ? null : !this._fn["positive?"](angle);
  },

  // Returns true iff the vector is antiparallel to the argument
  isAntiparallelTo: function(vector) {
    var angle = this.angleFrom(vector);
    return (angle === null) ? null : !this._fn["positive?"](this._fn.abs(this._fn["-"](angle, this._fn.PI))); // FIXME
  },

  // Returns true iff the vector is perpendicular to the argument
  isPerpendicularTo: function(vector) {
    var dot = this.dot(vector);
    return (dot === null) ? null : this._fn["zero?"](dot);
  },

  // Returns the result of adding the argument to the vector
  add: function(vector) {
    var V = vector.elements || vector;
    if (this.elements.length != V.length) { return null; }
    var fn = this._fn;
    return this.map(function(x, i) { return fn["+"](x, V[i-1]); });
  },

  // Returns the result of subtracting the argument from the vector
  subtract: function(vector) {
    var V = vector.elements || vector;
    if (this.elements.length != V.length) { return null; }
    var fn = this._fn;
    return this.map(function(x, i) { return fn["-"](x, V[i-1]); });
  },

  // Returns the result of multiplying the elements of the vector by the argument
  multiply: function(k) {
    var fn = this._fn;
    return this.map(function(x) { return fn["*"](x, k); });
  },

  x: function(k) { return this.multiply(k); },

  // Returns the scalar product of the vector with the argument
  // Both vectors must have equal dimensionality
  dot: function(vector) {
    var V = vector.elements || vector;
    var i, product = 0, n = this.elements.length;
    if (n != V.length) { return null; }
    while (n--) { product = this._fn["+"](product, this._fn["*"](this.elements[n], V[n])); }
    return product;
  },

  // Returns the vector product of the vector with the argument
  // Both vectors must have dimensionality 3
  cross: function(vector) {
    var B = vector.elements || vector;
    if (this.elements.length != 3 || B.length != 3) { return null; }
    var A = this.elements;
    return Vector.create([
      this._fn["-"](this._fn["*"](A[1], B[2]), this._fn["*"](A[2], B[1])),
      this._fn["-"](this._fn["*"](A[2], B[0]), this._fn["*"](A[0], B[2])),
      this._fn["-"](this._fn["*"](A[0], B[1]), this._fn["*"](A[1], B[0]))
    ], this._fn);
  },

  // Returns the (absolute) largest element of the vector
  max: function() {
    var m = 0, i = this.elements.length;
    while (i--) {
      if (this._fn[">"](this._fn.abs(this.elements[i]), this._fn.abs(m))) {
        m = this.elements[i];
      }
    }
    return m;
  },

  // Returns the index of the first match found
  indexOf: function(x) {
    var index = null, n = this.elements.length;
    for (var i = 0; i < n; i++) {
      if (index === null && this._fn["="](this.elements[i], x)) {
        index = i + 1;
      }
    }
    return index;
  },

  // Returns a diagonal matrix with the vector's elements as its diagonal elements
  toDiagonalMatrix: function() {
    return Matrix.Diagonal(this.elements, this._fn);
  },

  // Returns the result of rounding the elements of the vector
  round: function() {
    var fn = this._fn;
    return this.map(function(x) { return fn.round(x); });
  },

  // Returns a copy of the vector with elements set to the given value if they
  // differ from it by less than Sylvester.precision
  snapTo: function(x) {
    return this.map(function(y) {
      return (Math.abs(y - x) <= Sylvester.precision) ? x : y; // XXX: FIXME.
    });
  },

  // Returns the vector's distance from the argument, when considered as a point in space
  distanceFrom: function(obj) {
    if (obj.anchor || (obj.start && obj.end)) { return obj.distanceFrom(this); }
    var V = obj.elements || obj;
    if (V.length != this.elements.length) { return null; }
    var sum = 0, part;
    var fn = this._fn;
    this.each(function(x, i) {
      part = fn["-"](x, V[i-1]);
      sum = fn["+"](sum, fn["*"](part, part));
    });
    return fn.sqrt(sum);
  },

  // Returns true if the vector is point on the given line
  liesOn: function(line) {
    return line.contains(this);
  },

  // Return true iff the vector is a point in the given plane
  liesIn: function(plane) {
    return plane.contains(this);
  },

  // Rotates the vector about the given object. The object should be a 
  // point if the vector is 2D, and a line if it is 3D. Be careful with line directions!
  rotate: function(t, obj) {
    var fn = this._fn;
    var V, R = null, x, y, z;
    if (t.determinant) { R = t.elements; }
    switch (this.elements.length) {
      case 2:
        V = obj.elements || obj;
        if (V.length != 2) { return null; }
        if (!R) { R = Matrix.Rotation(t).elements; }
        x = fn["-"](this.elements[0], V[0]);
        y = fn["-"](this.elements[1], V[1]);
        return Vector.create([
          fn["+"](fn["+"](V[0], fn["*"](R[0][0], x)), fn["*"](R[0][1], y)),
          fn["+"](fn["+"](V[1], fn["*"](R[1][0], x)), fn["*"](R[1][1], y))
        ], fn);
        break;
      case 3:
        if (!obj.direction) { return null; }
        var C = obj.pointClosestTo(this).elements;
        if (!R) { R = Matrix.Rotation(t, obj.direction).elements; }
        x = fn["-"](this.elements[0], C[0]);
        y = fn["-"](this.elements[1], C[1]);
        z = fn["-"](this.elements[2], C[2]);
        return Vector.create([
          fn["+"](fn["+"](C[0], fn["*"](R[0][0], x)),
                  fn["+"](fn["*"](R[0][1], y), fn["*"](R[0][2], z))),
          fn["+"](fn["+"](C[1], fn["*"](R[1][0], x)),
                  fn["+"](fn["*"](R[1][1], y), fn["*"](R[1][2], z))),
          fn["+"](fn["+"](C[2], fn["*"](R[2][0], x)),
                  fn["+"](fn["*"](R[2][1], y), fn["*"](R[2][2], z)))
        ], fn);
        break;
      default:
        return null;
    }
  },

  // Returns the result of reflecting the point in the given point, line or plane
  reflectionIn: function(obj) {
    var fn = this._fn;
    if (obj.anchor) {
      // obj is a plane or line
      var P = this.elements.slice();
      var C = obj.pointClosestTo(P).elements;
      return Vector.create([fn["+"](C[0], fn["-"](C[0], P[0])),
                            fn["+"](C[1], fn["-"](C[1], P[1])),
                            fn["+"](C[2], fn["-"](C[2], (P[2] || fn.ZERO)))]);
    } else {
      // obj is a point
      var Q = obj.elements || obj;
      if (this.elements.length != Q.length) { return null; }
      return this.map(function(x, i) { return fn["+"](Q[i-1], fn["-"](Q[i-1], x)); });
    }
  },

  // Utility to make sure vectors are 3D. If they are 2D, a zero z-component is added
  to3D: function() {
    var V = this.dup();
    switch (V.elements.length) {
      case 3: break;
      case 2: V.elements.push(this._fn.ZERO); break;
      default: return null;
    }
    return V;
  },

  // Returns a string representation of the vector
  inspect: function() {
    return '[' + this.elements.join(', ') + ']';
  },

  // Set vector's elements from an array
  setElements: function(els) {
    this.elements = (els.elements || els).slice();
    return this;
  }
};

// Constructor function
Vector.create = function(elements, fn) {
  var V = new Vector();
  if (fn) { V._fn = fn; }
  return V.setElements(elements);
};
var $V = Vector.create;

// i, j, k unit vectors
Vector.i = Vector.create([1,0,0]);
Vector.j = Vector.create([0,1,0]);
Vector.k = Vector.create([0,0,1]);

// Random vector of size n
Vector.Random = function(n, fn) {
  var elements = [];
  if (!fn) { fn = Vector.prototype._fn; }
  while (n--) { elements.push(fn.random(fn.F_ONE)); }
  return Vector.create(elements, fn);
};

// Vector filled with zeros
Vector.Zero = function(n, fn) {
  var elements = [];
  if (!fn) { fn = Vector.prototype._fn; }
  while (n--) { elements.push(fn.ZERO); }
  return Vector.create(elements, fn);
};
