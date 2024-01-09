const slide7 = () => {
  drawScreen.ctx.font = "12px sans-serif";

  let slideAnim = 0;
  const slideAnimTotal = 5;

  document.body.onmouseup = (e) => {
    if (slideAnim === 2) {
      box.vel.x = speed;
    }
    if (slideAnim === 4) {
      box2.vel.x = speed;
    }

    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide8();
      drawScreen.setLoop();
    }
  };

  const funct = (x) => Math.exp(-(x * x)) / Math.sqrt(Math.PI);

  const functForPoint = (x) => funct(mp(x, 0, drawScreen.width, -4, 2));

  const g = 9.81;
  const mew = 0.20; //wood

  const l = 20;

  const box = {
    currRamp: 0,
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

      if (this.vel.x < 0.1) {

      }
      else if (this.forceFric.x < 0.5) {
        drawScreen.arrow(-l, -l * 4 / 5, -l + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", -1.5 * l + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", -1.5 * l + 5 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }
      else if (this.forceFric.x > 0.5) {
        drawScreen.arrow(l, -l * 4 / 5, l + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", 1.1 * l + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", 1.1 * l + 5 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }

      if (this.vel.x < 0.1 || this.vel.x > 0) {
        drawScreen.ctx.fillText("v = " + Math.abs(this.vel.x).toFixed(0) + ". m/s", 55, -30);
        drawScreen.arrow(20, -20, 20 + this.vel.x, -20, "Blue");
      }
      else if (this.vel.x < 0) {
        drawScreen.ctx.fillText("v = " + (this.vel.x).toFixed(0) + ". m/s", -15, -30);
        drawScreen.arrow(0, -20, this.vel.x, -20, "Blue");
      }
    }
  };

  const box2 = {
    pos: new Vector(0, -2 * l),
    vel: new Vector(78, 0),
    m: 10,
    forceGrav: new Vector(0, 0),
    forceFric: new Vector(0, 0),
    loop: function(angle) {
      if (this.vel.x > 0.1) {
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
      }
    },
    draw: function() {
      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(-l + this.pos.x, this.pos.y, l * 2, l * 2);
      drawScreen.ctx.stroke();

      drawScreen.ctx.font = "12px sans-serif";
      drawScreen.ctx.fillText(this.m + " kg", -l + this.pos.x + 5, this.pos.y + l + 5);

      drawScreen.arrow(-l + this.pos.x, -l * 8 / 5, -l + this.pos.x + this.forceGrav.x, -l * 8 / 5);
      if (Math.abs(this.forceGrav.x) > 3) {
        drawScreen.ctx.fillText("F", -l + this.pos.x + this.forceGrav.x, -l * 11 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("g", -l + this.pos.x + 5 + this.forceGrav.x, -l * 10.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }

      if (this.vel.x < 0.1) {

      }
      else if (this.forceFric.x < -0.5) {
        drawScreen.arrow(-l + this.pos.x, -l * 4 / 5, -l + this.pos.x + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", -1.5 * l + this.pos.x + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", -1.5 * l + this.pos.x + 5 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }
      else if (this.forceFric.x > 0.5) {
        drawScreen.arrow(l + this.pos.x, -l * 4 / 5, l + this.pos.x + this.forceFric.x, -l * 4 / 5);
        drawScreen.ctx.fillText("F", 1.1 * l + this.pos.x + this.forceFric.x, -l * 3 / 5);
        drawScreen.ctx.font = "6px sans-serif";
        drawScreen.ctx.fillText("f", 1.1 * l + this.pos.x + 5 + this.forceFric.x, -l * 2.5 / 5);
        drawScreen.ctx.font = "12px sans-serif";
      }

      if (this.vel.x < 0.1 || this.vel.x > 0) {
        drawScreen.ctx.fillText("v = " + Math.abs(this.vel.x).toFixed(0) + ". m/s", 55 + this.pos.x, -30);
        drawScreen.arrow(20 + this.pos.x, -20, 20 + this.pos.x + this.vel.x, -20, "Blue");
      }
      else if (this.vel.x < 0) {
        drawScreen.ctx.fillText("v = " + (this.vel.x).toFixed(0) + ". m/s", -15 + this.pos.x, -30);
        drawScreen.arrow(this.pos.x, -20, this.vel.x + this.pos.x, -20, "Blue");
      }
    }
  };

  let speed = 0;
  const numOfRamps = drawScreen.width+1;
  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("Example: How fast does it need to go to rest on top?", 60, 60);

    drawScreen.ctx.font = "12px sans-serif";

    drawScreen.ctx.fillText("g = 9.81 m/s²", 65, 436);
    drawScreen.ctx.fillText("μ = 0.20 (Wood)", 65, 456);

    const topHeight = mp(funct(0), 0, 1, 0, drawScreen.height);

    const topWidth = drawScreen.width * 2 / 3;

    drawScreen.ctx.font = "24px sans-serif";
    const totalE = (10 * 9.81 * topHeight) + (topWidth * 10 * 9.81 * 0.20);
    speed = Math.sqrt(2 * totalE / 10);

    switch (slideAnim) {
      case 5:
        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.globalAlpha = 0.4;

        drawScreen.ctx.strokeStyle = colors[0];
        drawScreen.drawRightTri(0, drawScreen.height - 20, topWidth, drawScreen.height - 20 - topHeight);

        const angle2 = Math.atan(topHeight / topWidth);

        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(0, drawScreen.height - 20, 26, 0, -angle2, true);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("θ = " + toDegrees(angle2).toFixed(1) + "°", 30, drawScreen.height - 23);

        drawScreen.ctx.save();
        drawScreen.ctx.translate(0, drawScreen.height - 20);
        drawScreen.ctx.rotate(-angle2);

        box2.loop(angle2);
        box2.draw();

        drawScreen.ctx.restore();

        drawScreen.ctx.strokeStyle = "Black";
        drawScreen.ctx.globalAlpha = 1;
        drawScreen.ctx.font = "24px sans-serif";
      case 4:
        drawScreen.ctx.fillText("Notice that these energy/work calculations are the same as if it was one big ramp!", 60, 200);
      case 3:
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

        if (box.pos.x > (drawScreen.width / numOfRamps) / Math.cos(-angle)) {
          box.currRamp += Math.floor((box.pos.x) / ((drawScreen.width / numOfRamps) / Math.cos(-angle)));

          box.pos.x = (box.pos.x) % ((drawScreen.width / numOfRamps) / Math.cos(-angle));
        }
        else if (box.pos.x < 0) {
          box.currRamp += Math.floor((box.pos.x) / ((drawScreen.width / numOfRamps) / Math.cos(-angle)));

          const newcurrX = mp(box.currRamp-1, 0, numOfRamps, -4, 2);
          const newcurrY = funct(newcurrX);

          const newcurrPosX = mp(newcurrX, -4, 2, 0, drawScreen.width);
          const newcurrPosY = mp(newcurrY, 1, 0, 0, drawScreen.height) - 20;

          const newnextX = mp(box.currRamp, 0, numOfRamps, -4, 2);
          const newnextY = funct(newnextX);

          const newnextPosX = mp(newnextX, -4, 2, 0, drawScreen.width);
          const newnextPosY = mp(newnextY, 1, 0, 0, drawScreen.height) - 20;

          const newangle = Math.atan((newnextPosY - newcurrPosY) / (newnextPosX - newcurrPosX));

          box.pos.x = ((drawScreen.width / numOfRamps) / Math.cos(newangle));
        }
        drawScreen.ctx.restore();
      case 2:
        drawScreen.ctx.fillText("Before: E  = K = ½mv², so v = √(2E / m) = √( 2(" + totalE.toFixed(0) + ") / (10)) = " + speed.toFixed(0) + " m/s", 60, 160);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("T", 162, 165);

        drawScreen.ctx.font = "24px sans-serif";
      case 1:
        drawScreen.ctx.fillText("After: E  = U  + W  = mgh + xmgμ = (10)(9.81)(" + topHeight.toFixed(0) + ".) + (" + topWidth.toFixed(0) + ")(10)(9.81)(0.20) = " + totalE.toFixed(0) + " J", 60, 120);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("T             g               f", 142, 125);

        drawScreen.drawLine(topWidth, drawScreen.height - 14, topWidth + 10, drawScreen.height - 14);
        drawScreen.drawLine(topWidth + 5, drawScreen.height - 14, topWidth + 5, drawScreen.height - 14 - topHeight);
        drawScreen.drawLine(topWidth, drawScreen.height - 14 - topHeight, topWidth + 10, drawScreen.height - 14 - topHeight);
        drawScreen.ctx.fillText("h = " + topHeight.toFixed(0) + " m", topWidth + 10, drawScreen.height - 2 - topHeight/2);

        drawScreen.drawLine(5, drawScreen.height - 19, 5, drawScreen.height - 9);
        drawScreen.drawLine(5, drawScreen.height - 14, topWidth, drawScreen.height - 14);
        drawScreen.drawLine(topWidth, drawScreen.height - 19, topWidth, drawScreen.height - 9);
        drawScreen.ctx.fillText("x = " + topWidth.toFixed(0) + " m", topWidth/2, drawScreen.height-2);
    }

    drawScreen.ctx.beginPath();
    for (let i = 1; i < drawScreen.width; i++) {      
      drawScreen.ctx.moveTo((i-1), mp(functForPoint(i-1), 0, 1, drawScreen.height, 0) - 20);
      drawScreen.ctx.lineTo(i, mp(functForPoint(i), 0, 1, drawScreen.height, 0) - 20);
    }
    drawScreen.ctx.stroke();
  };
}