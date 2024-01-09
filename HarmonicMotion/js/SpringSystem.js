class SpringSystem {
  constructor(startx, starty, k, type) {
    this.restPos = new Vector(startx, starty);
    this.wallPos = startx - 150;
    this.box = new Box(startx + 75, starty);
    this.k = k;
    this.type = type;
    this.graph = new Graph(startx + 200, starty, type === 3, type === 3);

    this.loop();
  }
  loop() {
    this.box.applyForce(-this.k * (this.box.pos.x - this.restPos.x), 0);

    this.box.loop();
  }
  draw(measuring) {
    drawScreen.drawLine(this.wallPos, this.restPos.y - 30, this.wallPos, this.restPos.y + 30);

    drawScreen.ctx.strokeStyle = "Red";
    drawScreen.drawLine(this.restPos.x, this.restPos.y - 30, this.restPos.x, this.restPos.y + 30);
    drawScreen.ctx.strokeStyle = "Black";

    drawScreen.drawSpring(this.wallPos, this.box.pos.x - l/2, this.restPos.y, 18);
    
    switch(measuring) {
      case 0: //Position
        const dist = this.box.pos.x - this.restPos.x;
        const txt = dist.toFixed(1) + " m";

        drawScreen.measureBarH(this.restPos.x, this.box.pos.x, this.restPos.y + l/2 + 17);
        drawScreen.fillText(txt, this.restPos.x - drawScreen.ctx.measureText(txt).width/2, this.restPos.y + l/2 + 35);

        if (looping) this.graph.add(-dist, 2.5);
        break;
      case 1: //Velocity
        const text = (this.box.vel.x).toFixed(1) + " m/s";

        drawScreen.arrow(this.box.pos.x + (this.box.vel.x < 0 ? -1 : 1) * l/2, this.box.pos.y, this.box.pos.x + this.box.vel.x/2, this.box.pos.y);
        drawScreen.fillText(text, this.restPos.x - drawScreen.ctx.measureText(text).width/2, this.restPos.y + l/2 + 35);

        if (looping) this.graph.add(-this.box.vel.x, 5);
        break;
      case 2: //Acceleration
        const toxt = (this.box.fSnap).toFixed(1) + " N";

        drawScreen.arrow(this.box.pos.x + (this.box.fSnap < 0 ? -1 : 1) * l/2, this.box.pos.y, this.box.pos.x + this.box.fSnap/40, this.box.pos.y, "Orange");
        
        drawScreen.fillText(toxt, this.restPos.x - drawScreen.ctx.measureText(toxt).width/2, this.restPos.y + l/2 + 35);

        if (looping) this.graph.add(-this.box.netForce.x, 100);
        break;
      case 3: //Energy
        const tooxt = (143269.5).toFixed(1) + " J";

        const x = this.box.pos.x - this.restPos.x;
        const ke = .5 * this.box.m * this.box.vel.x * this.box.vel.x;
        const epe = .5 * this.k * x * x;
        const total = ke + epe;

        drawScreen.fillText(tooxt, this.restPos.x - drawScreen.ctx.measureText(tooxt).width/2, this.restPos.y + l/2 + 35);

        if (looping) {
          this.graph.add(-ke, 5000, -epe, -143269.5);
        }
        break;
    }

    this.box.draw();
    this.graph.draw(measuring);
  }
}