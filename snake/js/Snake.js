const gridSize = 5;

const DIRECTION = {
  NORTH: 0,
  SOUTH: 1,
  WEST: 2,
  EAST: 3,
  UP: 4,
  DOWN: 5,
  NONE: 6,
  vels: [new Vector2D(0,  1),
         new Vector2D(0, -1),
         new Vector2D(-1, 0),
         new Vector2D(1,  0), 
         new Vector2D(0,  0),
         new Vector2D(0,  0),
         new Vector2D(0,  0)],
  vels3d:[new Vector3D(0,  0, 1),
         new Vector3D(0, 0, -1),
         new Vector3D(-1, 0, 0),
         new Vector3D(1,  0, 0), 
         new Vector3D(0,  1, 0),
         new Vector3D(0,  -1, 0),
         new Vector3D(0,  0, 0)],
  dirs: [],
  dirs3d: []
};
DIRECTION.dirs = Array.from(DIRECTION.vels, i => i.copy());
DIRECTION.dirs3d = Array.from(DIRECTION.vels3d, i => i.copy());
DIRECTION.vels.forEach((val) => val.div(1/gridSize));
DIRECTION.vels3d.forEach((val) => val.div(1/gridSize));

class Snake {
  constructor(startpos) {
    this.vel = DIRECTION.NONE;
    this.frontPos = new Vector2D(Math.ceil(startpos.x / gridSize), Math.ceil(startpos.y / gridSize));
    this.body = [new Segment(startpos, this.vel)];
  }
  hasSegOn(coord) {
    for (let i = 0; i < this.body.length; i++) {
      if (coord.equals(this.body[i].gridPos))
        return true;
    }
    return false;
  }
  update() {
    //Update Pos
    this.frontPos.add(DIRECTION.dirs[this.vel]);

    if (this.frontPos.x < -9 || this.frontPos.x > 10 || this.frontPos.y < -9 || this.frontPos.y > 10) {
      lose();
    }
    else {
      if (this.frontPos.equals(fruit.gridPos)) {
        this.eat();
        fruit.getEaten();
      }

      for (let i = 1; i < this.body.length; i++) {
        if (this.frontPos.equals(this.body[i].gridPos)) {
          lose();
        }
      }

      //Add one at front
      const furthestPos = this.body[this.body.length-1].pos;
      furthestPos.add(DIRECTION.vels[this.vel]);
      this.body.push(new Segment(furthestPos, this.vel));

      //rid of back
      this.body.shift();
    }

    for (let i = 0; i < this.body.length; i++) {
      if (this.body.length > 1) {
        const percent = (this.body.length-1-i) % 2;
        this.body[i].mesh.addColor(percent * -0.710, percent * 0.231, percent *  0.361);
      }
      this.body[i].update();
    }
  }
  eat() {
    const last = this.body[0];
    this.body.unshift(new Segment(last.pos.sub(DIRECTION.vels[last.vel]), last.vel));
  }
}

class Snake3D {
  constructor(startpos) {
    this.vel = DIRECTION.NONE;
    this.frontPos = new Vector3D(Math.ceil(startpos.x / gridSize), Math.ceil(startpos.y / gridSize), Math.ceil(startpos.z / gridSize));
    this.body = [new Segment3D(startpos, this.vel)];
  }
  hasSegOn(coord) {
    for (let i = 0; i < this.body.length; i++) {
      if (coord.equals(this.body[i].gridPos))
        return true;
    }
    return false;
  }
  update() {
    //Update Pos
    this.frontPos.add(DIRECTION.dirs3d[this.vel]);

    if (this.frontPos.x < -9 || this.frontPos.x > 10 || this.frontPos.y < -9 || this.frontPos.y > 10 || this.frontPos.z < -9 || this.frontPos.z > 10) {
      lose();
    }
    else {
      if (this.frontPos.equals(fruit.gridPos)) {
        this.eat();
        fruit.getEaten();
      }

      for (let i = 1; i < this.body.length; i++) {
        if (this.frontPos.equals(this.body[i].gridPos)) {
          lose();
        }
      }

      //Add one at front
      const furthestPos = this.body[this.body.length-1].pos;
      furthestPos.add(DIRECTION.vels3d[this.vel]);
      this.body.push(new Segment3D(furthestPos, this.vel));

      //rid of back
      this.body.shift();

      for (let i = 0; i < this.body.length; i++) {
        if (this.body.length > 1) {
          const percent = (this.body.length-1-i) % 2;
          this.body[i].mesh.addColor(percent * -0.710, percent * 0.231, percent *  0.361);
        }
        this.body[i].update();
      }
    }
  }
  eat() {
    const last = this.body[0];
    this.body.unshift(new Segment3D(last.pos.sub(DIRECTION.vels3d[last.vel]), last.vel));
  }
}

