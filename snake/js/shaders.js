let vertexShaderText = "";
let fragmentShaderText = "";

const compileShaders = (gl, looping) => {
  if (looping) {
    vertexShaderText = [
    'attribute vec4 a_position;',
    '',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'varying vec3 v_normal;',
    '',
    'void main() {',
    '  gl_Position = mProj * mView * mWorld * a_position;',
    '  v_normal = normalize(a_position.xyz);',
    '}'
    ].join('\n');

    fragmentShaderText = [
    'precision mediump float;',
 
    'varying vec3 v_normal;',
    
    'uniform samplerCube u_texture;',
    
    'void main() {',
      'gl_FragColor = textureCube(u_texture, normalize(v_normal));',
    '}'
    ].join('\n');
  }
  else {
    vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec2 vertTexPos;',
    'attribute vec3 vertNormal;',
    '',
    'varying highp vec2 vTextureCoord;',
    'varying vec3 fragNormal;',
    'varying vec3 v_surfaceToLight;',
    '',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    'uniform vec3 u_lightWorldPosition;',
    '',
    'void main() {',
    '  fragNormal = mat3(mWorld) * vertNormal;',
    '  vTextureCoord = vertTexPos;',
    '  v_surfaceToLight = u_lightWorldPosition - (mWorld * vec4(vertPosition, 1.0)).xyz;',
    '  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
    ].join('\n');

    fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying highp vec2 vTextureCoord;',
    'varying vec3 fragNormal;',
    'varying vec3 v_surfaceToLight;',
    '',
    'uniform sampler2D uSampler;',
    'uniform vec3 additiveColor;',
    '',
    'void main() {',
    '  float percentLit = dot(normalize(fragNormal), normalize(v_surfaceToLight));',
    '  vec3 actualColor = texture2D(uSampler, vTextureCoord).xyz + additiveColor;',
    '  gl_FragColor = vec4(percentLit * actualColor, 1.0);',
    '}'
    ].join('\n');
  }


  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);
  
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    return;
  }
  return program;
};