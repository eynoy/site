const dvdLogo = {
  pos: [0, 0],
  vel: [1, 1],
  img: null,
  loop: function() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    if (this.pos[0] <= 0 || this.pos[0] + 205 >= window.innerWidth) {
      this.vel[0] *= -1;
    }
    if (this.pos[1] <= 0 || this.pos[1] + 105 >= window.innerHeight) {
      this.vel[1] *= -1;
    }
  }
};

const drawScreen = {
  canvas: document.createElement("canvas"),
  start: function() {
    document.body.appendChild(this.canvas);
    this.canvas.style = "position: fixed; top: 0; left: 0;";

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "white";

    dvdLogo.img = new Image();
    dvdLogo.img.onload = () => {
      this.interval = setInterval(drawLoop, 5);
    };
    dvdLogo.img.src = "https://png.icons8.com/?id=31489&size=1600";
  },
  clear: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};


let onPage = true, timer = 0;
const changeStatus = (isInPage) => {
  timer = 0;
  onPage = isInPage;

  if (onPage) {
    drawScreen.canvas.width = 0;
    drawScreen.canvas.height = 0;
  }
  else {
    drawScreen.canvas.width = window.innerWidth;
    drawScreen.canvas.height = window.innerHeight;
    drawScreen.ctx = drawScreen.canvas.getContext("2d");
    drawScreen.ctx.fillStyle = "white";
    drawScreen.ctx.filter = `hue-rotate(${timer})`;
  }
}

document.onmouseout = function() {
  changeStatus(false);
}

document.onmousemove = function() {
  changeStatus(true);
}

const drawLoop = () => {
  drawScreen.clear();
  if (!onPage) {
    // if (timer >= 150) {
    //   drawScreen.canvas.style.background = "rgba(0, 0, 0, " + ((timer - 100)/255) +  ")";
    // }
    if (timer > 355) {
      drawScreen.ctx.drawImage(dvdLogo.img, dvdLogo.pos[0], dvdLogo.pos[1] - 50, 205, 205);
      drawScreen.canvas.style.filter = "hue-rotate(" + timer + "deg)";
      dvdLogo.loop();
    }
  }
  timer++;
};
