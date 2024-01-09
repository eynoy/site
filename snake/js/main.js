const camera = {
  pos: vec3.fromValues(0, 100, -150),
  look: vec3.fromValues(0, 0, 0),
  perp: vec3.fromValues(0, 1, 0),
  transform: mat4.create(),
  updateTransform: function() {
    // Calculate a new camera transform
    mat4.lookAt(this.transform,
                this.pos,
                this.look,
                this.perp);
  }
};
camera.updateTransform();

let player = new Snake(new Vector2D(-2.5, -2.5));
let fruit = new Fruit(-5, -5);

const lose = () => {
  console.log("Lost");
  location.reload();
};

let mainDeltaT = 0;
const gameLoop = (elapsedTime) => {
  player.update();
  fruit.update();
};

const keyBinds = [
  [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.EAST, DIRECTION.WEST],
  [DIRECTION.EAST, DIRECTION.WEST, DIRECTION.SOUTH, DIRECTION.NORTH],
  [DIRECTION.SOUTH, DIRECTION.NORTH, DIRECTION.WEST, DIRECTION.EAST],
  [DIRECTION.WEST, DIRECTION.EAST, DIRECTION.NORTH, DIRECTION.SOUTH]
];

const getKeyBind = (dir) => keyBinds[(targetSide & 0xff) % 4][dir];

document.body.addEventListener("keydown", (e) => {
  if (options.mode === MODES.LOOP) {
      switch (e.keyCode) {
        case 40:
          if (player.body.length === 1 || player.vel != DIRECTION.SOUTH)
            player.vel = DIRECTION.NORTH;
          break;
        case 38:
          if (player.body.length === 1 || player.vel != DIRECTION.NORTH)
            player.vel = DIRECTION.SOUTH;
          break;
        case 37:
          if (player.body.length === 1 || player.vel != DIRECTION.EAST)
            player.vel = DIRECTION.WEST;
          break;
        case 39:
          if (player.body.length === 1 || player.vel != DIRECTION.WEST)
            player.vel = DIRECTION.EAST;
          break;
    }
  }
  else {
    switch (e.keyCode) {
      case 38:
        if (player.body.length === 1 || player.vel != getKeyBind(DIRECTION.SOUTH)) player.vel = getKeyBind(DIRECTION.NORTH);
        break;
      case 40:
        if (player.body.length === 1 || player.vel != getKeyBind(DIRECTION.NORTH)) player.vel = getKeyBind(DIRECTION.SOUTH);
        break;
      case 37:
        if (player.body.length === 1 || player.vel != getKeyBind(DIRECTION.EAST)) player.vel = getKeyBind(DIRECTION.WEST);
        break;
      case 39:
        if (player.body.length === 1 || player.vel != getKeyBind(DIRECTION.WEST)) player.vel = getKeyBind(DIRECTION.EAST);
        break;
      case 68: //press 'D'
        targetSide++;
        break;
      case 65: //press 'A'
        targetSide--;
        break;
      case 87: //press 'W'
        if (options.mode === MODES.CUBE) player.vel = DIRECTION.UP;
        break;
      case 83: //press 'S'
        if (options.mode === MODES.CUBE) player.vel = DIRECTION.DOWN;
        break;
    }
  }
});