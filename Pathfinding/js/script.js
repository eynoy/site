document.addEventListener('contextmenu', event => event.preventDefault());

const MODIFIERS = {
  NONE: 0,
  CTRL: 1,
  ALT: 2
};

let modKey = MODIFIERS.NONE;

const mouse = {
  pos: [0,0],
  pressed: false
};

//https://www.html5rocks.com/en/tutorials/canvas/hidpi/#toc-1
const setupCanvas = (canvas) => {
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || 1;

  canvas.width = canvas.width * dpr;
  canvas.height = canvas.height * dpr;

  let ctx = canvas.getContext('2d');
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  //Scale it down so it fits
  canvas.style = "zoom: " + (1/dpr) + ";";
  return ctx;
};

const drawScreen = {
  canvas: document.getElementById("drawScren"),
  start: function() {
    while (this.canvas == null) this.canvas = document.getElementById("drawScren");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - document.getElementById("notCanvas").clientHeight;

    drawScreen.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect(); 
      mouse.pos[0] = event.clientX - rect.left; 
      mouse.pos[1] = event.clientY - rect.top + document.getElementById("notCanvas").clientHeight;
    });

    drawScreen.canvas.addEventListener("mousedown", (e) => {
      mouse.pressed = true;
    });

    drawScreen.canvas.addEventListener("mouseup", (e) => {
      mouse.pressed = false;
    });

    drawScreen.canvas.addEventListener("mousemove", (e) => {
      if (mouse.pressed) {
        const row = Math.floor((mouse.pos[1] - buffer)/totalSize);
        const col = Math.floor((mouse.pos[0] - buffer)/totalSize);
        if (row >= 0 && row < board.tileRows && col >= 0 && col < board.tileCols) {
          switch (modKey) {
            case MODIFIERS.CTRL:
              board.startTile.x = col;
              board.startTile.y = row;
              break;
            case MODIFIERS.ALT:
              board.endTile.x = col;
              board.endTile.y = row;
              break;
            default:
            case MODIFIERS.NONE:
              board.tiles[row][col].isBlock = board.addMode;
          }
          board.reset();
        }
      }
    });

    document.body.addEventListener("keydown", (e) => {
      if (e.keyCode === 17)
        modKey = MODIFIERS.CTRL;
      else if (e.keyCode === 18)
        modKey = MODIFIERS.ALT;
      else 
        modKey = MODIFIERS.NONE;
    });

    document.body.addEventListener("keyup", (e) => {
      modKey = MODIFIERS.NONE;
    });

    this.ctx = setupCanvas(this.canvas);
    this.ctx.fillStyle = "Black";
    this.ctx.strokeStyle = "Black";
  
    board.setup();

    this.interval = setInterval(mainLoop, 5);
  },
  drawLine: function(x1, y1, x2, y2) {
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
  },
  clear: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};