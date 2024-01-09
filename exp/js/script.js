const map = (n, start1, stop1, start2, stop2) => {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

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

const clackSamples = [];
let clackId = 0;
const clackNoise = new Audio("resources/clack.mp3");
for (let i = 0; i < 5; i++) {
  clackSamples.push(clackNoise.cloneNode());
}
const playClack = () => {
  clackSamples[clackId++].play();
  if (clackId >= 4) {
    clackId = 0;
  }
};

const sections = [];
document.body.addEventListener("click", (e) => {
  for (let section of sections) {
    if (isPointWithinRect(e.clientX, e.clientY, section.rect)) {
      if (!section.playing) {
        section.playing = true;
      }
      else if (section.over) {
        if (isPointWithinRect(e.clientX, e.clientY, section.resetRect)) {
          section.reset();
        }
      }

      if (section === projectileSection) {
        startingProjectile++;
      }
    }
  }
});
document.body.addEventListener("mousemove", (e) => {
  if (projectileSection.playing && startingProjectile === 1) {
    const deltaMouse = new Vector(e.clientX - projectile.pos.x, e.clientY - projectile.pos.y);
    deltaMouse.normalize();
    deltaMouse.mult(velMagCon);
    projectile.vel = deltaMouse;
    degreesAngle = Math.toDegrees(deltaMouse.angle());
  }
});

let totalEnergy;
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

    const v = eBall.vel.mag();
    const k = 0.5 * eBall.m * v * v;
    const ug = eBall.m * gravity.mag() * eBall.height();
    totalEnergy = k + ug;

    this.interval = setInterval(mainLoop, 20);
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
  drawRect: function(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
  },
  fillRects: function(rect) {
    this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  },
  fillCircle: function(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  },
  fillTriangle: function(x1, y1, x2, y2, x3, y3) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.fill();
  },
  arrow: function(fromx, fromy, tox, toy) {
    if (fromx === tox && fromy === toy) return;

    this.ctx.strokeStyle = "Green";
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

const energySection = new Section(new Rect(5, 5, 300, 497), energyBallLoop, resetEnergyBall);
sections.push(energySection);

const momentumSection = new Section(new Rect(5, 505, 1415, 130), momentumBoxLoop, momentumReset);
sections.push(momentumSection);

const projectileSection = new Section(new Rect(310, 5, 795, 497), projectileLoop, projectileReset);
sections.push(projectileSection);

const pendulumSection = new Section(new Rect(1115, 5, 309, 497), pendulumLoop, null);
sections.push(pendulumSection);

const mainLoop = () => {
  drawScreen.clear();
  drawScreen.drawLine(0, 500, window.innerWidth, 500);
  drawScreen.drawLine(0, 630, window.innerWidth, 630);
  drawScreen.drawLine(307, 5, 307, 500);
  drawScreen.drawLine(1110, 5, 1110, 500);
  energySection.play();
  momentumSection.play();
  projectileSection.play();
  pendulumSection.play();
};