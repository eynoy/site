const isPowerOf2 = (value) => (value & (value - 1)) == 0;

const textures = {
  GRID: 0,
  SNAKE: 1,
  FRUIT: 2,
  texs: []
};

const initTextures = (gl, images, callback) => {
  const texturesArr = [];
  const promises = [];
  for (let i = 0; i < images.length; i++) {
    const image_src = images[i];
    const prom = new Promise((resolve, reject) => {
      const texture = gl.createTexture();
      if (!texture) {
        reject(new Error('Failed to create the texture object'));
      }
      texture.src = image_src;
      const image = new Image();
      if (!image) {
        reject(new Error('Failed to create the image object'));
      }
      image.onload = () => {
        texturesArr.push(texture);
        loadTexture(gl, image, texture);
        resolve("success");
      };
      image.src = image_src;
    });
    promises.push(prom);
  }

  Promise.all(promises).then(function() {
    if (callback) {
      //Reorder Textures
      for (let i = 0; i < images.length; i++) {
        for (let j = 0; j < texturesArr.length; j++) {
          if (images[i] === texturesArr[j].src) {
            textures.texs.push(texturesArr[j]);
            break;
          }
        }
      }

      //Bind Textures
      for (let i = 0; i < textures.texs.length; i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, textures.texs[i]);
      }

      //Get on with it!
      callback(gl);
    }
  }, function(error) {
    console.log('Error loading images', error);
  })
};

const loadTexture = (gl, image, texture) => {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);
};