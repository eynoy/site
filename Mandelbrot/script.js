const gpu = new GPU();

const width = window.innerWidth;
const height = window.innerHeight;

let scale = 0.01;
let maxItterations = Math.sqrt(2 * Math.sqrt(Math.abs(1 - Math.sqrt(5 * (1/scale))))) * 66.5;

const translation = {
  x: ((-width/2) * scale),
  y: ((-height/2) * scale)
};

const WorldToScreen = (fWorldX, fWorldY) => {
	const screenX = (fWorldX - translation.x) / scale;
	const screenY = (fWorldY - translation.y) / scale;
  return {screenX, screenY};
};

const ScreenToWorld = (nScreenX, nScreenY) => {
	const worldX = (nScreenX * scale) + translation.x;
	const worldY = (nScreenY * scale) + translation.y;
  return {worldX, worldY};
};

const render = gpu.createKernel(function(height,translation_x, translation_y, numPerPixel, maxItts) {
  let num_r = this.thread.x;
  let num_i = height - this.thread.y;

  let base_r = 0.0;
  let base_i = 0.0;

  let itterations = 0;
  while (Math.sqrt((base_r * base_r) + (base_i * base_i)) <= 2.0) {
    if (itterations > maxItts) {
      break;
    }

    //<function>

    //Square it
    const real = base_r;
    base_r = (base_r * base_r) - (base_i * base_i);
    base_i = 2.0 * real * base_i;

    //Add Value
    base_r += (num_r * numPerPixel) + translation_x;
    base_i += (num_i * numPerPixel) + translation_y;

    //</function>

    itterations++;
  }

  const isInSet = Math.sqrt(itterations / maxItts);

  this.color(isInSet, isInSet, isInSet, 1); //all between 0 and 1
}).setGraphical(true).setOutput([width, height]);


const redraw = () => {
  render(height, translation.x, translation.y, scale, maxItterations/2.5);
};

redraw();

const canvas = render.canvas;
canvas.oncontextmenu = () => { return false; };
document.body.appendChild(canvas);

const startPan = {
  x: 0,
  y: 0
};

let panning = false;
let zooming = false;
document.addEventListener("mousedown", (e) => {
  if (e.button === 0) {//left
    startPan.x = e.clientX;
    startPan.y = e.clientY;
    panning = true;
  }
});


const zoomInFactor = 0.95;
const zoomOutFactor = 1 / zoomInFactor;
const ittAdd = 0.2;
document.addEventListener("mousewheel", (e) => {
  const {worldX: worldXbefore, worldY: worldYbefore} = ScreenToWorld(e.clientX, e.clientY);

  if (e.wheelDeltaY < 0) {
    scale *= zoomInFactor ;
  }
  else if (e.wheelDeltaY > 0) {
    scale *= zoomOutFactor;
  }
  maxItterations = Math.sqrt(2 * Math.sqrt(Math.abs(1 - Math.sqrt(5 * (1/scale))))) * 66.5;
  //Thanks to https://math.stackexchange.com/a/30560 for this answer

  const {worldX: worldXafter, worldY: worldYafter} = ScreenToWorld(e.clientX, e.clientY);

  translation.x += (worldXbefore - worldXafter);
  translation.y += (worldYbefore - worldYafter);

  redraw();
});

document.addEventListener("mouseup", (e) => {
  panning = false;
});

document.addEventListener("mousemove", (e) => {
  if (panning) {
    translation.x -= (e.clientX - startPan.x) * scale;
    translation.y -= (e.clientY - startPan.y) * scale;

    redraw();
    
    startPan.x = e.clientX;
    startPan.y = e.clientY;
  }

  const {worldX: real, worldY: im} = ScreenToWorld(e.clientX, e.clientY);
  if (window.performance.now() > 20000) {
    document.getElementById("position").innerText = "The mouse is currently on: " + Number.parseFloat(real).toPrecision(7) + " + " + Number.parseFloat(im).toPrecision(7) + "i";
  } else {
    document.getElementById("position").innerText = "Hold the mouse and drag to pan, and scroll in or out to zoom in or out.\nThe mouse is currently on: " + Number.parseFloat(real).toPrecision(7) + " + " + Number.parseFloat(im).toPrecision(7) + "i";
  }
});