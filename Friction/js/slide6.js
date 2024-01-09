const slide6 = () => {
  let slideAnim = 0;
  const slideAnimTotal = 4;

  document.body.onmouseup = (e) => {
    if (slideAnim === 2) {
      box.pos.x = 0;
      box.vel.x = 75;
    }
    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide7();
      drawScreen.setLoop();
    }
  };

  const funct = (x) => Math.exp(-(x * x)) / Math.sqrt(Math.PI);

  const functForPoint = (x) => funct(mp(x, 0, drawScreen.width, -4, 2));


  const g = 9.81;
  const mew = 0.2; //wood

  const l = 20;
  const box = {
    pos: new Vector(-20, -40),
    vel: new Vector(75, 0),
    forceFric: new Vector(0, 0),
    forceGrav: new Vector(0, 0),
    currRamp: 1,
    m: 10,
    loop: function(angle) {
      const netForce = new Vector(0, 0);
      //m g sin theta
      this.forceGrav = new Vector(-(this.m * g * Math.sin(angle)), 0);
      //mew m g cos theta
      this.forceFric = new Vector((mew * this.m * g * Math.cos(angle)) * (this.vel.x < 0 ? 1 : -1), 0);

      netForce.add(this.forceGrav);
      netForce.add(this.forceFric);
      netForce.mult(1/20); //dt
      this.vel.add(netForce.div(this.m));

      this.pos.add(this.vel.div(20));
    },
    draw: function() {
      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(this.pos.x, this.pos.y, 40, 40);
      drawScreen.ctx.stroke();

      drawScreen.ctx.fillText(this.m + " kg", this.pos.x + 5, this.pos.y + 25);

      drawScreen.arrow(this.pos.x, this.pos.y + 10, this.pos.x + this.forceGrav.x, this.pos.y + 10);
      drawScreen.ctx.fillText("F  sinθ", this.pos.x - 40, this.pos.y - 10);
      drawScreen.ctx.fillText("g", this.pos.x - 35, this.pos.y - 5);

      if (this.forceFric.x < 0) {
        drawScreen.arrow(this.pos.x, -l * 4 / 5, this.pos.x + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", this.pos.x - 9 + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", this.pos.x - 6 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }
      else if (this.forceFric.x > 0) {
        drawScreen.arrow(this.pos.x + 2 * l, -l * 4 / 5,this.pos.x + 2 * l + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", this.pos.x + 2.1 * l + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", this.pos.x + 2.1 * l + 5 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }

      if (this.vel.x > 0) {
        drawScreen.ctx.fillText("v = " + (this.vel.x).toFixed(0) + ". m/s", this.pos.x + 55, this.pos.y + 10);
        drawScreen.arrow(this.pos.x + 40, this.pos.y + 20, this.pos.x + 40 +  this.vel.x, this.pos.y + 20, "Blue");
      }
      else if (this.vel.x < 0) {
        drawScreen.ctx.fillText("v = " + (this.vel.x).toFixed(0) + ". m/s", this.pos.x - 15, this.pos.y + 10);
        drawScreen.arrow(this.pos.x, this.pos.y + 20, this.pos.x +  this.vel.x, this.pos.y + 20, "Blue");
      }
    }
  };

  let numOfRamps = 2;
  let t = 0;
  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("How do you model a curve with straight lines?", 60, 60);

    drawScreen.ctx.font = "24px sans-serif";

    drawScreen.ctx.beginPath();
    for (let i = 1; i < drawScreen.width; i++) {      
      drawScreen.ctx.moveTo((i-1), mp(functForPoint(i-1), 0, 1, drawScreen.height, 0) - 20);
      drawScreen.ctx.lineTo(i, mp(functForPoint(i), 0, 1, drawScreen.height, 0) - 20);
    }
    drawScreen.ctx.stroke();

    drawScreen.ctx.font = "12px sans-serif";
    if (slideAnim >= 1) {
      drawScreen.ctx.strokeStyle = "Red";
      
      for (let i = 0; i < numOfRamps; i++) {
        const xpos = mp(i, 0, numOfRamps, -4, 2);
        const nexpos = mp(i+1, 0, numOfRamps, -4, 2);
        if (slideAnim > 0 && slideAnim % 2 === 0 && i+1 === box.currRamp) drawScreen.ctx.strokeStyle = "Blue";

        drawScreen.drawRightTri(mp(xpos, -4, 2, 0, drawScreen.width), mp(funct(xpos), 0, 1, drawScreen.height, 0) - 20, mp(nexpos, -4, 2, 0, drawScreen.width), mp(funct(nexpos), 0, 1, drawScreen.height, 0) - 20);

        if (slideAnim > 0 && slideAnim % 2 === 0 && i+1 === box.currRamp) drawScreen.ctx.strokeStyle = "Red";
      }
      drawScreen.ctx.strokeStyle = "Black";

      if (slideAnim > 0 && slideAnim % 2 === 0) {
        const currX = mp(box.currRamp-1, 0, numOfRamps, -4, 2);
        const currY = funct(currX);

        const currPosX = mp(currX, -4, 2, 0, drawScreen.width);
        const currPosY = mp(currY, 1, 0, 0, drawScreen.height) - 20;

        const nextX = mp(box.currRamp, 0, numOfRamps, -4, 2);
        const nextY = funct(nextX);

        const nextPosX = mp(nextX, -4, 2, 0, drawScreen.width);
        const nextPosY = mp(nextY, 1, 0, 0, drawScreen.height) - 20;

        const angle = Math.atan((nextPosY - currPosY) / (nextPosX - currPosX));

        drawScreen.ctx.save();
        drawScreen.ctx.translate(currPosX, currPosY);
        drawScreen.ctx.rotate(angle);

        box.draw();
        box.loop(-angle);

        if (box.pos.x + 20 > (drawScreen.width / numOfRamps) / Math.cos(angle)) {
          box.pos.x = -20;
          box.currRamp++;
        }
        else if (box.pos.x + 20 < 0) {
          box.currRamp--;

          const newcurrX = mp(box.currRamp-1, 0, numOfRamps, -4, 2);
          const newcurrY = funct(newcurrX);

          const newcurrPosX = mp(newcurrX, -4, 2, 0, drawScreen.width);
          const newcurrPosY = mp(newcurrY, 1, 0, 0, drawScreen.height) - 20;

          const newnextX = mp(box.currRamp, 0, numOfRamps, -4, 2);
          const newnextY = funct(newnextX);

          const newnextPosX = mp(newnextX, -4, 2, 0, drawScreen.width);
          const newnextPosY = mp(newnextY, 1, 0, 0, drawScreen.height) - 20;

          const newangle = Math.atan((newnextPosY - newcurrPosY) / (newnextPosX - newcurrPosX));

          box.pos.x = ((drawScreen.width / numOfRamps) / Math.cos(newangle)) - 20;
        }

        drawScreen.ctx.restore();
      }

      if (t % 7 == 0 && slideAnim === 3 && numOfRamps < drawScreen.width/10) {
        numOfRamps += 2;
      }
      t++;
    }


  };
};