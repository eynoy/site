const projWall = {
  pos: 700,
  w: 5,
  h: 200,
  draw: function() {
    drawScreen.drawRect(this.pos, 500 - this.h, this.w, this.h);
  }
};

const velMagCon = 6 * Math.sqrt(2);
const projectile = {
  m: 1,
  r: 8,
  pos: new Vector(350, 492),
  vel: new Vector(6, -6),
  height: function() {
    return Math.max(500 - this.r - this.pos.y, 0);
  },
  draw: function() {
    drawScreen.fillCircle(this.pos.x, this.pos.y, this.r);
    drawScreen.arrow(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 5, this.pos.y + this.vel.y * 5);
  },
  right: function() {
    return this.pos.x + this.r;
  },
  left: function() {
    return this.pos.x - this.r;
  },
  bottom: function() {
    return this.pos.y + this.r;
  },
  loop: function() {
    parabolaLoop.add(this.pos);

    if (this.pos.y + this.r < 500) {
      this.vel.add(gravity);
      this.pos.add(this.vel);

      if (this.right() >= projWall.pos && this.left() <= projWall.pos + projWall.w && this.bottom() >= 500 - projWall.h) {
        this.vel.x = 0;
      }
    }
    else {
      this.pos.y = 492;
    }
  }
};

const parabolaLoop = new Loop();

const projectileReset = () => {
  projectile.pos = new Vector(350, 492);
  projectile.vel = new Vector(6, -6);
  startingProjectile = 0;
  parabolaLoop.points.length = 0;
};

let startingProjectile = 0; //0 means before played, 1 means picking direction, 2 means start moving, 3 means moving

let degreesAngle = -45;
const projectileLoop = (move) => {
  if (move) {
    if (startingProjectile === 2) {
      startingProjectile++;
      projectile.pos.add(projectile.vel);
    }
    else if (startingProjectile === 1) {
      drawScreen.ctx.beginPath();
      drawScreen.ctx.arc(projectile.pos.x, projectile.pos.y, projectile.r + 10, 0, Math.toRadians(degreesAngle), degreesAngle <= 0);
      drawScreen.ctx.stroke();
      drawScreen.ctx.fillText("θ = " + parseFloat(-degreesAngle).toPrecision(3) + "°", projectile.pos.x + projectile.r + 15, projectile.pos.y);
      drawScreen.ctx.fillText("|v| = " + parseFloat(projectile.vel.mag()).toPrecision(3) + " m/s", projectile.pos.x - projectile.r, projectile.pos.y - projectile.r - 40);
    }
    projectile.loop();
    parabolaLoop.draw();
  }
  
  projWall.draw();
  projectile.draw();

  return startingProjectile >= 3 && projectile.pos.y === 492;
};