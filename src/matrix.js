// Matrix class - depends on Vector.

function Matrix() {}
Matrix.prototype = {

  // The internal _fn object holds various arithmetic functions that
  // know how to deal with whatever object type the user has chosen to
  // fill matrices with.
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

    // Returns true if x is larger that y
    ">": function(x, y) { return x > y; },

    // Returns the absolute value of x
    abs: Math.abs,

    // Returns true if x is zero
    "zero?": function(x) { return x == 0; },

    // Returns the closest integer to x
    round: Math.round,

    // Returns the sine of x
    sin: Math.sin,

    // Return the cosine of x
    cos: Math.cos,

    // Returns a random number within the interval [0, limit[
    random: function(limit) { return Math.floor(Math.random() * limit); }
  },

  // Returns element (i,j) of the matrix
  e: function(i,j) {
    if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length) { return null; }
    return this.elements[i-1][j-1];
  },

  // Returns row k of the matrix as a vector
  row: function(i) {
    if (i > this.elements.length) { return null; }
    return Vector.create(this.elements[i-1]);
  },

  // Returns column k of the matrix as a vector
  col: function(j) {
    if (j > this.elements[0].length) { return null; }
    var col = [], n = this.elements.length;
    for (var i = 0; i < n; i++) { col.push(this.elements[i][j-1]); }
    return Vector.create(col);
  },

  // Returns the number of rows/columns the matrix has
  dimensions: function() {
    return {rows: this.elements.length, cols: this.elements[0].length};
  },

  // Returns the number of rows in the matrix
  rows: function() {
    return this.elements.length;
  },

  // Returns the number of columns in the matrix
  cols: function() {
    return this.elements[0].length;
  },

  // Returns true iff the matrix is equal to the argument. You can supply
  // a vector as the argument, in which case the receiver must be a
  // one-column matrix equal to the vector.
  eql: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M, this._fn).elements; }
    if (this.elements.length != M.length ||
        this.elements[0].length != M[0].length) { return false; }
    var i = this.elements.length, nj = this.elements[0].length, j;
    while (i--) { j = nj;
      while (j--) {
        if (!this._fn["="](this.elements[i][j], M[i][j])) { return false; }
      }
    }
    return true;
  },

  // Returns a copy of the matrix
  dup: function() {
    return Matrix.create(this.elements, this._fn);
  },

  // Maps the matrix to another matrix (of the same dimensions) according to the given function
  map: function(fn) {
    var els = [], i = this.elements.length, nj = this.elements[0].length, j;
    while (i--) { j = nj;
      els[i] = [];
      while (j--) {
        els[i][j] = fn(this.elements[i][j], i + 1, j + 1);
      }
    }
    return Matrix.create(els, this._fn);
  },

  // Returns true iff the argument has the same dimensions as the matrix
  isSameSizeAs: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M, this._fn).elements; }
    return (this.elements.length == M.length &&
        this.elements[0].length == M[0].length);
  },

  // Returns the result of adding the argument to the matrix
  add: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M, this._fn).elements; }
    if (!this.isSameSizeAs(M)) { return null; }
    var fn = this._fn;
    return this.map(function(x, i, j) { return fn["+"](x, M[i-1][j-1]); });
  },

  // Returns the result of subtracting the argument from the matrix
  subtract: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M, this._fn).elements; }
    if (!this.isSameSizeAs(M)) { return null; }
    var fn = this._fn;
    return this.map(function(x, i, j) { return fn["-"](x, M[i-1][j-1]); });
  },

  // Returns true iff the matrix can multiply the argument from the left
  canMultiplyFromLeft: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M, this._fn).elements; }
    // this.columns should equal matrix.rows
    return (this.elements[0].length == M.length);
  },

  // Returns the result of multiplying the matrix from the right by the argument.
  // If the argument is a scalar then just multiply all the elements. If the argument is
  // a vector, a vector is returned, which saves you having to remember calling
  // col(1) on the result.
  multiply: function(matrix) {
    if (!matrix.elements) {
      return this.map(function(x) { return x * matrix; });
    }
    var returnVector = matrix.modulus ? true : false;
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M, this._fn).elements; }
    if (!this.canMultiplyFromLeft(M)) { return null; }
    var i = this.elements.length, nj = M[0].length, j;
    var cols = this.elements[0].length, c, elements = [], sum;
    while (i--) { j = nj;
      elements[i] = [];
      while (j--) {
        c = cols;
        sum = this._fn["+"]();
        while (c--) {
          sum = this._fn["+"](sum, this._fn["*"](this.elements[i][c], M[c][j]));
        }
        elements[i][j] = sum;
      }
    }
    var M = Matrix.create(elements, this._fn);
    return returnVector ? M.col(1) : M;
  },

  x: function(matrix) { return this.multiply(matrix); },

  // Returns a submatrix taken from the matrix
  // Argument order is: start row, start col, nrows, ncols
  // Element selection wraps if the required index is outside the matrix's bounds, so you could
  // use this to perform row/column cycling or copy-augmenting.
  minor: function(a, b, c, d) {
    var elements = [], ni = c, i, nj, j;
    var rows = this.elements.length, cols = this.elements[0].length;
    while (ni--) {
      i = c - ni - 1;
      elements[i] = [];
      nj = d;
      while (nj--) {
        j = d - nj - 1;
        elements[i][j] = this.elements[(a+i-1)%rows][(b+j-1)%cols];
      }
    }
    return Matrix.create(elements, this._fn);
  },

  // Returns the transpose of the matrix
  transpose: function() {
    var rows = this.elements.length, i, cols = this.elements[0].length, j;
    var elements = [], i = cols;
    while (i--) { j = rows;
      elements[i] = [];
      while (j--) {
        elements[i][j] = this.elements[j][i];
      }
    }
    return Matrix.create(elements, this._fn);
  },

  // Returns true iff the matrix is square
  isSquare: function() {
    return (this.elements.length == this.elements[0].length);
  },

  // Returns the (absolute) largest element of the matrix
  max: function() {
    var m = 0, i = this.elements.length, nj = this.elements[0].length, j;
    while (i--) { j = nj;
      while (j--) {
        if (this._fn[">"](this._fn.abs(this.elements[i][j]), this._fn.abs(m))) {
          m = this.elements[i][j];
        }
      }
    }
    return m;
  },

  // Returns the indeces of the first match found by reading row-by-row from left to right
  indexOf: function(x) {
    var index = null, ni = this.elements.length, i, nj = this.elements[0].length, j;
    for (i = 0; i < ni; i++) {
      for (j = 0; j < nj; j++) {
        // XXX: this comparision used to disregard
        // Sylvester.precision. To be review.
        if (this._fn["="](this.elements[i][j], x)) { return {i: i+1, j: j+1}; }
      }
    }
    return null;
  },

  // If the matrix is square, returns the diagonal elements as a vector.
  // Otherwise, returns null.
  diagonal: function() {
    if (!this.isSquare) { return null; }
    var els = [], n = this.elements.length;
    for (var i = 0; i < n; i++) {
      els.push(this.elements[i][i]);
    }
    return Vector.create(els);
  },

  // Make the matrix upper (right) triangular by Gaussian elimination.
  // This method only adds multiples of rows to other rows. No rows are
  // scaled up or switched, and the determinant is preserved.
  toRightTriangular: function() {
    var M = this.dup(), els;
    var n = this.elements.length, i, j, np = this.elements[0].length, p;
    for (i = 0; i < n; i++) {
      if (this._fn["zero?"](M.elements[i][i])) {
        for (j = i + 1; j < n; j++) {
          if (!this._fn["zero?"](M.elements[j][i])) {
            els = [];
            for (p = 0; p < np; p++) { els.push(this._fn["+"](M.elements[i][p], M.elements[j][p])); }
            M.elements[i] = els;
            break;
          }
        }
      }
      if (!this._fn["zero?"](M.elements[i][i])) {
        for (j = i + 1; j < n; j++) {
          var multiplier = this._fn["/"](M.elements[j][i], M.elements[i][i]);
          els = [];
          for (p = 0; p < np; p++) {
            // Elements with column numbers up to an including the number
            // of the row that we're subtracting can safely be set straight to
            // zero, since that's the point of this routine and it avoids having
            // to loop over and correct rounding errors later
            els.push(p <= i ? 0 : this._fn["-"](M.elements[j][p], this._fn["*"](M.elements[i][p], multiplier)));
          }
          M.elements[j] = els;
        }
      }
    }
    return M;
  },

  toUpperTriangular: function() { return this.toRightTriangular(); },

  // Returns the determinant for square matrices
  determinant: function() {
    if (!this.isSquare()) { return null; }
    var M = this.toRightTriangular();
    var det = M.elements[0][0], n = M.elements.length;
    for (var i = 1; i < n; i++) {
      det = this._fn["*"](det, M.elements[i][i]);
    }
    return det;
  },

  det: function() { return this.determinant(); },

  // Returns true iff the matrix is singular
  isSingular: function() {
    return (this.isSquare() && this.determinant() === 0);
  },

  // Returns the trace for square matrices
  trace: function() {
    if (!this.isSquare()) { return null; }
    var tr = this.elements[0][0], n = this.elements.length;
    for (var i = 1; i < n; i++) {
      tr = this._fn["+"](tr, this.elements[i][i]);
    }
    return tr;
  },

  tr: function() { return this.trace(); },

  // Returns the rank of the matrix
  rank: function() {
    var M = this.toRightTriangular(), rank = 0;
    var i = this.elements.length, nj = this.elements[0].length, j;
    while (i--) { j = nj;
      while (j--) {
        // XXX: not using _fn["zero?"] to maintain backward
        // compatibility.
        if (this._fn["="](this._fn["+"](), M.elements[i][j])) { rank++; break; }
      }
    }
    return rank;
  },

  rk: function() { return this.rank(); },

  // Returns the result of attaching the given argument to the right-hand side of the matrix
  augment: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M, this._fn).elements; }
    var T = this.dup(), cols = T.elements[0].length;
    var i = T.elements.length, nj = M[0].length, j;
    if (i != M.length) { return null; }
    while (i--) { j = nj;
      while (j--) {
        T.elements[i][cols + j] = M[i][j];
      }
    }
    return T;
  },

  // Returns the inverse (if one exists) using Gauss-Jordan
  inverse: function() {
    if (!this.isSquare() || this.isSingular()) { return null; }
    var n = this.elements.length, i= n, j;
    var M = this.augment(Matrix.I(n)).toRightTriangular();
    var np = M.elements[0].length, p, els, divisor;
    var inverse_elements = [], new_element;
    // Matrix is non-singular so there will be no zeros on the diagonal
    // Cycle through rows from last to first
    while (i--) {
      // First, normalise diagonal elements to 1
      els = [];
      inverse_elements[i] = [];
      divisor = M.elements[i][i];
      for (p = 0; p < np; p++) {
        new_element = this._fn["/"](M.elements[i][p], divisor);
        els.push(new_element);
        // Shuffle off the current row of the right hand side into the results
        // array as it will not be modified by later runs through this loop
        if (p >= n) { inverse_elements[i].push(new_element); }
      }
      M.elements[i] = els;
      // Then, subtract this row from those above it to
      // give the identity matrix on the left hand side
      j = i;
      while (j--) {
        els = [];
        for (p = 0; p < np; p++) {
          els.push(this._fn["-"](M.elements[j][p], this._fn["*"](M.elements[i][p], M.elements[j][i])));
        }
        M.elements[j] = els;
      }
    }
    return Matrix.create(inverse_elements, this._fn);
  },

  inv: function() { return this.inverse(); },

  // Returns the result of rounding all the elements
  round: function() {
    return this.map(this._fn.round);
  },

  // Returns a copy of the matrix with elements set to the given value if they
  // differ from it by less than Sylvester.precision
  snapTo: function(x) {
    return this.map(function(p) {
      return (this._fn.abs(this._fn["-"](p, x)) <= Sylvester.precision) ? x : p;
    });
  },

  // Returns a string representation of the matrix
  inspect: function() {
    var matrix_rows = [];
    var n = this.elements.length;
    for (var i = 0; i < n; i++) {
      matrix_rows.push(Vector.create(this.elements[i]).inspect());
    }
    return matrix_rows.join('\n');
  },

  // Set the matrix's elements from an array. If the argument passed
  // is a vector, the resulting matrix will be a single column.
  setElements: function(els) {
    var i, j, elements = els.elements || els;
    if (typeof(elements[0][0]) != 'undefined') {
      i = elements.length;
      this.elements = [];
      while (i--) { j = elements[i].length;
        this.elements[i] = [];
        while (j--) {
          this.elements[i][j] = elements[i][j];
        }
      }
      return this;
    }
    var n = elements.length;
    this.elements = [];
    for (i = 0; i < n; i++) {
      this.elements.push([elements[i]]);
    }
    return this;
  }
};

