class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(other) {
    this.x += other.x;
    this.y += other.y;
  }
  sub(other) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }
  mult(other) {
    return new Vector2D(this.x * other, this.y * other);
  }
  div(num) {
    this.x /= num;
    this.y /= num;
  }
  equals(other) {
    return this.x == other.x && this.y == other.y;
  }
  copy() {
    return new Vector2D(this.x, this.y);
  }
  static random2D() {
    const randAngle = 2 * Math.PI * Math.random();
    return new Vector2D(Math.cos(randAngle), Math.sin(randAngle));
  }
}

class Vector3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  add(other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }
  sub(other) {
    return new Vector3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  mult(other) {
    return new Vector3D(this.x * other, this.y * other, this.z * other);
  }
  div(num) {
    this.x /= num;
    this.y /= num;
    this.z /= num;
  }
  equals(other) {
    return this.x == other.x && this.y == other.y && this.z == other.z;
  }
  copy() {
    return new Vector3D(this.x, this.y, this.z);
  }
}

const boxVertices = [
  // X, Y, Z           u,  w     <px,py,pz>
  // Top
  -1.0, 1.0, -1.0,   0.0,  1.0,   0, 1, 0,
  -1.0, 1.0, 1.0,    0.0,  0.0,   0, 1, 0,
  1.0, 1.0, 1.0,     1.0,  0.0,   0, 1, 0,

  1.0, 1.0, 1.0,     1.0,  0.0,   0, 1, 0,
  1.0, 1.0, -1.0,    1.0,  1.0,   0, 1, 0,
  -1.0, 1.0, -1.0,   0.0,  1.0,   0, 1, 0,

  // Left
  -1.0, 1.0, 1.0,    1.0,  1.0,   -1, 0, 0,
  -1.0, -1.0, -1.0,  0.0,  0.0,   -1, 0, 0,
  -1.0, -1.0, 1.0,   0.0,  1.0,   -1, 0, 0,

  -1.0, -1.0, -1.0,  0.0,  0.0,   -1, 0, 0,
  -1.0, 1.0, 1.0,    1.0,  1.0,   -1, 0, 0,
  -1.0, 1.0, -1.0,   1.0,  0.0,   -1, 0, 0,

  // Right
  1.0, 1.0, 1.0,     1.0,  0.0,   1, 0, 0,
  1.0, -1.0, 1.0,    0.0,  0.0,   1, 0, 0,
  1.0, -1.0, -1.0,   0.0,  1.0,   1, 0, 0,

  1.0, -1.0, -1.0,   0.0,  1.0,   1, 0, 0,
  1.0, 1.0, -1.0,    1.0,  1.0,   1, 0, 0,
  1.0, 1.0, 1.0,     1.0,  0.0,   1, 0, 0,

  // Front
  1.0, 1.0, 1.0,     1.0,  0.0,   0, 0, 1,
  -1.0, -1.0, 1.0,   0.0,  1.0,   0, 0, 1,
  1.0, -1.0, 1.0,    1.0,  1.0,   0, 0, 1,

  -1.0, -1.0, 1.0,   0.0,  1.0,   0, 0, 1,
  1.0, 1.0, 1.0,     1.0,  0.0,   0, 0, 1,
  -1.0, 1.0, 1.0,    0.0,  0.0,   0, 0, 1,

  // Back
  1.0, 1.0, -1.0,    1.0,  1.0,   0, 0, -1,
  1.0, -1.0, -1.0,   1.0,  0.0,   0, 0, -1,
  -1.0, -1.0, -1.0,  0.0,  0.0,   0, 0, -1,

  -1.0, -1.0, -1.0,  0.0,  0.0,   0, 0, -1,
  -1.0, 1.0, -1.0,   0.0,  1.0,   0, 0, -1,
  1.0, 1.0, -1.0,    1.0,  1.0,   0, 0, -1,

  // Bottom
  -1.0, -1.0, -1.0,  0.0,  1.0,   0, -1, 0,
  1.0, -1.0, 1.0,    1.0,  0.0,   0, -1, 0,
  -1.0, -1.0, 1.0,   0.0,  0.0,    0, -1, 0,

  1.0, -1.0, 1.0,    1.0,  0.0,   0, -1, 0,
  -1.0, -1.0, -1.0,  0.0,  1.0,   0, -1, 0,
  1.0, -1.0, -1.0,   0.0,  0.0,   0, -1, 0,
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}