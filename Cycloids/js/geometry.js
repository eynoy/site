class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const fillCircle = (x, y, r) => {
  drawScreen.ctx.beginPath();
  drawScreen.ctx.arc(x, y, r, 0, 2 * Math.PI);
  drawScreen.ctx.fill();
};

class Circle {
  constructor(center, radius, nowPoint) {
    this.center = center;
    this.radius = radius;
    this.nowPoint = nowPoint;
  }
  x(theta) {
    return this.radius * Math.cos(theta) + this.center.x;
  }
  y(theta) {
    return this.radius * Math.sin(theta) + this.center.y;
  }
  draw() {
    drawScreen.ctx.beginPath();
    drawScreen.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    drawScreen.ctx.stroke();
  }
  fill() {
    drawScreen.ctx.beginPath();
    drawScreen.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    drawScreen.ctx.fill();
  }
}

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
    this.points.push(point);
  }
}

class EpicycloidSystem {
  constructor(bigRad, factor, centerPoint, speed) {
    this.factor = factor;
    this.centerPoint = centerPoint;
    this.ratio = 1/factor;
    this.epiBigCircle = new Circle(centerPoint, bigRad, 0);
    this.epiSmallCircle = new Circle(new Point(centerPoint.x + bigRad * this.ratio, centerPoint.y), bigRad * this.ratio, Math.PI);
    this.epiLoop = new Loop();
    this.epiSpeed = speed;
  }
  loop() {
    this.epiLoop.draw();
  
    this.epiBigCircle.draw();

    this.epiBigCircle.nowPoint += this.epiSpeed / this.epiBigCircle.radius;

    this.epiSmallCircle.center.x = (this.epiBigCircle.radius + this.epiSmallCircle.radius) * Math.cos(this.epiBigCircle.nowPoint) + this.epiBigCircle.center.x;
    this.epiSmallCircle.center.y = (this.epiBigCircle.radius + this.epiSmallCircle.radius) * Math.sin(this.epiBigCircle.nowPoint) + this.epiBigCircle.center.y;

    this.epiSmallCircle.draw();

    this.epiSmallCircle.nowPoint += this.epiSpeed * (1 + this.ratio) / this.epiSmallCircle.radius;

    const currentPoint = new Point(this.epiSmallCircle.x(this.epiSmallCircle.nowPoint), this.epiSmallCircle.y(this.epiSmallCircle.nowPoint));

    this.epiLoop.add(currentPoint);

    drawScreen.drawLineP(this.epiSmallCircle.center, currentPoint);
    fillCircle(currentPoint.x, currentPoint.y, 5 * this.ratio);
    

    if (showLabels) drawScreen.ctx.fillText("1 : " + this.factor, this.centerPoint.x - this.epiBigCircle.radius/3, this.centerPoint.y + this.epiBigCircle.radius/6);
    
    if (this.epiBigCircle.nowPoint >= Math.PI * 2) {
      this.epiBigCircle.nowPoint = 0;
      this.epiSmallCircle.nowPoint = Math.PI;
      this.epiLoop.points.length = 0;
    }
  }
}

class HypocycloidSystem {
  constructor(bigRad, factor, centerPoint, speed) {
    this.factor = factor;
    this.centerPoint = centerPoint;
    this.ratio = 1/factor;
    this.hypoBigCircle = new Circle(centerPoint, bigRad, 0);
    this.hypoSmallCircle = new Circle(new Point(centerPoint.x + bigRad * this.ratio, centerPoint.y), bigRad * this.ratio, 0);
    this.hypoLoop = new Loop();
    this.hypoSpeed = speed;
  }
  loop() {
    this.hypoLoop.draw();
  
    this.hypoBigCircle.draw();

    this.hypoBigCircle.nowPoint += this.hypoSpeed / this.hypoBigCircle.radius;

    this.hypoSmallCircle.center.x = (this.hypoBigCircle.radius - this.hypoSmallCircle.radius) * Math.cos(this.hypoBigCircle.nowPoint) + this.hypoBigCircle.center.x;
    this.hypoSmallCircle.center.y = (this.hypoBigCircle.radius - this.hypoSmallCircle.radius) * Math.sin(this.hypoBigCircle.nowPoint) + this.hypoBigCircle.center.y;

    this.hypoSmallCircle.draw();

    this.hypoSmallCircle.nowPoint -= this.hypoSpeed * (1 - this.ratio) / this.hypoSmallCircle.radius;

    const currentPoint = new Point(this.hypoSmallCircle.x(this.hypoSmallCircle.nowPoint), this.hypoSmallCircle.y(this.hypoSmallCircle.nowPoint));

    this.hypoLoop.add(currentPoint);

    drawScreen.drawLineP(this.hypoSmallCircle.center, currentPoint);
    fillCircle(currentPoint.x, currentPoint.y, 5 * this.ratio);
    

    if (showLabels) drawScreen.ctx.fillText("1 : " + this.factor, this.centerPoint.x - this.hypoBigCircle.radius/3, this.centerPoint.y - this.hypoBigCircle.radius - 10);
    
    if (this.hypoBigCircle.nowPoint >= Math.PI * 2) {
      this.hypoBigCircle.nowPoint = 0;
      this.hypoSmallCircle.nowPoint = 0;
      this.hypoLoop.points.length = 0;
    }
  }
}