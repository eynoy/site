const gravity = new Vector(0, 0.1);
let bounce = 0;
const eBall = {
  m: 1,
  r: 5,
  pos: new Vector(50, 50),
  vel: new Vector(0, 0),
  height: function() {
    return Math.max(500 - this.r - this.pos.y, 0);
  },
  draw: function() {
    drawScreen.fillCircle(this.pos.x, this.pos.y, this.r);
  },
  loop: function() {
    if (this.pos.y + this.r < 500) {
      this.vel.x *= 0.999;
      this.vel.add(gravity);
      this.pos.add(this.vel);
    }
    else if (bounce == 0 || bounce < -0.1) {
      playClack();
      if (!bounce) bounce = -this.vel.y;
      bounce *= 0.9;
      this.vel.y = bounce;
      this.pos.y = 499 - this.r;
    }
    else if (this.vel.y !== 0) {
      this.vel.y = 0;
    }
  }
};

const resetEnergyBall = () => {
  eBall.pos.y = 50;
  bounce = 0;
};

const energyBallLoop = (move) => {
  if (move) {
    eBall.loop();
  }
  eBall.draw();

  drawScreen.ctx.fillText("h = " + parseFloat(eBall.height()).toPrecision(4) + " m", 100, 50);

  const ug = eBall.m * gravity.mag() * eBall.height();
  drawScreen.ctx.fillText("U₉ = " + parseFloat(ug).toPrecision(4) + " j", 100, 80);

  const v = eBall.vel.mag();
  drawScreen.ctx.fillText("v = " + parseFloat(eBall.vel.y).toPrecision(4) + " m/s down", 100, 110);

  const k = 0.5 * eBall.m * v * v;
  drawScreen.ctx.fillText("K = " + parseFloat(k).toPrecision(4) + " j", 100, 140);

  const total = ug + k;
  drawScreen.ctx.fillText("U₉ + K = " + parseFloat(total).toPrecision(4) + " j", 100, 170);

  const int = totalEnergy - total;
  drawScreen.ctx.fillText("Internal = " + parseFloat(int).toPrecision(4) + " j", 100, 200);


  //totalEnergy -> 250px height
  drawScreen.drawRect(250 - 1, 30 - 1, 25 + 2, 250 + 2);

  const ugHeight = map(ug, 0, totalEnergy, 0, 250);
  drawScreen.ctx.fillStyle = "#586BA4";
  drawScreen.ctx.fillRect(250, 30, 25, ugHeight);

  const kHeight = map(k, 0, totalEnergy, 0, 250);
  drawScreen.ctx.fillStyle = "#F76C5E";
  drawScreen.ctx.fillRect(250, 30 + ugHeight, 25, kHeight);

  const intHeight = map(int, 0, totalEnergy, 0, 250);
  drawScreen.ctx.fillStyle = "#F5DD90";
  drawScreen.ctx.fillRect(250, 30 + ugHeight + kHeight, 25, intHeight);


  drawScreen.ctx.fillStyle = "Black";
  if (ug > 2) drawScreen.ctx.fillText("U₉", 257, Math.max(40, 30 + ugHeight/2));
  if (k > 2) drawScreen.ctx.fillText("K", 259, 30 + ugHeight + kHeight/2);
  drawScreen.ctx.fillText("Int", 255, 30 + ugHeight  + kHeight + intHeight/2);

  return int === totalEnergy;
};