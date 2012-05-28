var SMatrix, SVector;

(function() {
  var fn = {
    "=": SN.fn["="],
    "+": SN.fn["+"],
    "-": SN.fn["-"],
    "*": SN.fn["*"],
    "/": SN.fn["/"],
    ">": SN.fn[">"],
    ">=": SN.fn[">="],
    "<": SN.fn["<"],
    "<=": SN.fn["<="],
    abs: SN.fn.abs,
    "zero?": SN.fn["zero?"],
    "positive?": SN.fn["positive?"],
    round: SN.fn.round,
    sin: SN.fn.sin,
    cos: SN.fn.cos,
    acos: SN.fn.acos,
    asin: SN.fn.asin,
    random: SN.fn.random,
    sqrt: SN.fn.sqrt,
    PI: SN.PI,
    ZERO: SN(0),
    F_ZERO: SN(0),
    ONE: SN(1),
    F_ONE: SN(1)
  }

  SMatrix = {
    create: function(elements) { return Matrix.create(elements, fn); },
    I: function(n) { return Matrix.I(elements, fn); },
    Diagonal: function(elements) { return Matrix.Diagonal(elements, fn); },
    Rotation: function(theta, a) { return Matrix.Rotation(theta, a, fn); },
    RotationX: function(t) { return Matrix.RotationX(t, fn); },
    RotationY: function(t) { return Matrix.RotationY(t, fn); },
    RotationZ: function(t) { return Matrix.RotationZ(t, fn); },
    Random: function(n, m) { return Matrix.Random(n, m, fn); },
    Zero: function(n, m) { return Matrix.Zero(n, m, fn); }
  };

  SVector = {
    create: function(elements) { return Vector.create(elements, fn); },
    i: $SV([fn.ONE,  fn.ZERO, fn.ZERO]),
    j: $SV([fn.ZERO, fn.ONE,  fn.ZERO]),
    k: $SV([fn.ZERO, fn.ZERO, fn.ONE]),
    Random: function(n) { return Vector.Random(n, fn); },
    Zero: function(n) { return Vector.Zero(n, fn); }
  }
})();

var $SM = SMatrix.create;
var $SV = SVector.create;
