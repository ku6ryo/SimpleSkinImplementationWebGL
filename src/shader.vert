precision mediump float;

attribute vec3 aPosition;
attribute vec4 aJoint;
attribute vec4 aWeight;

uniform mat4 uMvpMatrix;
uniform mat4 uJointMatrix[2];

void main() {
  mat4 skinMatrix = aWeight.x * uJointMatrix[int(aJoint.x)]
    + aWeight.y * uJointMatrix[int(aJoint.y)]
    + aWeight.w * uJointMatrix[int(aJoint.z)]
    + aWeight.z * uJointMatrix[int(aJoint.w)];
  gl_Position = uMvpMatrix * skinMatrix * vec4(aPosition, 1.0);
}