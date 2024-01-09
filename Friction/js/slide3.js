const slide3 = () => {
  let slideAnim = 0;
  const slideAnimTotal = 7;

  document.body.onmouseup = (e) => {
    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide4();
      drawScreen.setLoop();
    }
  };

  const g = 9.81;
  const mew = 0.2; //wood

  const box = {
    pos: new Vector(150, -40),
    vel: new Vector(80, 0),
    m: 10,
    loop: function() {
      if (this.vel.x > 0) {
        const netForce = new Vector(0, 0);
        //m g sin theta
        const forceGrav = new Vector(-(this.m * g * Math.sin(Math.PI/6)), 0);
        //mew m g cos theta
        const forceFric = new Vector((mew * this.m * g * Math.cos(Math.PI/6)) * (this.vel.x < 0 ? 1 : -1), 0);

        netForce.add(forceGrav);
        netForce.add(forceFric);
        netForce.mult(1/20); //dt
        this.vel.add(netForce.div(this.m));

        this.pos.add(this.vel.div(20));
      }
    },
    draw: function() {
      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(this.pos.x, this.pos.y, 40, 40);
      drawScreen.ctx.stroke();

      drawScreen.ctx.fillText(this.m + " kg", this.pos.x + 5, this.pos.y + 25);

      drawScreen.arrow(this.pos.x, this.pos.y + 10, this.pos.x - 41, this.pos.y + 10);
      drawScreen.ctx.fillText("F  sinθ", this.pos.x - 40, this.pos.y - 10);
      drawScreen.ctx.fillText("g", this.pos.x - 35, this.pos.y - 5);

      drawScreen.arrow(this.pos.x, this.pos.y + 30, this.pos.x - 40, this.pos.y + 30);
      drawScreen.ctx.fillText("F", this.pos.x - 55, this.pos.y + 33);
      drawScreen.ctx.fillText("f", this.pos.x - 50, this.pos.y + 38);

      if (this.vel.x > 0) {
        drawScreen.ctx.fillText("v = " + (this.vel.x).toFixed(0) + ". m/s", this.pos.x + 55, this.pos.y + 10);
        drawScreen.arrow(this.pos.x + 40, this.pos.y + 20, this.pos.x + 40 +  this.vel.x, this.pos.y + 20, "Blue");
      }
    }
  };

  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("How do you find the work done by friction on an object", 60, 60);
    drawScreen.ctx.fillText("moving up a ramp?", 60, 130);

    drawScreen.ctx.font = "24px sans-serif";
    switch (slideAnim) {
      case 7:
        drawScreen.ctx.fillText("After: E  = U  + W  = mgh + dμmgcosθ", 720, 500);
        drawScreen.ctx.fillText("       = (10.)(9.81)(483.·sin(30°)) + (483.)(0.20)(10.)(9.81)cos(30°)", 720, 550);
        drawScreen.ctx.fillText("       ≈ 32000 J", 720, 600);

        drawScreen.ctx.font = "48px sans-serif";
        drawScreen.ctx.fillText("Energy Conserved!", 920, 700);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("T", 803, 505);
        drawScreen.ctx.fillText("g", 853, 505);
        drawScreen.ctx.fillText("f", 908, 505);

        drawScreen.ctx.font = "24px sans-serif";
      case 6:
        box.loop();
      case 5:
        //Ramp Movement
        drawScreen.ctx.beginPath();
        drawScreen.ctx.moveTo(665, 800 - 600 * Math.tan(Math.PI/6));
        drawScreen.ctx.lineTo(65, 800);
        drawScreen.ctx.lineTo(665, 800);
        drawScreen.ctx.lineTo(665, 800 - 600 * Math.tan(Math.PI/6));
        drawScreen.ctx.stroke();

        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(65, 800, 20, 0, -Math.PI/6, true);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("Before: E  = K = ½mv² = 0.5(10.)(80.²) = 32000 J", 720, 450);
        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("T", 823, 455);

        drawScreen.ctx.fillText("30°", 93, 795);

        drawScreen.ctx.fillText("g = 9.81 m/s²", 65, 436);
        drawScreen.ctx.fillText("μ = 0.20 (Wood)", 65, 456);

        drawScreen.ctx.save();
        drawScreen.ctx.translate(65, 800);
        drawScreen.ctx.rotate(-Math.PI/6);

        drawScreen.drawLine(170, 10, 170, 20);
        drawScreen.drawLine(170, 15, box.pos.x + 20, 15);
        const lengthText = "d = " + (box.pos.x - 150).toFixed(0) + ". m";
        drawScreen.ctx.fillText(lengthText, (170 + box.pos.x) / 2 - drawScreen.ctx.measureText(lengthText).width/2, 30);
        drawScreen.drawLine(box.pos.x + 20, 10, box.pos.x + 20, 20);

        box.draw();

        drawScreen.ctx.restore();

        drawScreen.ctx.font = "24px sans-serif";
      case 4:
        drawScreen.ctx.fillText("So, since these are in the same direction, the work due to friction on a ramp is W = F·d = μmgcosθ·d = dμmgcosθ", 60, 350);
      case 3:
        drawScreen.ctx.fillText("The displacement of the box is just the length it traveled up the ramp d.", 60, 300);
      case 2:
        drawScreen.ctx.fillText("The force of friction is what we learned: F = μF = μF cosθ = μmgcosθ", 60, 250);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("f", 495, 257);
        drawScreen.ctx.fillText("N", 547, 257);
        drawScreen.ctx.fillText("g", 609, 253);

        //Ramp
        drawScreen.ctx.beginPath();
        drawScreen.ctx.moveTo(1350, 110);
        drawScreen.ctx.lineTo(1350, 310);
        drawScreen.ctx.lineTo(1150, 310);
        drawScreen.ctx.lineTo(1350, 110);
        drawScreen.ctx.stroke();

        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(1150, 310, 20, 0, -Math.PI/4, true);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("θ", 1174, 304);

        drawScreen.ctx.save();
        drawScreen.ctx.translate(1230, 200);
        drawScreen.ctx.rotate(-Math.PI/4);

        drawScreen.ctx.beginPath();
        drawScreen.ctx.rect(-20, -20, 40, 40); // -20 -20 20 20
        drawScreen.ctx.stroke();
        drawScreen.ctx.fillText("m", -5, 5);

        drawScreen.arrow(0, 20, 0, 60);
        drawScreen.ctx.fillText("F  cosθ", 8, 60);
        drawScreen.ctx.fillText("g", 13, 65);

        drawScreen.arrow(0, -20, 0, -60);
        drawScreen.ctx.fillText("F", 5, -60);
        drawScreen.ctx.fillText("N", 10, -52);

        drawScreen.arrow(-20, -10, -60, -10);
        drawScreen.ctx.fillText("F  sinθ", -60, -30);
        drawScreen.ctx.fillText("g", -55, -25);

        drawScreen.arrow(-20, 10, -60, 10);
        drawScreen.ctx.fillText("F", -75, 13);
        drawScreen.ctx.fillText("f", -70, 18);

        drawScreen.ctx.restore();

        drawScreen.ctx.font = "24px sans-serif";
      case 1:
        drawScreen.ctx.fillText("Well, W = F·d, so we need the force and displacement of the box due to friction.", 60, 200);
        break;
    }
  };
};