class LoopSnake {
  constructor() {
    this.vel = DIRECTION.NONE;
    this.frontPos = new Vector3D(0, 0, 0);
    this.body = [new LoopSegment(this.frontPos, this.vel)];

    this.loaded = false;
    this.img = new Image();
    this.img.onload = () => this.loaded = true;
    this.img.src = "resources/snake.png";
  }
  hasSegOn(coord) {
    for (let i = 0; i < this.body.length; i++) {
      if (coord.equals(this.body[i].pos))
        return true;
    }
    return false;
  }
  update() {
    //Add one at front
    this.frontPos.add(DIRECTION.dirs3d[this.vel]);
    this.frontPos.add(DIRECTION.dirs3d[this.vel]);

    for (let i = 1; i < this.body.length; i++) {
      if (this.frontPos.equals(this.body[i].pos)) {
        lose();
      }
    }

    if (this.frontPos.x > 18) {
      this.offRight(this.frontPos);
    }
    else if (this.frontPos.x < 0) {
      this.offLeft(this.frontPos);
    }
    else if (this.frontPos.z < 0) {
      this.offTop(this.frontPos);
    }
    else if (this.frontPos.z > 18) {
      this.offBottom(this.frontPos);
    }

    if (this.frontPos.equals(fruit.gridPos)) {
      this.eat();
      fruit.getEaten();
    }

    this.body.push(new LoopSegment(this.frontPos.copy(), this.vel));

    //rid of back
    this.body.shift();
  }
  offRight(pos) {
    pos.x = 0;
    switch (pos.y) { //POSX, NEGX, POSY, NEGY, POSZ, NEGZ
      case 0:
        pos.y = 5;
        break;
      case 1:
        pos.y = 4;
        break;
      case 2:
        pos.x = 18 - pos.z;
        pos.y = 0;
        pos.z = 0;
        this.vel = DIRECTION.NORTH;
        break;
      case 3:
        pos.x = pos.z;
        pos.y = 0;
        pos.z = 18;
        this.vel = DIRECTION.SOUTH;
        break;
      case 4:
        pos.y = 0;
        break;
      case 5:
        pos.y = 1;
        y_axis_rotations--;
        break;
    }
    targetSide = pos.y;
  }
  offLeft(pos) {
    pos.x = 18;
    switch (pos.y) { //POSX, NEGX, POSY, NEGY, POSZ, NEGZ
      case 0:
        pos.y = 4;
        break;
      case 1:
        pos.y = 5;
        y_axis_rotations++;
        break;
      case 2:
        pos.x = pos.z;
        pos.y = 1;
        pos.z = 0;
        this.vel = DIRECTION.NORTH;
        break;
      case 3:
        pos.x = 18 - pos.z;
        pos.y = 1;
        pos.z = 18;
        this.vel = DIRECTION.SOUTH;
        break;
      case 4:
        pos.y = 1;
        break;
      case 5:
        pos.y = 0;
        break;
    }
    targetSide = pos.y;
  }
  offTop(pos) {
    switch (pos.y) { //POSX, NEGX, POSY, NEGY, POSZ, NEGZ
      case 0:
        pos.z = 18 - pos.x;
        pos.x = 18;
        this.vel = DIRECTION.WEST;
        pos.y = 2;
        break;
      case 1:
        pos.z = pos.x;
        pos.x = 0;
        this.vel = DIRECTION.EAST;
        pos.y = 2;
        break;
      case 2:
        pos.x = 18 - pos.x;
        pos.y = 5;
        pos.z = 0;
        this.vel = DIRECTION.NORTH;
        break;
      case 3:
        pos.y = 4;
        pos.z = 18;
        break;
      case 4:
        pos.z = 18;
        pos.y = 2;
        break;
      case 5:
        pos.x = 18 - pos.x;
        pos.z = 0;
        this.vel = DIRECTION.NORTH;
        pos.y = 2;
        break;
    }
    targetSide = pos.y;
  }
  offBottom(pos) {
    switch (pos.y) { //POSX, NEGX, POSY, NEGY, POSZ, NEGZ
      case 0:
        pos.z = pos.x;
        pos.x = 18;
        pos.y = 3;
        this.vel = DIRECTION.WEST;
        break;
      case 1:
        pos.z = 18 - pos.x;
        pos.x = 0;
        pos.y = 3;
        this.vel = DIRECTION.EAST;
        break;
      case 2:
        pos.y = 4;
        pos.z = 0;
        break;
      case 3:
        pos.x = 18 - pos.x;
        pos.y = 5;
        pos.z = 18;
        this.vel = DIRECTION.SOUTH;
        break;
      case 4:
        pos.y = 3;
        pos.z = 0;
        break;
      case 5:
        pos.x = 18 - pos.x;
        pos.y = 3;
        pos.z = 18;
        this.vel = DIRECTION.SOUTH;
        break;
    }
    targetSide = pos.y;
  }
  updateSide(ctx, side) {
    for (let i = 0; i < this.body.length; i++) {
      if (this.body[i].pos.y === side) {
        const percent = (this.body.length-1-i) % 2;
        this.body[i].update(ctx, percent, this.img, this.loaded);
      }
    }
  }
  eat() {
    const last = this.body[0];
    this.body.unshift(new LoopSegment(last.pos.sub(DIRECTION.dirs3d[last.vel]).sub(DIRECTION.dirs3d[last.vel]), last.vel));
  }
}