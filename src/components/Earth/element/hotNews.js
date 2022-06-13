import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import config from '../config.js'
import { lon2xyz, random } from '@/utils'
import RippleHaloLayer from '@/components/Effects/RippleHaloLayer'
import HotNewsData from '@/assets/data/HotNewsData.js'
import {start} from '@/assets/data/HotNewsData.js'
import {createNameTag} from './tag.js'
import useArc from "./useArc.js";
export default function createHotNew() {
   // 飞线
   const { flyArc } = useArc({ R:config.R });
  return new Promise((resolve, reject) => {
    var hotMeshs = []
    var group = new THREE.Group()
    var labelGroup = new THREE.Group()
    var flyArcGroup = new THREE.Group();
    var flyArr = []
    for (let i = 0; i < HotNewsData.length; i++) {
      const element = HotNewsData[i]
      let cood = lon2xyz(config.R * 1.001, element.E, element.N)
      let halo = new RippleHaloLayer({
        width: 25.0,
        delay: random(0, 1500),
        color: 0xffeb3b,
        coordinates: [cood.x, cood.y, cood.z],
      })
      let instance = halo.getInstance()
      instance.isHotNews = true
      instance.tempData = {
        name: element.name,
        con: element.title,
      }
      // label
      let tag = createNameTag()
      tag.setText(element.name,new THREE.Vector3(cood.x, cood.y+10, cood.z))
      // 飞线
     /*调用函数flyArc绘制球面上任意两点之间飞线圆弧轨迹*/
     var arcline = flyArc(start.E,start.N, element.E, element.N);
     flyArcGroup.add(arcline); //飞线插入flyArcGroup中
     flyArr.push(arcline.flyLine); //获取飞线段
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
    resolve({ hotNew: group, hotMeshs,labelGroup,flyArcGroup,flyArr })
  })
}
