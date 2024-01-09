class Graph {
  constructor(x, y, second, third) {
    this.origin = new Vector(x, y);
    this.x_vals = [];
    this.y_vals = [];

    this.second = second;
    if (second) this.y_vals2 = [];
    this.third = third;
    if (third) this.y_vals3 = [];
  }
  add(y_val, spread, y_val2, y_val3) {
    this.x_vals.push(this.x_vals.length);
    this.y_vals.push(y_val / spread);

    if (this.x_vals.length > 200) {
      this.y_vals.shift();
      this.x_vals.pop();

      if (this.second) this.y_vals2.shift();
      if (this.third) this.y_vals3.shift();
    }

    if (this.second) this.y_vals2.push(y_val2 / spread);
    if (this.third) this.y_vals3.push(y_val3 / spread);
  }
  drawFunct(x_vals, y_vals, color) {
    drawScreen.ctx.strokeStyle = color;
    drawScreen.ctx.beginPath();
    drawScreen.ctx.moveTo(this.origin.x + x_vals[0], this.origin.y + y_vals[0]);
    for (let i = 1; i < this.y_vals.length; i++) {
      drawScreen.ctx.lineTo(this.origin.x + x_vals[i], this.origin.y + y_vals[i]);
    }
    drawScreen.ctx.stroke();
    drawScreen.ctx.strokeStyle = "Black";
  }
  draw(type) {
    drawScreen.drawLine(this.origin.x, this.origin.y, this.origin.x + 200, this.origin.y);
    drawScreen.drawLine(this.origin.x, this.origin.y + 40, this.origin.x, this.origin.y - 40);

    this.drawFunct(this.x_vals, this.y_vals, "Red");
    if (this.second) this.drawFunct(this.x_vals, this.y_vals2, "Purple");
    if (this.third) this.drawFunct(this.x_vals, this.y_vals3, "Pink");
    
    switch (type) {
      case 0:
        drawScreen.coloredPoint("Position", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals[this.y_vals.length-1], "Blue");
        break;
      case 1:
        drawScreen.coloredPoint("Velocity", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals[this.y_vals.length-1], "Green");
        break;
      case 2:
        drawScreen.coloredPoint("Force", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals[this.y_vals.length-1], "Orange");
        break;
      case 3:
        drawScreen.coloredPoint("KE", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals[this.y_vals.length-1], "Red");
        drawScreen.coloredPoint("EPE", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals2[this.y_vals.length-1], "Purple");
        drawScreen.coloredPoint("Total", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals3[this.y_vals.length-1], "Pink");
        break;
      case 4: 
        drawScreen.coloredPoint("Height", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals[this.y_vals.length-1], "Blue");
        break;
      case 5: 
        drawScreen.coloredPoint("Angle", this.origin.x + this.x_vals[this.x_vals.length-1], this.origin.y + this.y_vals[this.y_vals.length-1], "Turquoise");
        break;
    }
  }
}