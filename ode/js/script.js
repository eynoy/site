let plot, div;

let currentFlow;

let currentDiffEqX = (x, y) => -y*y;
let currentDiffEqY = (x, y) => x-0.3*y;

const canvasWidth = 800;
const canvasHeight = 800;
const numPixelsApart = 30;
const createVectorField = (min_x, max_x, min_y, max_y, firstOrderDiffEqX, firstOrderDiffEqY) => {
  let rows = canvasHeight / numPixelsApart;
  let cols = canvasWidth / numPixelsApart;

  const newVectorField = [];

  let totalIndex = 0;
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      const currentX = p5map(i, 0, cols, min_x, max_x);
      const currentY = p5map(j, 0, rows, min_y, max_y);

      newVectorField[totalIndex++] = {
        pos_x: currentX,
        pos_y: currentY,
        u: firstOrderDiffEqX(currentX, currentY),
        v: firstOrderDiffEqY(currentX, currentY),
      };
    }
  }

  return newVectorField;
};

const mainScreen = async () => {
  const vectorField = createVectorField(plotBBox.min_x,
                                         plotBBox.max_x,
                                         plotBBox.min_y,
                                         plotBBox.max_y,
                                         currentDiffEqX,
                                         currentDiffEqY);

  plot = createPlot(vectorField);

  div = document.getElementById("graphDiv");
  div.append(plot);

  div.style.minWidth = canvasWidth + "px";
  div.style.width = canvasWidth + "px";

  const plot_boundbox = document.querySelectorAll('[aria-label="vector"]')[0].getBoundingClientRect();

  const drawing_canvas = document.createElement("canvas");
  drawing_canvas.width = plot_boundbox.width;
  drawing_canvas.height = plot_boundbox.height;
  drawing_canvas.style.left = plot_boundbox.x + "px";
  drawing_canvas.style.top = plot_boundbox.y + "px";

  pixelBBox.min_x = 0;
  pixelBBox.min_y = 0;
  pixelBBox.max_x = plot_boundbox.width;
  pixelBBox.max_y = plot_boundbox.height;

  document.body.append(drawing_canvas);

  ctx = drawing_canvas.getContext("2d");
  ctx.lineWidth = 1;

  drawing_canvas.addEventListener("click", async (e) => {
    currentFlow = new Flow2D(p5map(e.layerX, pixelBBox.min_x, pixelBBox.max_x, plotBBox.min_x, plotBBox.max_x),
                             p5map(e.layerY, pixelBBox.max_y, pixelBBox.min_y, plotBBox.min_y, plotBBox.max_y),
                             "red");

    for (let i = 0; i < 10000; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      updateGraph();
    }
  });
};

let updateGraph = () => {
  ctx.clearRect(0, 0, pixelBBox.max_x, pixelBBox.max_y);

  if (currentFlow) {
    currentFlow.update(0.010, currentDiffEqX, currentDiffEqY);
    currentFlow.draw();
  }
};

const xDerivativeInputField = document.getElementById("x_deriv_input");
const yDerivativeInputField = document.getElementById("y_deriv_input");
let updateCanvas = () => {
  currentFlow = null;
  ctx.clearRect(0, 0, pixelBBox.max_x, pixelBBox.max_y);

  currentDiffEqX = Function("x", "y", "return " + xDerivativeInputField.value);
  currentDiffEqY = Function("x", "y", "return " + yDerivativeInputField.value);

  const vectorField = createVectorField(plotBBox.min_x,
                                         plotBBox.max_x,
                                         plotBBox.min_y,
                                         plotBBox.max_y,
                                         currentDiffEqX,
                                         currentDiffEqY);

  plot = createPlot(vectorField);
  div.removeChild(div.firstChild);
  div.append(plot);
};


