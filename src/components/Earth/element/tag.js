import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
const tempV = new THREE.Vector3();
const cameraToPoint = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();

const normalMatrix = new THREE.Matrix3();
export function createTag(dom) {
  var div = null;
  console.log(dom);
  if(dom){
    div = dom
  }else{
    div = document.createElement('div')
    div.className = 'info-tag'
    div.innerHTML = `<div class="info-tag-inner">
    <div class="info-tag-name"></div>
    <div class="info-tag-con">
    </div>
  </div>`
  }
 
  div.style.visibility = 'hidden'
  var label = new CSS2DObject(div)
  function setText(name, con) {
    let nameObj = label.element.querySelector('.info-tag-name')
    let conObj = label.element.querySelector('.info-tag-con')
    nameObj.innerHTML = name
    conObj.innerHTML = con
  }
  label.setText = setText
  return label
}
export function createNameTag() {
 
  var div  = document.createElement('div')
    div.className = 'name-tag'
  // div.style.visibility = 'hidden'
  div.style.visibility = 'visible'
  var label = new CSS2DObject(div)
  function setText(name,position) {
    div.innerHTML = name
    label.position.copy(position)
    label.labelPosition = position
  }
  function update(camera){
    normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
    // get the camera's position
    camera.getWorldPosition(cameraPosition);
    tempV.copy(this.labelPosition);
      tempV.applyMatrix3(normalMatrix);

      // compute the direction to this position from the camera
      cameraToPoint.copy(this.labelPosition);
      cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();

      // get the dot product of camera relative direction to this position
      // on the globe with the direction from the camera to that point.
      // -1 = facing directly towards the camera
      // 0 = exactly on tangent of the sphere from the camera
      // > 0 = facing away
      const dot = tempV.dot(cameraToPoint);
      if (dot >-0.5) {
        label.element.style.visibility = 'hidden'
        
      }else{
        label.element.style.visibility = 'visible'
      }
  }
  label.setText = setText
  label.update = update
  return label
}

export function cssRenderer(container, width, height) {
  var labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(width, height)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0'
  labelRenderer.domElement.style.left = '0'
  labelRenderer.domElement.style.pointerEvents = 'none'
  container.appendChild(labelRenderer.domElement)
  return labelRenderer
}
