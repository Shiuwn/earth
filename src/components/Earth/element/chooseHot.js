// 引入three.js
import * as THREE from 'three/build/three.module.js'
var chooseMesh = null
function chooseCountry(event, label, container, camera, hotMeshs) {
  if (chooseMesh) {
    label.element.style.visibility = 'hidden' //隐藏标签
  }
  let getBoundingClientRect = container.getBoundingClientRect()
  var x = ((event.clientX - getBoundingClientRect.left) / container.offsetWidth) * 2 - 1
  var y = -((event.clientY - getBoundingClientRect.top) / container.offsetHeight) * 2 + 1
  var raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
  var intersects = raycaster.intersectObjects(hotMeshs)
  if (intersects.length > 0) {
    chooseMesh = intersects[0].object
    let info = getObjectInfo(chooseMesh)
    // label.position.copy(info.position)
    console.log(intersects[0].point, info.position)
    label.setText(info.tempData.name, info.tempData.con)
    label.element.style.visibility = 'visible'
  } else {
    chooseMesh = null
  }
}
function getObjectInfo(chooseMesh) {
  if (!chooseMesh.parent) {
    return {}
  }
  if (chooseMesh.isHotNews) {
    return chooseMesh
  } else {
    return getObjectInfo(chooseMesh.parent)
  }
  // isHotNews
}
export { chooseCountry, chooseMesh }
