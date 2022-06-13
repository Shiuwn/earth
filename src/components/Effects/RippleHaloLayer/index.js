import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
class RippleHaloLayer {
  constructor(options) {
    let defaultOpt = {
      color: 0x00ffff, // 颜色
      color2: 0xffffff, // 光圈颜色
      coordinates: [0, 0, 0], // 坐标
      opacity: 1,
      width: 1.0, //高度
      texture: './texture/ripple-halo.png',
      delay: 0,
    }
    this.options = Object.assign({}, defaultOpt, options)
    this.mesh = null
    this.init()
  }
  init() {
    let { color, color2, coordinates, opacity, width, texture, delay } = this.options
    //
    let geo = new THREE.PlaneGeometry(width, width)
    let map = new THREE.TextureLoader().load(texture)
    let material = new THREE.MeshBasicMaterial({
      map: map,
      color: color2,
      transparent: true,
      opacity: opacity,
      // side: THREE.DoubleSide,
      depthTest: false,
    })
    //
    let dotGeo = new THREE.PlaneGeometry(width, width)
    let dotMap = new THREE.TextureLoader().load('./texture/ripple-halo-dot.png')
    let dotMaterial = new THREE.MeshBasicMaterial({
      map: dotMap,
      color: color,
      transparent: true,
      opacity: opacity,
      // side: THREE.DoubleSide,
      depthTest: false,
    })
    //
    this.group = new THREE.Group()
    this.group.name = 'RippleHaloLayer'
    this.mesh = new THREE.Mesh(geo, material)
    this.mesh.name = 'Ripple'
    // this.mesh.rotation.x = -Math.PI / 2
    this.haloDot = new THREE.Mesh(dotGeo, dotMaterial)
    this.haloDot.name = 'haloDot'
    // this.haloDot.rotation.y = -Math.PI / 2
    this.group.add(this.mesh, this.haloDot)
    this.group.position.set(...coordinates)
    // mesh姿态设置
    // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
    var coordVec3 = new THREE.Vector3(coordinates[0], coordinates[1], coordinates[2]).normalize()
    // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
    var meshNormal = new THREE.Vector3(0, 0, 1)
    // 四元数属性.quaternion表示mesh的角度状态
    //.setFromUnitVectors();计算两个向量之间构成的四元数值
    this.mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
    this.haloDot.quaternion.setFromUnitVectors(meshNormal, coordVec3)
    //
    let from = { scale: 0, opacity: 0 }
    let to = { scale: 1, opacity: 1 }
    this.mesh.tween = new TWEEN.Tween(from).to(to, 2800).delay(delay)
    this.mesh.tween.onUpdate(() => {
      this.mesh.scale.set(from.scale, from.scale, from.scale)
      // this.haloDot.scale.set(from.scale, from.scale, from.scale)
      this.mesh.material.opacity = from.opacity
    })
    //
    let from2 = { scale: 1, opacity: 1 }
    let to2 = { scale: 2, opacity: 0 }
    this.mesh.tween2 = new TWEEN.Tween(from2).to(to2, 1200)
    this.mesh.tween2.onUpdate(() => {
      this.mesh.scale.set(from2.scale, from2.scale, from2.scale)
      // this.haloDot.scale.set(from2.scale, from2.scale, from2.scale)
      this.mesh.material.opacity = from2.opacity
    })
    // tween执行完，再执行tween2
    this.mesh.tween.chain(this.mesh.tween2)
    // tween2执行完再执行tween，从而达到重复执行
    this.mesh.tween2.chain(this.mesh.tween)
    this.mesh.tween.start()
  }

  getInstance() {
    return this.group
  }

  /**
   * 销毁
   */
  destory() {
    this.group.dispose()
    this.group = null
  }
}

export default RippleHaloLayer
