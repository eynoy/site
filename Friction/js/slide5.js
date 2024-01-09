const slide5 = () => {
  let slideAnim = 0;
  const slideAnimTotal = 6;

  document.body.onmouseup = (e) => {
    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide6();
      drawScreen.setLoop();
    }
  };

  const g = 9.81;
  const mew = 0.20;

  let section = 1; //1 is top ramp, 0 is bottom ramp
  const box = {
    pos: new Vector(95, -40),
    vel: new Vector(0, 0),
    m: 10,
    loop: function(angle) {
      const netForce = new Vector(0, 0);
      //m g sin theta
      const forceGrav = new Vector(-(this.m * g * Math.sin(angle)), 0);
      //mew m g cos theta
      const forceFric = new Vector((mew * this.m * g * Math.cos(angle)) * (this.vel.x < 0 ? 1 : -1), 0);

      netForce.add(forceGrav);
      netForce.add(forceFric);
      netForce.mult(1/20); //dt
      this.vel.add(netForce.div(this.m));

      this.pos.add(this.vel.div(20));
    },
    draw: function() {
      drawScreen.ctx.beginPath();
      drawScreen.ctx.rect(this.pos.x, this.pos.y, 40, 40);
      drawScreen.ctx.stroke();

      drawScreen.ctx.fillText(this.m + " kg", this.pos.x + 5, this.pos.y + 25);

      drawScreen.arrow(this.pos.x, this.pos.y + 10, this.pos.x - 41, this.pos.y + 10);
      drawScreen.ctx.fillText("F  sinθ", this.pos.x - 40, this.pos.y - 10);
      drawScreen.ctx.fillText("g", this.pos.x - 35, this.pos.y - 5);

      drawScreen.arrow(this.pos.x + 40, this.pos.y + 30, this.pos.x + 80, this.pos.y + 30);
      drawScreen.ctx.fillText("F", this.pos.x + 87, this.pos.y + 33);
      drawScreen.ctx.fillText("f", this.pos.x + 95, this.pos.y + 38);

      drawScreen.ctx.fillText("v = " + (this.vel.x).toFixed(0) + ". m/s", this.pos.x + 55, this.pos.y + 10);
      drawScreen.arrow(this.pos.x, this.pos.y + 20, this.pos.x + this.vel.x, this.pos.y + 20, "Blue");
    }
  };

  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("How do you find the work done by friction on an object", 60, 60);
    drawScreen.ctx.fillText("moving up two ramps?", 60, 130);

    drawScreen.ctx.font = "24px sans-serif";
    switch (slideAnim) {
      case 6:
        drawScreen.ctx.fillText("E  = K + W  = ½mv² + 2xmgμ = 0.5(10.)(48)² + 2(100.)(10.)(9.81)(0.20)", 515, 610);
        drawScreen.ctx.fillText("    ≈ 15400 J", 515, 650);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("T                            f", 532, 615);

        drawScreen.ctx.font = "24px sans-serif";
      case 5:
      case 4:
        drawScreen.ctx.fillText("E  = U  = mgh = (10)(9.81)(100tan(45°) + 100tan(30°))", 515, 490);
        drawScreen.ctx.fillText("    ≈ 15400 J", 515, 530);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("T             g", 532, 495);

        drawScreen.ctx.fillText("g = 9.81 m/s²", 65, 456);
        drawScreen.ctx.fillText("μ = 0.20 (Wood)", 65, 476);

        //Ramp 2
        drawScreen.ctx.beginPath();
        drawScreen.ctx.moveTo(220, 630);
        drawScreen.ctx.lineTo(220, 730);
        drawScreen.ctx.lineTo(120, 730);
        drawScreen.ctx.lineTo(220, 630);
        drawScreen.ctx.stroke();

        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(120, 730, 20, 0, -Math.PI/4, true);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("θ₁ = 45°", 140, 722);

        drawScreen.drawLine(120, 735, 120, 745);
        drawScreen.drawLine(120, 740, 220, 740);
        drawScreen.drawLine(220, 735, 220, 745);
        drawScreen.ctx.fillText("x = 100 m", 150, 755);

        drawScreen.ctx.beginPath();
        drawScreen.ctx.moveTo(320, 572);
        drawScreen.ctx.lineTo(320, 630);
        drawScreen.ctx.lineTo(220, 630);
        drawScreen.ctx.lineTo(320, 572);
        drawScreen.ctx.stroke();

        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(220, 630, 20, 0, -Math.PI/6, true);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("θ₂ = 30°", 255, 625);

        drawScreen.drawLine(225, 635, 225, 645);
        drawScreen.drawLine(225, 640, 320, 640);
        drawScreen.drawLine(320, 635, 320, 645);
        drawScreen.ctx.fillText("x = 100 m", 250, 655);

        drawScreen.ctx.save();
        drawScreen.ctx.translate(220, 630);
        drawScreen.ctx.rotate(section === 1 ? -Math.PI/6 : -Math.PI/4);

        box.draw();
        if (slideAnim >= 5) {
          if (section === 1) {
            box.loop(Math.PI/6);
            if (box.pos.x + 20 <= 0) {
              section--;
            }
          } else {
            if (box.pos.x + 20 >= -100 * Math.SQRT2) box.loop(Math.PI/4);
          }
        }

        drawScreen.ctx.restore();

        drawScreen.ctx.font = "24px sans-serif";
      case 3:
        drawScreen.ctx.fillText("Also, assume that they all have the same coefficient of friction μ. Then, mg(d₁μ₁cosθ₁ + d₂μ₂cosθ₂) = mgμ(d₁cosθ₁ + d₂cosθ₂)", 60, 380);
        drawScreen.ctx.fillText("= mgμ(cosθ₁(x/cosθ₁) + cosθ₂(x/cosθ₂)) = mgμ(x + x) = 2xmgμ", 60, 420);
      case 2:
        drawScreen.ctx.fillText("Assume that they all have the same baselength x, then d = x / cosθ.", 60, 310);
      case 1:
        drawScreen.ctx.font = "24px sans-serif";drawScreen.ctx.fillText("The total work done by friction is just the sum of the work that it did on each ramp: W  = W  + W", 60, 200);
        drawScreen.ctx.fillText("= d₁μ₁mgcosθ₁ + d₂μ₂mgcosθ₂ = mg(d₁μ₁cosθ₁ + d₂μ₂cosθ₂)", 60, 240);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("fT", 958, 202);
        drawScreen.ctx.fillText("f1", 1013, 202);
        drawScreen.ctx.fillText("f2", 1070, 202);

        //Ramp 2
        drawScreen.ctx.beginPath();
        drawScreen.ctx.moveTo(1350, 110);
        drawScreen.ctx.lineTo(1350, 260);
        drawScreen.ctx.lineTo(1200, 260);
        drawScreen.ctx.lineTo(1350, 110);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("x", 1270, 280);
        drawScreen.drawLine(1205, 265, 1205, 275);
        drawScreen.drawLine(1205, 270, 1350, 270);
        drawScreen.drawLine(1350, 265, 1350, 275);

        //Ramp 1
        drawScreen.ctx.beginPath();
        drawScreen.ctx.moveTo(1200, 260);
        drawScreen.ctx.lineTo(1200, 310);
        drawScreen.ctx.lineTo(1050, 310);
        drawScreen.ctx.lineTo(1200, 260);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("x", 1115, 330);
        drawScreen.drawLine(1050, 315, 1050, 325);
        drawScreen.drawLine(1050, 320, 1200, 320);
        drawScreen.drawLine(1200, 315, 1200, 325);

        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(1050, 310, 40, 0, -0.321750554, true);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("θ₁", 1100, 305);

        drawScreen.ctx.beginPath();
        drawScreen.ctx.arc(1200, 260, 20, 0, -Math.PI/4, true);
        drawScreen.ctx.stroke();

        drawScreen.ctx.fillText("θ₂", 1224, 253);

        drawScreen.ctx.save();
        drawScreen.ctx.translate(1230, 200);
        drawScreen.ctx.rotate(-Math.PI/4);

        drawScreen.ctx.beginPath();
        drawScreen.ctx.rect(-20, -20, 40, 40); // -20 -20 20 20
        drawScreen.ctx.stroke();
        drawScreen.ctx.fillText("m", -5, 5);

        drawScreen.arrow(0, 20, 0, 60);
        drawScreen.ctx.fillText("F  cosθ₂", 8, 60);
        drawScreen.ctx.fillText("g", 13, 65);

        drawScreen.arrow(0, -20, 0, -60);
        drawScreen.ctx.fillText("F", 5, -60);
        drawScreen.ctx.fillText("N", 10, -52);

        drawScreen.arrow(-20, -10, -60, -10);
        drawScreen.ctx.fillText("F  sinθ₂", -60, -30);
        drawScreen.ctx.fillText("g", -55, -25);

        drawScreen.arrow(-20, 10, -60, 10);
        drawScreen.ctx.fillText("F", -75, 13);
        drawScreen.ctx.fillText("f", -70, 18);

        drawScreen.ctx.restore();
        break;
    }

    drawScreen.ctx.font = "24px sans-serif";
  };
};
//Bruh.exe
//