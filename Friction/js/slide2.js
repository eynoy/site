const slide2 = () => {
  let slideAnim = 0;
  const slideAnimTotal = 5;

  document.body.onmouseup = (e) => {
    if (slideAnim < slideAnimTotal) slideAnim++;
    else {
      drawScreen.clearInterval();
      slide3();
      drawScreen.setLoop();
    }
  };

  const g = 9.81;
  const mew = 0.2; //wood

  const box = {
    pos: new Vector(150, -40),
    vel: new Vector(40, 0),
    m: 10,
    loop: function(angle) {
      if (this.vel.x > 0) {
        const netForce = new Vector(0, 0);
        const forceGrav = new Vector(-(this.m * g * Math.sin(angle)), 0);
        const forceFric = new Vector((mew * this.m * g * Math.cos(angle)), 0);

        netForce.add(forceGrav);
        netForce.add(forceFric);
        netForce.mult(1/20);
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

  const codeImage = new Image();
  codeImage.src = "Resources/code.png"

  mainLoop = () => {
    drawScreen.clear();

    drawScreen.ctx.font = "50px sans-serif";
    drawScreen.ctx.fillText("How do you model the motion of a box moving up", 60, 60);
    drawScreen.ctx.fillText("a ramp?", 60, 130);

    drawScreen.ctx.font = "24px sans-serif";
    switch (slideAnim) {
      case 5:
        box.loop(Math.PI/6);
      case 4:
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

        //Image
        drawScreen.ctx.drawImage(codeImage, 792, 417, 600, 214);
        
        drawScreen.ctx.font = "12px sans-serif";

        drawScreen.ctx.fillText("30°", 93, 795);

        drawScreen.ctx.fillText("g = 9.81 m/s²", 65, 436);
        drawScreen.ctx.fillText("μ = 0.20 (Wood)", 65, 456);
        drawScreen.ctx.fillText("Δt = 1/20 or 0.05 seconds", 65, 476);

        drawScreen.ctx.save();
        drawScreen.ctx.translate(65, 800);
        drawScreen.ctx.rotate(-Math.PI/6);

        box.draw();

        drawScreen.ctx.restore();

        drawScreen.ctx.font = "24px sans-serif";
      case 3:
        drawScreen.ctx.fillText("So, F  = F sinθ + F = F sinθ + μF = mgsinθ + μmgcosθ", 60, 350);

        drawScreen.ctx.font = "12px sans-serif";
        drawScreen.ctx.fillText("net          g                          f            g                              N", 113, 355);
        drawScreen.ctx.font = "24px sans-serif";
      case 2:
        drawScreen.ctx.fillText("F is just the net force on the object.", 60, 300);
      case 1:
        drawScreen.ctx.fillText("Well, we have v = d / Δt, a = v / Δt, and a = F / m", 60, 200);

        drawScreen.ctx.fillText("Rearranging, we have d = vΔt, v = aΔt.", 60, 250);

        drawScreen.ctx.font = "12px sans-serif";

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
        break;
    }
  };
};