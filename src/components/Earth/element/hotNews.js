import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import config from '../config.js'
import { lon2xyz, random } from '@/utils'
import RippleHaloLayer from '@/components/Effects/RippleHaloLayer'
// import HotNewsData  from '@/assets/data/HotNewsData.js'
import CoordinateData from '@/assets/data/HotNewsData.js'
import { createNameTag } from './tag.js'
import useArc from './useArc.js'
const covertData = data => {
  if (!Array.isArray(data)) return data
  let len = data.length
  let result = []
  for (let i = 0; i < len; i++) {
    const copy = data.slice()
    const [start] = copy.splice(i, 1)
    let end = copy.shift()
    while ((end = copy.shift())) {
      result.push([start, end])
    }
  }
  return result
}

export default function createHotNew() {
  const HotNewsData = covertData(CoordinateData)
  console.log(HotNewsData)
  // 飞线
  const { flyArc } = useArc({ R: config.R })
  return new Promise((resolve, reject) => {
    var hotMeshs = []
    var group = new THREE.Group()
    var labelGroup = new THREE.Group()
    var flyArcGroup = new THREE.Group()
    var flyArr = []
    for (let i = 0; i < HotNewsData.length; i++) {
      const [start, end] = HotNewsData[i]
      let cood = lon2xyz(config.R * 1.001, start.E, start.N)
      let halo = new RippleHaloLayer({
        width: 25.0,
        delay: random(0, 1500),
        color: 0xffeb3b,
        coordinates: [cood.x, cood.y, cood.z],
      })
      let instance = halo.getInstance()
      instance.isHotNews = true
      instance.tempData = {
        name: start.name,
        con: start.title,
      }
      // label
      let tag = createNameTag()
      tag.setText(start.name, new THREE.Vector3(cood.x, cood.y + 10, cood.z))
      // 飞线
      /*调用函数flyArc绘制球面上任意两点之间飞线圆弧轨迹*/
      var arcline = flyArc(start.E, start.N, end.E, end.N)
      flyArcGroup.add(arcline) //飞线插入flyArcGroup中
      flyArr.push(arcline.flyLine) //获取飞线段
      // 缩放动画
      instance.scale.set(0.0, 0.0, 0.0)
      let startVal = { scale: 0.0 }
      let endVal = { scale: 1.0 }
      instance.tween = new TWEEN.Tween(startVal)
        .to(endVal, 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .delay(random(0, 1000))
      instance.tween.onUpdate(val => {
        instance.scale.set(val.scale, val.scale, val.scale)
      })
      group.add(instance)
      labelGroup.add(tag)
      //   console.log(instance.children[1])
      hotMeshs.push(instance.children[1])
    }
    resolve({ hotNew: group, hotMeshs, labelGroup, flyArcGroup, flyArr })
  })
}
