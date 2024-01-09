//Yeah... this code is very messy and all over the place
var walls, r, showing = true, showingFloors = true, keys = [];
var wallTexture, floorTexture;

const mod = (x, n) => (x % n + n) % n;

const infoH = 512;
const infoW = 512;
const fov = 60; //in degrees
const quality = 4; //window.innerWidth / fov for highest
const textConst = 2;
const turnSpeed = 5;
const wallHeight = 64;
const playerHeight = 32;
const distPlayerToPlane = 277;

var sinTable = [];
var cosTable = [];
var invCosTable = [];

function arcToRad(deg) {
  return deg * Math.PI/180;
}

function nMap(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function Vector2D(x, y) {
  this.x = x;
  this.y = y;
  this.normalize = function() {
    const len = Math.sqrt((this.x * this.x) + (this.y * this.y));
    this.x = this.x/len;
    this.y = this.y/len;
  }
  this.add = function(other) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }
  this.dist = function(other) {
    return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
  }
}

function fromAngle(angle, length) {
  if (typeof length === 'undefined') {
    length = 1;
  }
  return new Vector2D(length * Math.cos(angle), length * Math.sin(angle));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function drawLine(point1, point2) {
  gameScreen.ctx.beginPath();
  gameScreen.ctx.moveTo(point1.x, point1.y);
  gameScreen.ctx.lineTo(point2.x, point2.y);
  gameScreen.ctx.stroke();
}

function fillCircle(x, y, radius) {
  gameScreen.ctx.beginPath();
  gameScreen.ctx.arc(x, y, radius, 0, 2 * Math.PI);
  gameScreen.ctx.fill();
}

function Boundary(x1, y1, x2, y2) {
  this.points = [new Vector2D(x1, y1), new Vector2D(x2, y2)];
  this.show = function() {
    drawLine(this.points[0], this.points[1]);
  }
}

function Ray(pos, angle) {
  this.pos = pos;
  this.dir = fromAngle(angle);
  this.setAngle = function(angle) {
    this.dir = fromAngle(angle);
  }
  this.lookAt = function(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }
  this.show = function() {
    gameScreen.ctx.beginPath();
    gameScreen.ctx.moveTo(this.pos.x, this.pos.y);
    gameScreen.ctx.lineTo(this.pos.x + 10 * this.dir.x, this.pos.y + 10 * this.dir.y);
    gameScreen.ctx.stroke();
  }
  this.cast = function(wall) {
    const x1 = wall.points[0].x;
    const y1 = wall.points[0].y;
    const x2 = wall.points[1].x;
    const y2 = wall.points[1].y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = new Vector2D(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
      return pt;
    }
    return;
  }
}

function Particle() {
  this.pos = new Vector2D(150, 200);
  this.rays = [];
  this.offset = 0; //offset
  this.seen = [];
  for (let i = -fov/2; i < fov/2; i += 1 / quality) {
    this.rays.push(new Ray(this.pos, arcToRad(i)));
  }
  this.getAngle = function() {
    return this.offset / quality;
  }
  this.getSin = function(col) {
    return sinTable[mod(Math.round(col + this.offset), 360*quality)];
  }
  this.getCos = function(col) {
    return cosTable[mod(Math.round(col + this.offset), 360*quality)];
  }
  this.rotate = function(angle) {
    this.offset = mod(this.offset + angle, 360*quality);
    if (this.offset < 0) this.offset += 360*quality;
    for (let i = 0, j = -fov/2 + this.getAngle(); j < fov/2 + this.getAngle(); i++, j += 1 / quality) {
      this.rays[i].setAngle(arcToRad(j));
    }
  }
  this.moveTo = function(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
  this.moveForward = function(dist) {
    this.pos.x += this.getCos(0) * dist;
    this.pos.y += this.getSin(0) * dist;
  }
  this.look = function(walls) {
    this.seen = [];
    const scene = [];
    for (let i = 0; i < this.rays.length; i++) {
      let closest = null;
      let record = Number.MAX_VALUE;
      for (let wall of walls) {
        const pt = this.rays[i].cast(wall);
        if (pt) {
          const d = this.pos.dist(pt);
          if (d < record) {
            record = d;
            closest = {
              point: pt,
              wall: wall
            }
          }
        }
      }
      if (closest){
        scene.push(record * Math.cos(arcToRad(this.getAngle()) - Math.atan2(this.rays[i].dir.y, this.rays[i].dir.x)));
        this.seen.push(closest);
      }
    }
    return scene;
  }
  this.show = function() {
    fillCircle(this.pos.x, this.pos.y, 8);
    if (this.seen.length > 0) for (let i = 0; i < this.seen.length; i++) drawLine(this.pos, this.seen[i].point);
  }
}

function whichWallSlice(i) {
  return player.seen[i].wall.points[0].dist(player.seen[i].point) * textConst  % (64 / textConst);
}

var gameScreen = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.canvas.id = "gameScreen";
    this.ctx.font = "40px IBM Plex Sans";
    this.ctx.strokeStyle = "rgba(255,255,255,0.39215686274)";
    this.ctx.fillStyle = "white";
    this.frameNo = 0;
    //Game Objects
    walls = []
    for (let i = 0; i < 5; i++) {
      walls.push(new Boundary(getRandomInt(infoW), getRandomInt(infoH), getRandomInt(infoW), getRandomInt(infoH)));
    }
    walls.push(new Boundary(0, 0, infoW, 0));
    walls.push(new Boundary(infoW, 0, infoW, infoH));
    walls.push(new Boundary(infoW, infoH, 0, infoH));
    walls.push(new Boundary(0, infoH, 0, 0));
    player = new Particle();

    let angle = 0;
    while (angle < 360*quality*quality) {
      let rad = arcToRad(angle);
      sinTable.push(Math.sin(rad));
      cosTable.push(Math.cos(rad));
      angle += 1/(quality);
    }

    for (let i = 0; i < window.innerWidth; i++) {
      invCosTable[i] = (1.0/Math.cos(arcToRad((-fov/2) + (i / quality))));
    }

    wallTexture = new Image();
    wallTexture.onload = function() {
      floorTexture  = new Image();
      floorTexture.onload = function() {
        this.interval = setInterval(updateGameArea, 10);
      }
      floorTexture.src = "Resources/floortileset.png";
    }
    wallTexture.src = "Resources/wall.png";
  },
  clear: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  reset: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.font = "40px IBM Plex Sans";

    //Game Helpers
    let angle = 0;
    while (angle < 360*quality*quality) {
      let rad = arcToRad(angle);
      sinTable.push(Math.sin(rad));
      cosTable.push(Math.cos(rad));
      angle += 1/(quality);
    }

    for (let i = 0; i < window.innerWidth; i++) {
      invCosTable[i] = (1.0/Math.cos(arcToRad((-fov/2) + (i / quality))));
    }
    this.interval = setInterval(updateGameArea, 10);
  }
}

