import { mat4 } from "gl-matrix"
import vertexShader from "./shader.vert?raw"
import fragmentShader from "./shader.frag?raw"
import { createShader, createProgram } from "./shader"

export async function main() {

  const vertices = [
    -0.5, 0, 0,
    0.5, 0, 0,
    -0.5, 0.2, 0,
    0.5, 0.2, 0,
    -0.5, 0.4, 0,
    0.5, 0.4, 0,
    -0.5, 0.6, 0,
    0.5, 0.6, 0,
    -0.5, 0.8, 0,
    0.5, 0.8, 0,
  ]

  const indices = [
    0, 1, 3,
    0, 3, 2,
    2, 3, 5,
    2, 5, 4,
    4, 5, 7,
    4, 7, 6,
    6, 7, 9,
    6, 9, 8
  ]

  const joints = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
  ]

  const weights = [
    1.00, 0.00, 0.0, 0.0,
    1.00, 0.00, 0.0, 0.0,
    0.75, 0.25, 0.0, 0.0,
    0.75, 0.25, 0.0, 0.0,
    0.50, 0.50, 0.0, 0.0,
    0.50, 0.50, 0.0, 0.0,
    0.25, 0.75, 0.0, 0.0,
    0.25, 0.75, 0.0, 0.0,
    0.00, 1.00, 0.0, 0.0,
    0.00, 1.00, 0.0, 0.0,
  ]

  const width = 400
  const height = 400
  const fov = Math.PI / 4
  const aspect = height / width
  const near = 0.1
  const far = 10

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  document.body.appendChild(canvas)
  const gl = canvas.getContext("webgl")!

  const projectionMatrix = mat4.perspective(
    mat4.identity(mat4.create()),
    fov,
    aspect,
    near,
    far,
  )
  const viewMatrix = mat4.lookAt(
    mat4.identity(mat4.create()),
    [0, 0, -4],
    [0, 0, 0],
    [0, 1, 0]
  )
  const modelMatrix = mat4.identity(mat4.create())
  mat4.translate(modelMatrix, modelMatrix, [0, 0, 0])
  mat4.scale(modelMatrix, modelMatrix, [1, 1, 1])

  const modelViewProjectionMatrix = mat4.identity(mat4.create())
  mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix)
  mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix)

  const program = createProgram(gl, createShader(gl, gl.VERTEX_SHADER, vertexShader), createShader(gl, gl.FRAGMENT_SHADER, fragmentShader))
  const mvpLocation = gl.getUniformLocation(program, "uMvpMatrix")
  const positionLocation = gl.getAttribLocation(program, "aPosition")
  const weightLocation = gl.getAttribLocation(program, "aWeight")
  const jointLocation = gl.getAttribLocation(program, "aJoint")

  const jointDeformationLocation0 = gl.getUniformLocation(program, "uJointMatrix[0]")
  const jointDeformationLocation1 = gl.getUniformLocation(program, "uJointMatrix[1]")

  gl.useProgram(program)
  gl.uniformMatrix4fv(mvpLocation, false, modelViewProjectionMatrix)

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(positionLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const jointBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, jointBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(joints), gl.STATIC_DRAW)
  gl.vertexAttribPointer(jointLocation, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(jointLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const weightBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, weightBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(weights), gl.STATIC_DRAW)
  gl.vertexAttribPointer(weightLocation, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(weightLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)


  async function render() {
    const jointDeformationMatrix0 = mat4.identity(mat4.create())
    gl.uniformMatrix4fv(jointDeformationLocation0, false, jointDeformationMatrix0)

    const angle = Math.PI / 4 * Math.sin(performance.now() / 1000)
    const jointDeformationMatrix1 = mat4.identity(mat4.create())
    mat4.rotate(jointDeformationMatrix1,  jointDeformationMatrix1, angle, [0, 0, 1])
    gl.uniformMatrix4fv(jointDeformationLocation1, false, jointDeformationMatrix1)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
