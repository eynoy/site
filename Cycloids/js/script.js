let showLabels = false;
const traceColor = "Red";

document.body.addEventListener("keyup", (e) => {
  if (e.keyCode === 32) { //Space
    showLabels = !showLabels;

    const textNode = document.getElementsByClassName("srcing")[0];
    if (showLabels) textNode.style.visibility = "visible";
    else textNode.style.visibility = "hidden";
  }
});

const itterations = 2;
document.body.addEventListener("keypress", (e) => {
  if (e.key === "d") {
    for (let i = 0; i < itterations; i++) {
      demonCircle.nowPoint += speed / demonCircle.radius;
      demonCircle.center.x += speed;
    }
  }
  if (e.key === "a") {
    for (let i = 0; i < itterations; i++) {
      demonCircle.nowPoint -= speed / demonCircle.radius;
      demonCircle.center.x -= speed;
    }
  }
});

const x_derivation = new Image();
const y_derivation = new Image();

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
};

const drawScreen = {
  canvas: document.getElementById("drawScren"),
  start: function() {
    while (this.canvas === null) this.canvas = document.getElementById("drawScren");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = setupCanvas(this.canvas);

    this.ctx.fillStyle = "Black";
    this.ctx.strokeStyle = "Black";
    this.ctx.lineWidth = 1;

    x_derivation.onload = () => {
      y_derivation.onload = () => {
        this.interval = setInterval(mainLoop, 20);
      };
      y_derivation.src = "https://web.archive.org/web/20150321030743im_/http://jwilson.coe.uga.edu/EMAT6680Fa07/Gilbert/Assignment%2010/Gayle%26Greg-10_files/image046.png";
    };
    x_derivation.src = "https://web.archive.org/web/20150321031046im_/http://jwilson.coe.uga.edu/EMAT6680Fa07/Gilbert/Assignment%2010/Gayle%26Greg-10_files/image043.png";
  },
  drawLine: function(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  },
  drawLineP: function(point1, point2) {
    this.drawLine(point1.x, point1.y, point2.x, point2.y);
  },
  clear: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

//Normal at Top
const circle = new Circle(new Point(0, 50), 30, Math.PI/2);
const loop = new Loop();
const speed = 2;

//Derivation of Equations
const demonCircle = new Circle(new Point(0, 380), 200, Math.PI * 3 / 2);
const demonLoop = new Loop();

while (demonCircle.center.x - demonCircle.radius < window.innerWidth) {
  demonCircle.center.x += speed;
  demonCircle.nowPoint += speed / demonCircle.radius;
  const demonCurrentPoint = new Point(demonCircle.x(demonCircle.nowPoint), demonCircle.y(demonCircle.nowPoint));

  demonLoop.add(demonCurrentPoint);
}

demonCircle.center.x = 837;
demonCircle.nowPoint = 2.6107963267948837;

//Epicycloids for fun :)
const epicycloidList = [];
for (let i = 1; i <= 3; i++) {
  epicycloidList.push(new EpicycloidSystem(30, i, new Point(100 + 200 * (i-1), 700), 1));
}

const hypocycloidList = [];
for (let i = 2; i <= 5; i++) {
  hypocycloidList.push(new HypocycloidSystem(30, i, new Point(700 + 200 * (i-2), 700), 1));
}

const mainLoop = () => {
  drawScreen.clear();

  //Cycloid
  drawScreen.drawLine(0, circle.center.y + circle.radius, window.innerWidth, circle.center.y + circle.radius);

  loop.draw();

  circle.draw();

  const currentPoint = new Point(circle.x(circle.nowPoint), circle.y(circle.nowPoint));

  loop.add(currentPoint);

  drawScreen.drawLineP(circle.center, currentPoint);
  fillCircle(currentPoint.x, currentPoint.y, 5);

  circle.center.x += speed;
  circle.nowPoint += speed / circle.radius;

  if (circle.center.x >= window.innerWidth - 30) {
    circle.center.x = 0;
    circle.nowPoint = Math.PI/2;
    loop.points.length = 0;
  }

  //Cycloid Derivation
  drawScreen.ctx.strokeStyle = "Blue";
  drawScreen.drawLine(0, demonCircle.center.y + demonCircle.radius, window.innerWidth, demonCircle.center.y + demonCircle.radius);
  drawScreen.drawLine(629, 200, 629, 640);
  drawScreen.ctx.strokeStyle = "Black";

  demonLoop.draw();
  demonCircle.draw();

  const demonCurrentPoint = new Point(demonCircle.x(demonCircle.nowPoint), demonCircle.y(demonCircle.nowPoint));

  drawScreen.drawLineP(demonCircle.center, demonCurrentPoint);

  fillCircle(demonCurrentPoint.x, demonCurrentPoint.y, 5);
  if (showLabels) {
    drawScreen.ctx.fillText("P", demonCurrentPoint.x - 15, demonCurrentPoint.y);

    fillCircle(demonCircle.center.x, demonCircle.center.y, 5);
    drawScreen.ctx.fillText("C", demonCircle.center.x - 14, demonCircle.center.y);

    const pointT = new Point(demonCircle.center.x, demonCircle.center.y + demonCircle.radius);
    fillCircle(pointT.x, pointT.y, 5);
    drawScreen.ctx.fillText("T", pointT.x - 14, pointT.y - 5);

    drawScreen.drawLineP(demonCircle.center, pointT);

    const pointQ = new Point(demonCircle.center.x, demonCurrentPoint.y);
    fillCircle(pointQ.x, pointQ.y, 5);
    drawScreen.ctx.fillText("Q", pointQ.x - 14, pointQ.y - 5);

    drawScreen.drawLineP(pointQ, demonCurrentPoint);

    const pointO = new Point(630, 580);
    fillCircle(pointO.x, pointO.y, 5);
    drawScreen.ctx.fillText("O", pointO.x - 14, pointO.y - 5);

    drawScreen.drawLineP(pointO, pointT);

    drawScreen.ctx.beginPath();
    drawScreen.ctx.arc(demonCircle.center.x, demonCircle.center.y, 20, Math.PI/2, demonCircle.nowPoint);
    drawScreen.ctx.stroke();
    drawScreen.ctx.fillText("θ", demonCircle.center.x - 20, demonCircle.center.y + 25);

    drawScreen.ctx.drawImage(x_derivation, 475, 140);
    drawScreen.ctx.drawImage(y_derivation, 475, 160);
  }
  
  //Epicycloids
  for (let i = 0; i < 3; i++) epicycloidList[i].loop();

  //Hypocycloid
  for (let i = 0; i < 4; i++) hypocycloidList[i].loop();
}