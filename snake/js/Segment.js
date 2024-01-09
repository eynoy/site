class Segment {
  constructor(startpos, dir) {
    this.mesh = new Mesh(boxVertices, textures.SNAKE, vec3.fromValues(startpos.x, 2, startpos.y), 2);
    this.pos = startpos;

    this.gridPos = startpos.mult(1/gridSize);
    this.gridPos.x = Math.ceil(this.gridPos.x);
    this.gridPos.y = Math.ceil(this.gridPos.y);

    this.vel = dir;
  }
  add(v2d) {
    this.mesh.addVector(vec3.fromValues(v2d.x, 0, v2d.y));
    this.pos.add(v2d);
  }
  update() {
    meshes.loadMesh(this.mesh);
  }
}

class Segment3D {
  constructor(startpos, dir) {
    this.mesh = new Mesh(boxVertices, textures.SNAKE, vec3.fromValues(startpos.x, startpos.y, startpos.z), 2);
    this.pos = startpos;

    this.gridPos = startpos.mult(1/gridSize);
    this.gridPos.x = Math.ceil(this.gridPos.x);
    this.gridPos.y = Math.ceil(this.gridPos.y);
    this.gridPos.z = Math.ceil(this.gridPos.z);

    this.vel = dir;
  }
  add(v2d) {
    this.mesh.addVector(vec3.fromValues(v2d.x, v2d.y, v2d.z));
    this.pos.add(v2d);
  }
  update() {
    meshes.loadMesh(this.mesh);
  }
}

class LoopSegment {
  constructor(startpos, dir) {
    this.pos = startpos;
    this.vel = dir;
  }
  add(v2d) {
    this.pos.add(v2d);
  }
  update(ctx, percent, img, loaded) {
    if (loaded) {
      ctx.save();

      ctx.translate(this.pos.x * 12.8 + 2 + 10.5, this.pos.z * 12.8 + 2 + 11.5);

      let angle = 0;
      switch (this.vel) {
        case DIRECTION.SOUTH: angle = 0; break;
        case DIRECTION.NORTH: angle = Math.PI; break;
        case DIRECTION.EAST: angle = Math.PI / 2; break;
        case DIRECTION.WEST: angle = 3 * Math.PI / 2; break;
      }
      ctx.rotate(angle);
      
      ctx.drawImage(img, -10.5, -11.5, 21, 23);

      ctx.restore();

      const imgData = ctx.getImageData(this.pos.x * 12.8 + 2, this.pos.z * 12.8 + 2, 21, 23);
      for (let i = 0; i < img.width * img.height * 4; i += 4) {
        imgData.data[i] = imgData.data[i] + percent * -181;
        imgData.data[i + 1] = imgData.data[i + 1] + percent * 59;
        imgData.data[i + 2] = imgData.data[i + 2] + percent * 92;
      }
      ctx.putImageData(imgData, this.pos.x * 12.8 + 2, this.pos.z * 12.8 + 2);
    }
    else {
      ctx.fillStyle = "Pink";
      ctx.fillRect(this.pos.x * 12.8 + 2, this.pos.z * 12.8 + 2, 21, 21);
    }
  }
}