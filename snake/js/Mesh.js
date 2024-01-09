const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

const numOfFloatsPerVertex = 8; //3 pos, 3 color

const meshes = {
  textures: [],
  vertices: [],
  meshLens: [],
  colors: [],
  clear() {
    this.colors.length = 0;
    this.textures.length = 0;
    this.vertices.length = 0;
    this.meshLens.length = 0;
  },
  loadMesh(mesh) {
    this.textures.push(mesh.texture);
    this.colors.push(mesh.color);

    for (let i = 0; i < mesh.vertices.length; i += numOfFloatsPerVertex) {
      this.vertices.push(mesh.vertices[i]);
      this.vertices.push(mesh.vertices[i+1]);
      this.vertices.push(mesh.vertices[i+2]);

      this.vertices.push(mesh.vertices[i+3]);
      this.vertices.push(mesh.vertices[i+4]);

      this.vertices.push(mesh.vertices[i+5]);
      this.vertices.push(mesh.vertices[i+6]);
      this.vertices.push(mesh.vertices[i+7]);
    }
    
    this.meshLens.push(mesh.vertices.length / numOfFloatsPerVertex);
  },
  bufferMeshes(gl) {
    const boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  },
  rebufferData(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  },
  setVertexAttrs(gl, program) {
    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    const textureAttribLocation = gl.getAttribLocation(program, 'vertTexPos');
    const normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
    gl.vertexAttribPointer(
      positionAttribLocation, // Attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE,
      numOfFloatsPerVertex * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
      textureAttribLocation, // Attribute location
      2, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE,
      numOfFloatsPerVertex * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
      normalAttribLocation, // Attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE,
      numOfFloatsPerVertex * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(textureAttribLocation);
    gl.enableVertexAttribArray(normalAttribLocation);
  },
  draw(gl, uSamplerLocation, additiveColorLocation) {
    let indexArrOffset = 0
    for (let i = 0; i < this.meshLens.length; i++) {
      gl.uniform3fv(additiveColorLocation, this.colors[i]);
      gl.uniform1i(uSamplerLocation, this.textures[i]);

      gl.drawArrays(gl.TRIANGLES, indexArrOffset, this.meshLens[i]);
      indexArrOffset += this.meshLens[i];
    }
  }
};

class Mesh {
  constructor(vertexArr, tex, pos, scale) {
    this.texture = tex;
    this.color = vec3.fromValues(0, 0, 0);
    this.vertices = Array.from(vertexArr);

    if (scale) {
      this.scaleBy(scale);
    }
    if (pos) {
      this.addVector(pos);
    }
  }
  addColor(r, g, b) {
    this.color[0] = r;
    this.color[1] = g;
    this.color[2] = b;
  }
  tesselateTex(numTimes) {
    for (let i = 0; i < this.vertices.length; i += numOfFloatsPerVertex) {
      this.vertices[i + 3] *= numTimes;
      this.vertices[i + 4] *= numTimes;
    }
  }
  invert() {
    const tempArr = [];

    for (let i = 0; i < this.vertices.length; i += numOfFloatsPerVertex * 3) {
      const p1 = this.vertices.slice(i, i + numOfFloatsPerVertex);
      p1[5] *= -1;
      p1[6] *= -1;
      p1[7] *= -1;

      const p2 = this.vertices.slice(i + numOfFloatsPerVertex, i + numOfFloatsPerVertex * 2);
      p2[5] *= -1;
      p2[6] *= -1;
      p2[7] *= -1;

      const p3 = this.vertices.slice(i + numOfFloatsPerVertex * 2, i + numOfFloatsPerVertex * 3);
      p3[5] *= -1;
      p3[6] *= -1;
      p3[7] *= -1;
      
      Array.prototype.push.apply(tempArr, p1);
      Array.prototype.push.apply(tempArr, p3);
      Array.prototype.push.apply(tempArr, p2);
    }
    this.vertices = tempArr;
  }
  scaleBy(scale) {
    for (let i = 0; i < this.vertices.length; i += numOfFloatsPerVertex) {
      this.vertices[i] *= scale;
      this.vertices[i + 1] *= scale;
      this.vertices[i + 2] *= scale;
    }
  }
  addVector(vec) {
    for (let i = 0; i < this.vertices.length; i += numOfFloatsPerVertex) {
      this.vertices[i] += vec[0];
      this.vertices[i + 1] += vec[1];
      this.vertices[i + 2] += vec[2];
    }
  }
}