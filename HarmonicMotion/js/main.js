const s = new SpringSystem(200, 80, 50, 0);
const v = new SpringSystem(200, 220, 50, 1);
const a = new SpringSystem(200, 360, 50, 2);
const e = new SpringSystem(200, 500, 50, 3);

const c = new CircleSystem(800, 78);

let looping = false;

const mainLoop = () => {
  drawScreen.clear();

  drawScreen.fillText("k = 50 N/m", 10, 40);

  drawScreen.fillText("Simple Harmonic Motion happens whenever there is a \"restoring force\" that is directly proportional to the displacement and points opposite.", 10, 15);

  if (looping) s.loop();
  s.draw(0);

  if (looping) v.loop();
  v.draw(1);

  if (looping) a.loop();
  a.draw(2);

  if (looping) e.loop();
  e.draw(3);

  drawScreen.ctx.drawImage(periodSprImg, 150, 600);
  drawScreen.ctx.drawImage(periodGenImg, 1100, 25);

  if (looping) c.loop();
  c.draw();

  pendulumLoop(looping);
};