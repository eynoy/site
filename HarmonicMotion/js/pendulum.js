const g = 98.1;

const centerStr = {
  currentTheta: 0,
  pos: new Vector(900, 400),
  len: 150,
  getAngle: function() {
    return centerStr.currentTheta - Math.PI/2;
  },
  loop: function() {
    //https://socratic.org/questions/what-is-the-formula-for-speed-of-pendulum-at-any-point
    this.currentTheta = theta0 * Math.cos(t * Math.sqrt(g / this.len)) + Math.PI/2;
  },
  draw: function() {
    drawScreen.ctx.fillStyle = "Grey";
    drawScreen.fillCircle(this.pos.x, this.pos.y, 2);
    drawScreen.ctx.fillStyle = "Black";
    drawScreen.drawLine(this.pos.x, this.pos.y, pendWeight.pos.x, pendWeight.pos.y);
  }
};

let t = 0;
const theta0 = Math.PI / 18; //in Radians

centerStr.loop();

const pendWeight = {
  m: 100,
  r: 6,
  pos: new Vector(centerStr.pos.x + centerStr.len * Math.cos(centerStr.currentTheta), centerStr.pos.y + centerStr.len * Math.sin(centerStr.currentTheta)),
  graph: new Graph(centerStr.pos.x + 100, centerStr.pos.y + 100),
  height: function() {
    return (centerStr.pos.y + centerStr.len) - this.pos.y;
  },
  loop: function() {
    this.pos.x = centerStr.pos.x + centerStr.len * Math.cos(centerStr.currentTheta);
    this.pos.y = centerStr.pos.y + centerStr.len * Math.sin(centerStr.currentTheta);

    this.graph.add(centerStr.getAngle(), 1/200);
  },
  draw: function() {
    drawScreen.fillCircle(this.pos.x, this.pos.y, this.r);

    this.graph.draw(5);
  }
}

const pendulumLoop = (move) => {
  if (move) {
    t += 0.05;
    centerStr.loop();
    pendWeight.loop();
  }
  centerStr.draw();
  pendWeight.draw();

  const text = "θ = " + toDegrees(-(centerStr.getAngle())).toFixed(2) + "°";
  drawScreen.fillText(text, centerStr.pos.x - drawScreen.ctx.measureText(text).width/2, centerStr.pos.y + centerStr.len + 25);
  drawScreen.fillText("Only accurate for staring angles ≤15°, where", centerStr.pos.x - 120, centerStr.pos.y + centerStr.len + 50);
  drawScreen.fillText("sinθ ≈ θ, because then it apporximates a simple restoring force.", centerStr.pos.x - 150, centerStr.pos.y + centerStr.len + 70);
  drawScreen.ctx.drawImage(periodPendImg, 800, 625);
};