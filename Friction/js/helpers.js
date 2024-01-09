const colors = ["#2364AA", "#3DA5D9", "#73BFB8", "#FEC601", "#EA7317"];

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(other) {
    this.x += other.x;
    this.y += other.y;
  }
  sub(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }
  mult(num) {
    this.x *= num;
    this.y *= num;
  }
  div(num) {
    return new Vector(this.x / num, this.y / num);
  }
  normalize() {
    this.mult(1/this.mag());
  }
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  copy() {
    return new Vector(this.x, this.y);
  }
}

class Loop {
  constructor() {
    this.points = [];
  }
  draw() {
    drawScreen.ctx.strokeStyle = "Red";
    for (let i = 1; i < this.points.length; i++) {
      drawScreen.drawLine(this.points[i-1].x, this.points[i-1].y, this.points[i].x, this.points[i].y);
    }
    drawScreen.ctx.strokeStyle = "Black";
  }
  add(point) {
    this.points.push(point);
  }
}

const mp = (n, start1, stop1, start2, stop2) => {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

const toDegrees = (rad) => rad * 180 / Math.PI;

//https://www.html5rocks.com/en/tutorials/canvas/hidpi/#toc-1
const setupCanvas = (canvas) => {
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  const rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  let ctx = canvas.getContext('2d');
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);

  //Scale it down so it fits
  canvas.style = "zoom: " + (1/dpr) + ";";
  return ctx;
}