// Constructor function
Matrix.create = function(elements, fn) {
  var M = new Matrix();
  if (fn) {
    M._fn = fn;
  }
  return M.setElements(elements);
};
var $M = Matrix.create;

// Identity matrix of size n
Matrix.I = function(n, fn) {
  var _fn = fn ? fn : Matrix.prototype._fn;
  var els = [], i = n, j;
  var one = _fn["*"](), zero = _fn["+"]();
  while (i--) { j = n;
    els[i] = [];
    while (j--) {
      els[i][j] = (i == j) ? one : zero;
    }
  }
  return Matrix.create(els, _fn);
};

// Diagonal matrix - all off-diagonal elements are zero
Matrix.Diagonal = function(elements) {
  var i = elements.length;
  var M = Matrix.I(i);
  while (i--) {
    M.elements[i][i] = elements[i];
  }
  return M;
};

// Rotation matrix about some axis. If no axis is
// supplied, assume we're after a 2D transform
Matrix.Rotation = function(theta, a, fn) {
  var _fn = fn ? fn : Matrix.prototype._fn;
  if (!a) {
    return Matrix.create([
      [_fn.cos(theta),  _fn["-"](_fn.sin(theta))],
      [_fn.sin(theta),  _fn.cos(theta)]
    ], _fn);
  }
  var axis = a.dup();
  if (axis.elements.length != 3) { return null; }
  var mod = axis.modulus();
  var x = _fn["/"](axis.elements[0], mod),
      y = _fn["/"](axis.elements[1], mod),
      z = _fn["/"](axis.elements[2], mod);
  var s = _fn.sin(theta), c = _fn.cos(theta), t = _fn["-"](_fn["*"](), c);
  // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
  // That proof rotates the co-ordinate system so theta
  // becomes -theta and sin becomes -sin here.
  return Matrix.create([
    [ _fn["+"](_fn["*"](t, _fn["*"](x, x)), c),
      _fn["-"](_fn["*"](t, _fn["*"](x, y)), _fn["*"](s, z)),
      _fn["+"](_fn["*"](t, _fn["*"](x, z)), _fn["*"](s, y)) ],
    [ _fn["+"](_fn["*"](t, _fn["*"](x, y)), _fn["*"](s, z)),
      _fn["+"](_fn["*"](t, _fn["*"](y, y)), c),
      _fn["-"](_fn["*"](t, _fn["*"](y, z)), _fn["*"](s, x)) ],
    [ _fn["-"](_fn["*"](t, _fn["*"](x, z)), _fn["*"](s, y)),
      _fn["+"](_fn["*"](t, _fn["*"](y, z)), _fn["*"](s, x)),
      _fn["+"](_fn["*"](t, _fn["*"](z, z)), c) ]
  ], _fn);
};

