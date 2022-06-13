// 引入three.js
import * as THREE from 'three'
import config from '../config.js'

export default function create() {
  var R = config.R //地球半径
  var textureLoader = new THREE.TextureLoader()
  var texture = textureLoader.load('./assets/images/light2.png') //加载纹理贴图
  var spriteMaterial = new THREE.SpriteMaterial({
    map: texture, //设置精灵纹理贴图
    transparent: true, //开启透明
    color: 0x4797ff,
    depthWrite: false,
  })
  var sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(R * 3.0, R * 3.0, 1) //适当缩放精灵
  return sprite
}
