const slide9 = () => {
  drawScreen.ctx.font = "12px sans-serif";

  let slideAnim = 0;
  const slideAnimTotal = 8;

  document.body.onmouseup = (e) => {
    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide1();
      drawScreen.setLoop();
    }
  };

  let t = 0;
  class PBox {
    constructor(x, y, velx, vely) {
      this.init = new Vector(x, y);
      this.pos = new Vector(x, y);
      this.vel = new Vector(velx, vely);
      this.lop = new Loop();
      this.m = 10;
    }
    loop() {
      this.pos.y -= 40;
      this.lop.add(this.pos.copy());
      this.pos.y += 40;

      this.vel.mult(.9939);

      if (this.pos.x > 435) {
        this.vel.x *= -1;
      }

      this.pos.add(this.vel.div(20));
    }
    draw() {
      this.lop.draw();

      drawScreen.ctx.font = "12px sans-serif";
      drawScreen.coloredPoint("A", this.init.x, this.init.y - 40, "Blue");
      drawScreen.coloredPoint("B", this.init.x, 560, "Blue");

      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(this.pos.x - 20, this.pos.y - 40, 40, 40);
      drawScreen.ctx.stroke();

      drawScreen.ctx.fillText(this.m + " kg", -20 + this.pos.x + 5, this.pos.y - 20 + 5);

      const fricAngle = this.vel.angle() - Math.PI;
      const fricXArr = 40 * Math.cos(fricAngle);
      const fricYArr = 40 * Math.sin(fricAngle);

      drawScreen.arrow(this.pos.x, this.pos.y - 40, this.pos.x + fricXArr, this.pos.y + fricYArr - 40);
      drawScreen.ctx.fillText("F", this.pos.x + fricXArr + 5, this.pos.y + fricYArr - 40);
      drawScreen.ctx.font = "6px sans-serif";
      drawScreen.ctx.fillText("f", this.pos.x + fricXArr + 9, this.pos.y + fricYArr - 38);
    }
  }

  const straightBox = new PBox(180, 330, 0, 30);
  const moveBox = new PBox(300, 330, 31.8198, 31.8198);

  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("Nonconservative Forces", 60, 60);

    drawScreen.ctx.font = "24px sans-serif";
    switch (slideAnim) {
      case 8:
        drawScreen.ctx.fillText("So, any change in the Mechanical Energy of a system must be work done by", 530, 600);
        drawScreen.ctx.fillText("a nonconservative force: ΔME = W", 530, 630);
      case 7:
        drawScreen.ctx.fillText("Mechanical Energy is the sum of all potential and kinetic energy in a system:", 530, 540);
        drawScreen.ctx.fillText("ME = KE + P", 530, 570);
      case 6:
        drawScreen.ctx.fillText("Friction is a nonconservative force.", 530, 400);
        drawScreen.ctx.fillText("The curve/ramp equivalence is just a special case.", 530, 430);
        drawScreen.ctx.fillText("It only applies when the curve always goes up —", 530, 460);
        drawScreen.ctx.fillText("if it goes down then up, it friction will do a different amount of work.", 530, 490);
      case 5:
        drawScreen.ctx.fillText("The path it takes matters!", 530, 340);
      case 4:
        drawScreen.ctx.fillText("Notice how the right box needs to start with a much faster speed.", 530, 280);
      case 3:
        moveBox.loop();
        moveBox.draw();

        drawScreen.ctx.beginPath();
        drawScreen.ctx.rect(455, 370, 15, 100);
        drawScreen.ctx.stroke();
      case 2:
        straightBox.loop();
        straightBox.draw();
        drawScreen.ctx.font = "24px sans-serif";
      case 1:
        drawScreen.ctx.fillText("A nonconservative force is a force that does different amounts of work between two points", 60, 120);
        drawScreen.ctx.fillText("depending on the path taken between them.", 60, 160);
    }
  };
}