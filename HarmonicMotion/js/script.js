document.addEventListener("keyup", (e) => {
  looping = !looping;
});

const circDerImg = new Image();
circDerImg.src = "Resources/CircDerivation.png";
const periodSprImg = new Image();
periodSprImg.src = "Resources/periodSpr.png";
const periodGenImg = new Image();
periodGenImg.src = "Resources/periodGen.png";
const periodPendImg = new Image();
periodPendImg.src = "Resources/periodPend.png";

const toDegrees = rad => rad * 180 / Math.PI;

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

const drawScreen = {
  canvas: document.getElementById("drawScren"),
  start: function() {
    while (this.canvas === null) this.canvas = document.getElementById("drawScren");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.ctx = setupCanvas(this.canvas);

    this.ctx.fillStyle = "White";
    this.ctx.strokeStyle = "Black";
    this.ctx.font = "12px sans-serif";
    this.ctx.lineWidth = 1;

    this.interval = setInterval(mainLoop, 20);
  },
  coloredPoint: function(name, x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = "Black";

    
    this.ctx.fillText(name, x + 10, y + 5);
    this.ctx.fillStyle = "White";
  },
  fillText: function(text, x, y) {
    drawScreen.ctx.fillStyle = "Black";
    this.ctx.fillText(text, x, y);
    drawScreen.ctx.fillStyle = "White";
  },
  drawLine: function(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  },
  measureBarH: function(x1, x2, y) {
    this.drawLine(x1, y - 5, x1, y + 5);
    this.drawLine(x1, y    , x2, y    );
    this.drawLine(x2, y - 5, x2, y + 5);
  },
  drawSpring: function(x1, x2, y, numPoints) {
    const fulldist = x2 - x1;
    const step = fulldist / numPoints;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y);
    for (let i = 1; i < numPoints; i++) {
      this.ctx.lineTo(x1 + i * step, y + 8 * Math.pow(-1, i));
    }
    this.ctx.lineTo(x2, y);
    this.ctx.stroke();
  },
  drawRect: function(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
  },
  fillRect: function(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.fill();
  },
  fillCircle: function(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  },
  arrow: function(fromx, fromy, tox, toy, color) {
    if (Math.abs(fromx - tox) <= 5 && Math.abs(fromy - toy) <= 5) return;

    if (color) this.ctx.strokeStyle = color;
    else this.ctx.strokeStyle = "Green";
    this.ctx.lineWidth = 2;

    const headlen = 10; // length of head in pixels
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);

    this.ctx.beginPath();
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();

    this.ctx.strokeStyle = "Black";
    this.ctx.lineWidth = 1;
  },
  clear: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};