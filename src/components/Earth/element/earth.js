// 引入three.js
import * as THREE from 'three'

// r：地球半径
function createSphereMesh(r) {
  var textureLoader = new THREE.TextureLoader()
  var texture = textureLoader.load('./assets/images/earth4.png') //加载纹理贴图
  var geometry = new THREE.SphereBufferGeometry(r, 40, 40) //创建一个球体几何对象
  var material = new THREE.MeshLambertMaterial({
    map: texture, //设置地球颜色贴图map
  })
  var mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh

  return mesh
}
export default createSphereMesh
