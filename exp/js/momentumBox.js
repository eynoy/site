const wall = {
  pos: 30,
  w: 20,
  draw: function() {
    drawScreen.drawRect(this.pos - this.w, 510, this.w, 120);
  }
};

const boxList = [];

let collisions = 0;

const intersect = () => {
  collisions++;
  //Play audio
  playClack();
};

class Box {
  constructor(m, l, posx, velx) {
    this.m = m;
    this.l = l;
    this.pos = new Vector(posx, 629 - this.l);
    this.vel = new Vector(velx, 0);
  }
  draw() {
    drawScreen.drawRect(this.pos.x - this.l, this.pos.y - this.l, this.l * 2, this.l * 2);
    drawScreen.ctx.font = this.l/2 + "px sans-serif";
    drawScreen.ctx.fillText(this.m + " kg", this.pos.x - (this.l/2 * (digits(this.m) + 1)/2), this.pos.y + (this.l/5));
    drawScreen.ctx.font = "10px sans-serif";

    if (this.m <= 10) drawScreen.ctx.font = "8px sans-serif";
    drawScreen.ctx.fillText(parseFloat(this.vel.x).toPrecision(2) + " m/s fwd", this.pos.x - this.l/2 - 8, this.pos.y + (this.l * 3 / 5));
    if (this.m <= 10) drawScreen.ctx.font = "10px sans-serif";
    
    if (this.vel.x >= 0) drawScreen.arrow(this.right(), this.pos.y, this.right() + this.vel.x * 20, this.pos.y);
    else drawScreen.arrow(this.left(), this.pos.y, this.left() + this.vel.x * 20, this.pos.y);
  }
  left() {
    return this.pos.x - this.l;
  }
  right() {
    return this.pos.x + this.l;
  }
  intersects(other) {
    return this.right() >= other.left() && this.left() <= other.right();
  }
  loop() {
    if (this.left() + this.vel.x <= wall.pos) {
      this.vel.x *= -1;
      this.pos.x = wall.pos + this.l;
      intersect();
    }
    else {
      this.pos.add(this.vel);
    }

    for (let other of boxList) {
      if (this !== other && this.intersects(other)) {
        intersect();
        //New Velocities
        const thisNewVel = ((this.m - other.m) / (this.m + other.m)) * this.vel.x + ((2 * other.m) / (this.m + other.m)) * other.vel.x;
        other.vel.x = ((2 * this.m) / (this.m + other.m)) * this.vel.x + ((other.m - this.m) / (this.m + other.m)) * other.vel.x;
        this.vel.x = thisNewVel;

        this.pos.x += this.vel.x;
        other.pos.x += other.vel.x;
      }
    }
  }
}

const momentumReset = () => {
  collisions = 0;
  boxList.length = 0;
  boxList.push(new Box(5, 25, 300, 0), new Box(100, 50, 800, -1.5), new Box(10, 30, 100, 1));
};

boxList.push(new Box(5, 25, 300, 0), new Box(100, 50, 800, -1.5), new Box(10, 30, 100, 1));

const momentumBoxLoop = (move) => {
  wall.draw();
  for (let testBox of boxList) {
    if (move) testBox.loop();
    testBox.draw();
  }
  drawScreen.ctx.fillText("Collisions: " + collisions, 50, 525);

  return collisions === 26;
};