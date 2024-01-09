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
}

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

Math.toRadians = (num) => {
  return num * Math.PI / 180;
};

Math.toDegrees = (num) => {
  return num * 180 / Math.PI;
};

const traceColor = "Red";
class Loop {
  constructor() {
    this.points = [];
  }
  draw() {
    drawScreen.ctx.strokeStyle = traceColor;
    for (let i = 1; i < this.points.length; i++) {
      drawScreen.drawLineP(this.points[i-1], this.points[i]);
    }
    drawScreen.ctx.strokeStyle = "Black";
  }
  add(point) {
    this.points.push(new Vector(point.x, point.y));
  }
}

const digits = (num) => Math.floor(Math.log10(num)) + 1;

class Section {
  constructor(rect, funct, resetFunct) {
    this.playing = false;
    this.rect = rect;
    if (this.rect.y === 505) this.resetRect = new Rect(this.rect.x + 120, this.rect.y + 5, 62, 62);
    else this.resetRect = new Rect(this.rect.x + 5, this.rect.y + 5, 62, 62);
    this.funct = funct;
    this.over = false;
    this.resetFunct = resetFunct;
  }
  play() {
    if (this.funct(this.playing)) {
      this.over = true;

      drawScreen.ctx.globalAlpha = 0.9;
      drawScreen.ctx.fillStyle = "rgba(150, 150, 150, 0.9)"
      drawScreen.fillRects(this.resetRect);

      drawScreen.ctx.fillStyle = "Black"
      drawScreen.ctx.globalAlpha = 1;

      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(this.resetRect.x, this.resetRect.y, this.resetRect.w, this.resetRect.h);
      drawScreen.ctx.stroke();

      drawScreen.ctx.font = "18px Arial";
      drawScreen.ctx.fillText("Reset", this.resetRect.x + this.resetRect.w / 8, this.resetRect.y + this.resetRect.h * 7 / 12);
      drawScreen.ctx.font = "10px sans-serif";
    }

    if (!this.playing) {
      drawScreen.ctx.globalAlpha = 0.9;
      drawScreen.ctx.fillStyle = "rgba(150, 150, 150, 0.9)"
      drawScreen.fillRects(this.rect);

      drawScreen.ctx.fillStyle = "Black"
      drawScreen.ctx.globalAlpha = 1;

      const centerX = this.rect.x + this.rect.w / 2;
      const centerY = this.rect.y + this.rect.h / 2;
      drawScreen.fillTriangle(centerX - 10, centerY - 10, centerX + 10, centerY, centerX - 10, centerY + 10);
    }
  }
  reset() {
    this.over = false;
    this.resetFunct();
  }
}

const isPointWithinRect = (x, y, rect) => {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}