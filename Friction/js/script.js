let mainLoop;

const drawScreen = {
  canvas: document.getElementById("drawScren"),
  start: function() {
    while (this.canvas === null) this.canvas = document.getElementById("drawScren");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.ctx = setupCanvas(this.canvas);

    this.ctx.fillStyle = "Black";
    this.ctx.strokeStyle = "Black";
    this.ctx.lineWidth = 1;

    slide1();
    this.setLoop();
  },
  setLoop: function() {
    this.interval = setInterval(mainLoop, 20);
  },
  clearInterval: function() {
    clearInterval(this.interval);
  },
  coloredPoint: function(name, x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = "Black";

    
    this.ctx.fillText(name, x + 10, y);
  },
  drawLine: function(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  },
  drawSpring: function(x1, x2, y) {
    const fulldist = x2 - x1;
    const step = fulldist / 9;

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y);
    for (let i = 1; i < 9; i++) {
      this.ctx.lineTo(x1 + i * step, y + 5 * Math.pow(-1, i));
    }
    this.ctx.lineTo(x2, y);
    this.ctx.stroke();
  },
  drawRightTri: function(x1, y1, x2, y2) {
    if (y2 > y1) {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x1, y2);
      this.ctx.lineTo(x2, y2);
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
    }
    else {
      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(x2, y1);
      this.ctx.lineTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
  },
  drawRect: function(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
  },
  arrow: function(fromx, fromy, tox, toy, color) {
    if (Math.abs(fromx - tox) <= 5 && Math.abs(fromy - toy) <= 5) return;

    if (color) this.ctx.strokeStyle = color;
    else this.ctx.strokeStyle = "Green";
    this.ctx.lineWidth = 2;

    const headlen = 10; // length of head in pixels
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);

    this.ctx.beginPath();
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();

    this.ctx.strokeStyle = "Black";
    this.ctx.lineWidth = 1;
  },
  clear: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};