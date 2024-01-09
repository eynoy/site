const centerStr = {
  currentTheta: 0,
  pos: new Vector(1270, 86),
  len: 125,
  loop: function() {
    //https://socratic.org/questions/what-is-the-formula-for-speed-of-pendulum-at-any-point
    this.currentTheta = theta0 * Math.cos(t * Math.sqrt(gravity.mag() / this.len)) + Math.PI/2;
  },
  draw: function() {
    drawScreen.ctx.fillStyle = "Grey";
    drawScreen.fillCircle(this.pos.x, this.pos.y, 2);
    drawScreen.ctx.fillStyle = "Black";
    drawScreen.drawLineP(this.pos, pendWeight.pos);
  }
};

let t = 0;
const theta0 = 1.12; //in Radians

centerStr.loop();

const pendWeight = {
  m: 1,
  r: 6,
  pos: new Vector(centerStr.pos.x + centerStr.len * Math.cos(centerStr.currentTheta), centerStr.pos.y + centerStr.len * Math.sin(centerStr.currentTheta)),
  height: function() {
    return (centerStr.pos.y + centerStr.len) - this.pos.y;
  },
  loop: function() {
    this.pos.x = centerStr.pos.x + centerStr.len * Math.cos(centerStr.currentTheta);
    this.pos.y = centerStr.pos.y + centerStr.len * Math.sin(centerStr.currentTheta);
  },
  draw: function() {
    drawScreen.fillCircle(this.pos.x, this.pos.y, this.r);
  }
}

const totalPenEnergy = pendWeight.m * gravity.mag() * pendWeight.height();

const pendulumLoop = (move) => {
  if (move) {
    t++;
    centerStr.loop();
    pendWeight.loop();
  }
  centerStr.draw();
  pendWeight.draw();

  drawScreen.ctx.fillText("h = " + parseFloat(pendWeight.height()).toPrecision(4) + " m", 1138, 235);

  const ug = pendWeight.m * gravity.mag() * pendWeight.height();
  drawScreen.ctx.fillText("U₉ = " + parseFloat(ug).toPrecision(4) + " j", 1138, 265);

  const k = totalPenEnergy - ug;
  //0.5 * eBall.m * v * v;
  drawScreen.ctx.fillText("K = " + parseFloat(k).toPrecision(4) + " j", 1138, 325);

  const v = Math.sqrt(2 * k / pendWeight.m);
  drawScreen.ctx.fillText("|v| = " + parseFloat(v).toPrecision(4) + " m/s", 1138, 295);

  drawScreen.ctx.fillText("U₉ + K = " + parseFloat(totalPenEnergy).toPrecision(4) + " j", 1138, 355);

  //totalPenEnergy -> 132px height
  drawScreen.drawRect(1300 - 1, 226 - 1, 25 + 2, 132 + 2);

  const ugHeight = map(ug, 0, totalPenEnergy, 0, 132);
  drawScreen.ctx.fillStyle = "#586BA4";
  drawScreen.ctx.fillRect(1300, 226, 25, ugHeight);

  const kHeight = map(k, 0, totalPenEnergy, 0, 132);
  drawScreen.ctx.fillStyle = "#F76C5E";
  drawScreen.ctx.fillRect(1300, 226 + ugHeight, 25, kHeight);

  drawScreen.ctx.fillStyle = "Black";
  if (ug > 1.5) drawScreen.ctx.fillText("U₉", 1307, Math.max(236, 226 + ugHeight/2));
  if (k > 1.5) drawScreen.ctx.fillText("K", 1309, 226 + ugHeight + kHeight/2);
};