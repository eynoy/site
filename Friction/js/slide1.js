const slide1 = () => {
  let t = 0;

  let offset = 0;
  const colorStr = (str, x, y) => {
    let pos = x;
    for (let i = 0; i < str.length; i++) {
      const letter = str.substr(i, 1);
      drawScreen.ctx.fillStyle = colors[Math.floor(((i
       + offset) % str.length) * colors.length / str.length)];
      drawScreen.ctx.fillText(letter, pos, y);
      pos += drawScreen.ctx.measureText(letter).width;
    }
    if (t % 5 === 0) {
      offset--;
      if (offset === -1) offset = str.length-1;
    }
  };

  document.body.onmouseup = (e) => {
    drawScreen.clearInterval();
    slide2();
    drawScreen.setLoop();
  };

  mainLoop = () => {
    drawScreen.clear();
    drawScreen.ctx.font = "100px sans-serif";
    colorStr("Approximating Physics", 200, drawScreen.height / 2 - 50);

    drawScreen.ctx.fillStyle = "Black";
    drawScreen.ctx.font = "40px sans-serif";
    drawScreen.ctx.fillText("by Eyal Noy", 620, drawScreen.height / 2 + 50);

    t++;  
  };
};