document.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    if (e.keyCode == 32) {
      showing = !showing;
    }
    if (e.keyCode == 27) {
      showingFloors = !showingFloors;
    }
});
document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

window.addEventListener('resize', function() {
  gameScreen.reset();
});

function updateGameArea() {
  gameScreen.clear();
  let scene = player.look(walls);
  const slice = gameScreen.canvas.width / scene.length;
  for (let i = 0; i < scene.length; i++) {
    //const sq = scene[i] * scene[i];
    //const sliceSq = infoW * infoW;
    const d = scene[i] / infoW;
    const b = (5 / d ** 2) /255;
    let h = (wallHeight / scene[i]) * distPlayerToPlane;
    const y = (gameScreen.canvas.height / 2) - (h/2);

    gameScreen.ctx.globalAlpha = b;
    gameScreen.ctx.drawImage(wallTexture, whichWallSlice(i), 0, 1, wallTexture.height, i * slice, y, slice, h);

    if (showingFloors) {
      const cos = player.getCos(i - scene.length/2);
      const sin = player.getSin(i - scene.length/2);
      const relInverseCos = invCosTable[i];
      
      for (let j = y + h ; j < gameScreen.canvas.height; j += slice/2) {
        const ratio = (playerHeight/(j - gameScreen.canvas.height/2));

        const diagonalDistance = (distPlayerToPlane * ratio) * relInverseCos;

			  let yEnd = diagonalDistance * sin;
			  let xEnd = diagonalDistance * cos;

        xEnd = Math.floor(player.pos.x + xEnd);
			  yEnd = Math.floor(player.pos.y + yEnd);

        const e =  diagonalDistance / infoW;
        const c = (5 / e ** 2) /255;
		
			  // Translate relative to viewer coordinates:
        gameScreen.ctx.globalAlpha = c;

        gameScreen.ctx.drawImage(floorTexture, mod(xEnd, 64), mod(yEnd, 64), 1, 1, i * slice, j, slice, slice/2);
      }
    }
    else {
      gameScreen.ctx.globalAlpha = 1;
      gameScreen.ctx.fillStyle = "#c2b280";
      gameScreen.ctx.fillRect(i * slice, y + h, slice + 5, gameScreen.canvas.height - (y + h));
    }
  }

  if (showing) {
    gameScreen.ctx.fillStyle = "black";
    gameScreen.ctx.fillRect(0, 0, infoW, infoH)
    gameScreen.ctx.strokeStyle = "rgb(255,255,255)";
    for (let wall of walls) wall.show();
    gameScreen.ctx.strokeStyle = "rgba(255,255,255,0.39215686274)";
    gameScreen.ctx.fillStyle = "white";
    player.show();
  }
  

  if (gameScreen.frameNo < 300) {
    gameScreen.ctx.fillText("Use the arrow keys to move around.", gameScreen.canvas.width - 660, 40);
    gameScreen.ctx.fillText("Use the space to toggle overhead view.", gameScreen.canvas.width - 710, 80);
    gameScreen.ctx.fillText("Use the esc button to toggle textured floors.", gameScreen.canvas.width - 810, 120);
  }

  if (keys[37]) {
    player.rotate(-turnSpeed);
  }
  if (keys[38]) {
    player.moveForward(3);
  }
  if (keys[39]) {
    player.rotate(turnSpeed);
  }
  if (keys[40]) {
    player.moveForward(-3);
  }

  gameScreen.frameNo++;
}