// Special case rotations
Matrix.RotationX = function(t, fn) {
  var _fn = fn ? fn : Matrix.prototype._fn;
  var c = _fn.cos(t), s = _fn.sin(t);
  var zero = _fn["+"](), one = _fn["*"]();
  return Matrix.create([
    [  one,   zero,  zero ],
    [  zero,  c,     _fn["-"](s) ],
    [  zero,  s,     c ]
  ], _fn);
};
Matrix.RotationY = function(t, fn) {
  var _fn = fn ? fn : Matrix.prototype._fn;
  var c = _fn.cos(t), s = _fn.sin(t);
  var zero = _fn["+"](), one = _fn["*"]();
  return Matrix.create([
    [  c,           zero,  s ],
    [  zero,        one,   zero ],
    [ _fn["-"](s),  zero,  c ]
  ], _fn);
};
Matrix.RotationZ = function(t) {
  var _fn = fn ? fn : Matrix.prototype._fn;
  var c = _fn.cos(t), s = _fn.sin(t);
  var zero = _fn["+"](), one = _fn["*"]();
  return Matrix.create([
    [  c,     _fn["-"](s),  zero ],
    [  s,     c,            zero ],
    [  zero,  zero,         one ]
  ], _fn);
};

// Random matrix of n rows, m columns
Matrix.Random = function(n, m, fn) {
  var _fn = fn ? fn : Matrix.prototype._fn;
  return Matrix.Zero(n, m, _fn).map(
    function() { return _fn.random(1.0); }
  );
};

// Matrix filled with zeros
Matrix.Zero = function(n, m, fn) {
  var _fn = fn ? fn : Matrix.prototype._fn;
  var els = [], i = n, j;
  var zero = _fn["+"]();
  while (i--) { j = m;
    els[i] = [];
    while (j--) {
      els[i][j] = zero;
    }
  }
  return Matrix.create(els, _fn);
};
