import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { lon2xyz, random } from '@/utils'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import config from '../config.js'
var R = config.R //地球半径
function maxFun(coord) {
  var array = []
  for (var i = 0; i < coord.length; i++) {
    array.push(coord[i][2])
  }
  array.sort(compareNum)
  return array[array.length - 1]
  // 数组排序规则
  function compareNum(num1, num2) {
    if (num1 < num2) {
      return -1
    } else if (num1 > num2) {
      return 1
    } else {
      return 0
    }
  }
}

export default function create() {
  return new Promise((resolve, reject) => {
    var loader = new THREE.FileLoader()
    loader.setResponseType('json')
    var group = new THREE.Group()
    loader.load('/assets/data/population.json', function (data) {
      var coord = data.population
      var geoArr = []
      var geoArr2 = []
      var Max = maxFun(coord) * 0.05
      console.log(Max)
      var color1 = new THREE.Color(0x4797ff)
      var color2 = new THREE.Color(0x0aebff)
      for (var i = 0; i < coord.length; i++) {
        var PopulationDensity = coord[i][2]
        var height = PopulationDensity / 50
        var geometry = new THREE.BoxBufferGeometry(0.5, 0.5, height)
        var color = color1.clone().lerp(color2.clone(), PopulationDensity / Max)
        var colorArr = [] //几何体所有顶点颜色数据
        var pos = geometry.attributes.position
        for (var j = 0; j < pos.count; j++) {
          if (pos.getZ(j) < 0) {
            colorArr.push(color.r * 1.0, color.g * 1.0, color.b * 1.0)
          } else {
            colorArr.push(color.r * 1.0, color.g * 1.0, color.b * 1.0)
          }
        }
        geometry.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3)

        var SphereCoord = lon2xyz(R, coord[i][0], coord[i][1])
        geometry.translate(0, 0, R + height / 2)
        geometry.tempData = {
          translateZ: R + height / 2,
        }

        geometry.lookAt(new THREE.Vector3(SphereCoord.x, SphereCoord.y, SphereCoord.z))
        if (height > 10) {
          geoArr.push(geometry)
        } else {
          geoArr2.push(geometry)
        }
      }
      var material = new THREE.MeshLambertMaterial({
        // color: 0x00ffff,
        vertexColors: THREE.VertexColors, //使用顶点颜色渲染
        transparent: true,
        opacity: 0.8,
        depthWrite: true,
      })
      var meshs = []
      for (let i = 0; i < geoArr.length; i++) {
        let mesh = new THREE.Mesh(geoArr[i], material)
        mesh.scale.set(0, 0, 0)
        mesh.tween = new TWEEN.Tween({ scale: 0.0 }).to({ scale: 1.0 }, random(1000, 1500)).delay(random(0, 1000))
        mesh.tween.onUpdate(val => {
          mesh.scale.set(val.scale, val.scale, val.scale)
        })
        meshs.push(mesh)
      }

      //
      var BfferGeometry = BufferGeometryUtils.mergeBufferGeometries(geoArr2)
      var otherMesh = new THREE.Mesh(BfferGeometry, material)
      otherMesh.scale.set(0, 0, 0)
      otherMesh.tween = new TWEEN.Tween({ scale: 0.0 }).to({ scale: 1.0 }, 1500)
      otherMesh.tween.onUpdate(val => {
        otherMesh.scale.set(val.scale, val.scale, val.scale)
      })
      //添加到组
      group.add(...meshs, otherMesh)
      resolve(group)
    })
  })
}
