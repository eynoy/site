class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(other) {
    this.x += other.x;
    this.y += other.y;
  }
  addO(x, y) {
    this.x += x;
    this.y += y;
  }
  mult(num) {
    this.x *= num;
    this.y *= num;
  }
  div(num) {
    return new Vector(this.x/num, this.y/num);
  }
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalize() {
    this.mult(1/this.mag());
  }
  setMag(num) {
    this.normalize();
    this.mult(num);
  }
  draw(px, py, size, color) {
    drawScreen.arrow(px, py, px + size * this.x, py + size * this.y, color);
  }
  static fromAngle(theta, mag) {
    return new Vector(mag * Math.cos(theta), mag * Math.sin(theta));
  }
}