import * as THREE from 'three'
import { lon2xyz } from '@/utils'

// pointArr：一组几何体顶点坐标
function line(pointArr) {
  var geometry = new THREE.BufferGeometry()
  var vertices = new Float32Array(pointArr)
  var attribue = new THREE.BufferAttribute(vertices, 3)
  geometry.attributes.position = attribue
  var material = new THREE.LineBasicMaterial({
    color: 0x4797ff,
  })
  var line = new THREE.LineSegments(geometry, material)
  return line
}

export default function createcCountryLine(R) {
  return new Promise((resolve, reject) => {
    var loader = new THREE.FileLoader()
    loader.setResponseType('json')
    var group = new THREE.Group()
    var allPointArr = []
    loader.load('/assets/data/world.json', function (data) {
      data.features.forEach(function (country) {
        if (country.geometry.type === 'Polygon') {
          country.geometry.coordinates = [country.geometry.coordinates]
        }
       
        country.geometry.coordinates.forEach(polygon => {
          var pointArr = []
          polygon[0].forEach(elem => {
            var coord = lon2xyz(R, elem[0], elem[1])
            pointArr.push(coord.x, coord.y, coord.z)
          })
          allPointArr.push(pointArr[0], pointArr[1], pointArr[2])
          for (let i = 3; i < pointArr.length; i += 3) {
            allPointArr.push(
              pointArr[i],
              pointArr[i + 1],
              pointArr[i + 2],
              pointArr[i],
              pointArr[i + 1],
              pointArr[i + 2],
            )
          }
          allPointArr.push(pointArr[0], pointArr[1], pointArr[2])
        })
      })
      group.add(line(allPointArr))
      resolve(group)
    })
  })
}
