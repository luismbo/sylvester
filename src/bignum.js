var SMatrix = {
  create: function(elements) { return Matrix.create(elements, SN.fn); },
  I: function(n) { return Matrix.I(elements, SN.fn); },
  Diagonal: function(elements) { return Matrix.Diagonal(elements, SN.fn); },
  Rotation: function(theta, a) { return Matrix.Rotation(theta, a, SN.fn); },
  RotationX: function(t) { return Matrix.RotationX(t, SN.fn); },
  RotationY: function(t) { return Matrix.RotationY(t, SN.fn); },
  RotationZ: function(t) { return Matrix.RotationZ(t, SN.fn); },
  Random: function(n, m) { return Matrix.Random(n, m, SN.fn); },
  Zero: function(n, m) { return Matrix.Zero(n, m, SN.fn); }
};

var $SM = SMatrix.create;