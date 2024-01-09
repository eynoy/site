const slide4 = () => {
  drawScreen.ctx.font = "12px sans-serif";

  let slideAnim = 0;
  const slideAnimTotal = 1;

  document.body.onmouseup = (e) => {
    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide5();
      drawScreen.setLoop();
    }
  };

  const funct = (x) => Math.exp(-(x * x)) / Math.sqrt(Math.PI);

  const functForPoint = (x) => funct(mp(x, 0, drawScreen.width, -4, 2));

  const g = 9.81;
  const mew = 0.20; //wood

  const l = 20;

  const box = {
    pos: new Vector(0, -2 * l),
    vel: new Vector(78, 0),
    m: 10,
    forceGrav: new Vector(0, 0),
    forceFric: new Vector(0, 0),
    loop: function(angle) {
      const netForce = new Vector(0, 0);
      //m g sin theta
      this.forceGrav.x = -(this.m * g * Math.sin(angle));
      //mew m g cos theta
      this.forceFric.x = (mew * this.m * g * Math.cos(angle)) * (this.vel.x < 0 ? 1 : -1);

      netForce.add(this.forceGrav);
      netForce.add(this.forceFric);
      netForce.mult(1/20); //dt
      this.vel.add(netForce.div(this.m));

      this.pos.add(this.vel.div(20));
    },
    draw: function() {
      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(-l, this.pos.y, l * 2, l * 2);
      drawScreen.ctx.stroke();

      drawScreen.ctx.font = "12px sans-serif";
      drawScreen.ctx.fillText(this.m + " kg", -l + 5, this.pos.y + l + 5);

      drawScreen.arrow(-l, -l * 8 / 5, -l + this.forceGrav.x, -l * 8 / 5);
      if (Math.abs(this.forceGrav.x) > 3) {
        drawScreen.ctx.fillText("F", -l + this.forceGrav.x, -l * 11 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("g", -l + 5 + this.forceGrav.x, -l * 10.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }

      if (this.forceFric.x < 0) {
        drawScreen.arrow(-l, -l * 4 / 5, -l + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", -1.5 * l + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", -1.5 * l + 5 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }
      else if (this.forceFric.x > 0) {
        drawScreen.arrow(l, -l * 4 / 5, l + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", 1.1 * l + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", 1.1 * l + 5 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }
    }
  };

  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("How do you find the work done by friction on an object", 60, 60);
    drawScreen.ctx.fillText("moving up a curved surface?", 60, 130);

    drawScreen.ctx.beginPath();
    for (let i = 1; i < drawScreen.width; i++) {      
      drawScreen.ctx.moveTo((i-1), mp(functForPoint(i-1), 0, 1, drawScreen.height, 0) - 20);
      drawScreen.ctx.lineTo(i, mp(functForPoint(i), 0, 1, drawScreen.height, 0) - 20);
    }
    drawScreen.ctx.stroke();

    const currX = mp(box.pos.x-1, 0, drawScreen.width, -4, 2);
    const currY = funct(currX);

    const currPosX = mp(currX, -4, 2, 0, drawScreen.width);
    const currPosY = mp(currY, 1, 0, 0, drawScreen.height) - 20;

    const nextX = mp(box.pos.x, 0, drawScreen.width, -4, 2);
    const nextY = funct(nextX);

    const nextPosX = mp(nextX, -4, 2, 0, drawScreen.width);
    const nextPosY = mp(nextY, 1, 0, 0, drawScreen.height) - 20;

    const angle = Math.atan((nextPosY - currPosY) / (nextPosX - currPosX));

    drawScreen.ctx.save();
    drawScreen.ctx.translate(currPosX, currPosY);
    drawScreen.ctx.rotate(angle);

    box.draw();
    if (slideAnim >= 1) box.loop(-angle);

    drawScreen.ctx.restore();
  };
}