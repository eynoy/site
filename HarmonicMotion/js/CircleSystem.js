const mag = 35;

class CircleSystem {
  constructor(centerx, centery) {
    this.c = new Vector(centerx, centery);
    this.graph = new Graph(centerx + 50, centery);

    this.angle = 0;

    this.loop();
  }
  loop() {
    this.angle += Math.PI / 100;

    this.pointPos = Vector.fromAngle(-this.angle, mag);
    this.graph.add(this.pointPos.y, 1);
  }
  draw() {
    drawScreen.ctx.beginPath();
    drawScreen.ctx.arc(this.c.x, this.c.y, mag, 0, 2 * Math.PI);
    drawScreen.ctx.stroke();
    
    drawScreen.coloredPoint("P", this.c.x + this.pointPos.x, this.c.y + this.pointPos.y, "Blue");

    drawScreen.ctx.globalAlpha = 0.2;
    drawScreen.drawLine(this.c.x + this.pointPos.x, this.c.y + this.pointPos.y, this.graph.origin.x + this.graph.x_vals[this.graph.x_vals.length-1], this.c.y + this.pointPos.y);
    drawScreen.ctx.globalAlpha = 1.0;

    this.graph.draw(4);

    drawScreen.ctx.drawImage(circDerImg, this.c.x, this.graph.origin.y + 50, 400, 216);
  }
}