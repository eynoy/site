const slide8 = () => {
  drawScreen.ctx.font = "12px sans-serif";

  let slideAnim = 0;
  const slideAnimTotal = 8;

  document.body.onmouseup = (e) => {
    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide9();
      drawScreen.setLoop();
    }
  };

  let t = 0;
  class PBox {
    constructor(x, y, velx, sinMov) {
      this.init = new Vector(x, y);
      this.special = sinMov;
      this.pos = new Vector(x, y);
      this.vel = new Vector(velx, 0);
      this.lop = new Loop();
      this.m = 10;
    }
    loop() {
      if (this.pos.y < 600) {
        this.pos.y -= 20;
        this.lop.add(this.pos.copy());
        this.pos.y += 20;

        this.vel.y += g;
        if (this.special) {
          this.vel.x = 75 * Math.sin(t);
        }
        else if (this.pos.x >= 375) {
          this.vel.x *= -1;
        }

        this.pos.add(this.vel.div(20));
      }
      else {
        this.pos.y = 600;
      }
    }
    draw() {
      this.lop.draw();

      drawScreen.ctx.font = "12px sans-serif";
      drawScreen.coloredPoint("A", this.init.x, this.init.y - 20, "Blue");
      drawScreen.coloredPoint("B", this.init.x, 560, "Blue");

      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(this.pos.x - 20, this.pos.y - 40, 40, 40);
      drawScreen.ctx.stroke();

      drawScreen.ctx.fillText(this.m + " kg", -20 + this.pos.x + 5, this.pos.y - 20 + 5);

      drawScreen.arrow(this.pos.x, this.pos.y, this.pos.x, this.pos.y + 30);
      drawScreen.ctx.fillText("F", this.pos.x + 5, this.pos.y + 30);
      drawScreen.ctx.font = "6px sans-serif";
      drawScreen.ctx.fillText("g", this.pos.x + 9, this.pos.y + 32);

      if (this.special) {
        drawScreen.drawSpring(this.pos.x + 20, this.init.x + 50, this.pos.y - 20);

        drawScreen.ctx.beginPath();
        drawScreen.ctx.rect(this.init.x + 50, this.pos.y - 40, 80, 40);
        drawScreen.ctx.stroke();
      }
    }
  }

  const g = 9.81;

  const straightBox = new PBox(180, 330, 0, false);
  const moveBox = new PBox(300, 330, 95, false);
  const sinBox = new PBox(500, 330, 0, true);

  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("Conservative Forces", 60, 60);

    drawScreen.ctx.font = "24px sans-serif";
    switch (slideAnim) {
      case 8:
        drawScreen.ctx.fillText("Notice that this happens because we a have a potential energy function.", 60, 715);
      case 7:
        drawScreen.ctx.font = "40px sans-serif";
        drawScreen.ctx.fillText("For all of them!", 740, 450);
        drawScreen.ctx.font = "24px sans-serif";
      case 6:
        drawScreen.ctx.fillText("W  = U  - U   = mgh₂ - mgh₁ = mg(h₂ - h₁)", 700, 300);
        drawScreen.ctx.fillText("     = (10)(9.81)(0 - 265) = -26000 J", 700, 340);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("g             gf           gi", 723, 303);
      case 5:
        sinBox.loop();
        sinBox.draw();
      case 4:
        drawScreen.ctx.beginPath();
        drawScreen.ctx.rect(375, 360, 15, 100);
        drawScreen.ctx.stroke();

        moveBox.loop();
        moveBox.draw();
      case 3:
        straightBox.loop();
        straightBox.draw();

      case 2:
        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("g = 9.81 m/s²", 65, 256);

        drawScreen.drawLine(5, 330, 15, 330);
        drawScreen.drawLine(10, 330, 10, 595);
        drawScreen.drawLine(5, 595, 15, 595);
        drawScreen.ctx.fillText("h = 265 m", 15, 463);

        drawScreen.drawLine(0, 600, drawScreen.width, 600);

        drawScreen.ctx.font = "24px sans-serif";
        drawScreen.ctx.fillText("Example: Gravity", 60, 230);
      case 1:
        drawScreen.ctx.fillText("Conservative Forces are forces who do the same amount of work on an object between two points", 60, 120);
        drawScreen.ctx.fillText("regardless of the path taken between them.", 60, 160);
    }

    if (sinBox.pos.y < 600) t += Math.PI / 8;
  };
}