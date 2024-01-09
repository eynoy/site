const l = 40;

class Box {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.netForce = new Vector(0, 0);
    this.fSnap = this.netForce.x;
    this.m = 15;
  }
  applyForce(fx, fy) {
    this.netForce.addO(fx, fy);
  }
  loop() {
    this.vel.add(this.netForce.div(20).div(this.m));
    this.pos.add(this.vel.div(20));

    this.fSnap = this.netForce.x;
  }
  draw(measuring) {
    drawScreen.fillRect(this.pos.x - l/2, this.pos.y - l/2, l, l);
    drawScreen.drawRect(this.pos.x - l/2, this.pos.y - l/2, l, l);

    drawScreen.fillText(this.m + " kg", this.pos.x - 15, this.pos.y + 2);

    this.netForce.mult(0);
  }
}