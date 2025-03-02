let ctx;
const mag = Math.hypot;

const plotBBox = {min_x: -10, max_x: 10, min_y: -6, max_y: 6,
                  contains: (x, y) => plotBBox.min_x <= x && x <= plotBBox.max_x
                                   && plotBBox.min_y <= y && y <= plotBBox.max_y };
plotBBox.diag_len = mag(plotBBox.max_x - plotBBox.min_x, plotBBox.max_y - plotBBox.min_y);

const pixelBBox = {min_x: -1, max_x: -1, min_y: -1, max_y: -1};

const createPlot = (vectorField) => {
  return Plot.plot({
    inset: 10,
    width: canvasWidth,
    height: canvasHeight,
    color: {
      label: "Speed",
      zero: true,
      legend: true
    },
    marks: [
      Plot.vector(vectorField, {
        x: "pos_x",
        y: "pos_y",
        rotate: ({u, v}) => Math.atan2(u, v) * 180 / Math.PI,
        length: ({u, v}) => Math.hypot(u, v),
        stroke: ({u, v}) => Math.hypot(u, v),
      })
    ],
  });
};

const p5map = (n, start1, stop1, start2, stop2) => {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

const numPixelsBetweenCurvePoints = 3.0;
const drawPlotCoordCurve = (xs, ys, vels, color) => {
  const pltCoordXs = xs.map(x => p5map(x, plotBBox.min_x, plotBBox.max_x, pixelBBox.min_x, pixelBBox.max_x));
  const pltCoordYs = ys.map(y => p5map(y, plotBBox.min_y, plotBBox.max_y, pixelBBox.max_y, pixelBBox.min_y));
  const pltCoordVs = vels.map(v => p5map(v, 0, plotBBox.diag_len, 0, pixelBBox.diag_len));

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(pltCoordXs[0], pltCoordYs[0]);

  let lastX = pltCoordXs[0], lastY = pltCoordYs[0];
  for (let i = 1; i < pltCoordYs.length; i++) {
    if (mag(pltCoordXs[i] - lastX, pltCoordYs[i] - lastY) < numPixelsBetweenCurvePoints) {
      continue;
    }

    ctx.lineTo(pltCoordXs[i], pltCoordYs[i]);
    lastX = pltCoordXs[i]; lastY = pltCoordYs[i];

    if (!plotBBox.contains(xs[i], ys[i])) {
      break;
    }
  }
  ctx.stroke();
  ctx.strokeStyle = "Black";
};

const drawCircle = (cx, cy, r, color) => {
  const pltCoord_cx = p5map(cx, plotBBox.min_x, plotBBox.max_x, pixelBBox.min_x, pixelBBox.max_x);
  const pltCoord_cy = p5map(cy, plotBBox.min_y, plotBBox.max_y, pixelBBox.max_y, pixelBBox.min_y);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pltCoord_cx, pltCoord_cy, r, 0, 2 * Math.PI);
  ctx.fill();
}

const sin = Math.sin;
const cos = Math.cos;
const log = Math.log;
const exp = Math.exp;