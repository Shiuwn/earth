import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import TWEEN from '@tweenjs/tween.js'
import { deepMerge, isType, lon2xyz } from '@/utils'
import config from './config'
import createcCountryLine from './element/line'
import createHalo from './element/halo'
import createcEarth from './element/earth'
import createHotNew from './element/hotNews'
import { createTag, cssRenderer } from './element/tag'
import emitter from '@/utils/emitter'
var R = config.R //地球半径
export default class Earth3d {
  constructor(options = {}) {
    let defaultOptions = {
      isFull: true,
      container: null,
      width: window.innerWidth,
      height: window.innerHeight,
      bgColor: 0x000000,
      materialColor: 0xff0000,
      controls: {
        visibel: true, // 是否开启
        enableDamping: true, // 阻尼
        autoRotate: true, // 自动旋转
        maxPolarAngle: Math.PI, // 相机垂直旋转角度的上限
      },
      statsVisibel: true,
      axesVisibel: false,
      axesHelperSize: 250, // 左边尺寸
    }
    this.options = deepMerge(defaultOptions, options)
    this.container = document.querySelector(this.options.container)
    this.scene = new THREE.Scene() // 场景
    this.camera = null // 相机
    this.renderer = null // 渲染器
    this.mesh = null // 网格
    this.animationStop = null // 用于停止动画
    this.controls = null // 轨道控制器
    this.stats = null // 统计
    this.earth = new THREE.Group() //地球组对象
    this.init()
  }
  init() {
    this.initStats()
    // this.initModel()
    this.initCamera()
    this.initRenderer()
    this.initLight()
    this.initAxes()
    this.initControls()
  }
  async initModel() {
    try {
     
      this.earth.scale.set(0.0, 0.0, 0.0)
      let haloInstance = await createHalo()
      let earthInstance = await createcEarth(R)
      let lineInstance = await createcCountryLine(R)
      let { hotNew, hotMeshs,labelGroup,flyArcGroup,flyArr } = await createHotNew()
      this.labelGroup = labelGroup
      this.earth.add(haloInstance)
      
      this.earth.add(earthInstance)
      this.earth.add(lineInstance)
      this.initTag()
      // 地球缩放动画
      let startVal = { scale: 0.0 }
      let endVal = { scale: 1.0 }
      this.earth.tween = new TWEEN.Tween(startVal).to(endVal, 3000).easing(TWEEN.Easing.Quartic.InOut)
      this.earth.tween.onUpdate(val => {
        this.earth.scale.set(val.scale, val.scale, val.scale)
      })
      this.earth.tween.onComplete(() => {
        
        // 完成后，执行密度动画
        setTimeout(() => {
          this.earth.add(hotNew)
          this.earth.add(labelGroup)
          hotNew.children.forEach(item => {
            item.tween.start()
          })
          // 显示飞线
          this.earth.add(...flyArcGroup.children)
          this.flyArr= flyArr
          window.addEventListener('click', e => {
            this.chooseCountry(e, this.container, this.camera, hotMeshs)
          })
        }, 0)
      })
      this.addObject(this.earth)
      return this.earth
    } catch (error) {
      console.log(error)
    }
  }
  chooseCountry(event, container, camera, hotMeshs) {
    let getBoundingClientRect = container.getBoundingClientRect()
    var x = ((event.clientX - getBoundingClientRect.left) / container.offsetWidth) * 2 - 1
    var y = -((event.clientY - getBoundingClientRect.top) / container.offsetHeight) * 2 + 1
    var raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    var intersects = raycaster.intersectObjects(hotMeshs)
    if (intersects.length > 0) {
      let chooseMesh = intersects[0].object
      let info = this.getObjectInfo(chooseMesh)
      console.log(info);
      emitter.$emit('label-show',info.tempData)
    } 
  }
   getObjectInfo(chooseMesh) {
    if (!chooseMesh.parent) {
      return {}
    }
    if (chooseMesh.isHotNews) {
      return chooseMesh
    } else {
      return this.getObjectInfo(chooseMesh.parent)
    }
    // isHotNews
  }
  initTag() {
    // 标签
    this.cssRenderer = cssRenderer(this.container, this.options.width, this.options.height)
  }
  /**
   * 运行
   */
  run() {
    this.loop()
  }
  // 循环
  loop() {
    this.animationStop = window.requestAnimationFrame(() => {
      this.loop()
    })
    // 这里是你自己业务上需要的code
    this.renderer.render(this.scene, this.camera)
    // 控制相机旋转缩放的更新
    if (this.options.controls.visibel) this.controls.update()
    // 统计更新
    if (this.options.statsVisibel) this.stats.update()
    // 地球自转,并且没有旋转的时候旋转
    // if (this.earth && !chooseMesh) this.earth.rotateY(0.004)
    if(this.labelGroup){
      this.labelGroup.children.forEach(item=>{
        item.update(this.camera)
      })
    }
     // 批量设置所有飞线的运动动画
     if( this.flyArr && this.flyArr.length){
       this.flyArr.forEach((fly) => {
        fly.rotation.z += 0.01; //调节飞线速度
        if (fly.rotation.z >= fly.flyEndAngle)
          fly.rotation.z = fly.startAngle;
      });

     }
    TWEEN.update()
    // 标签渲染
    this.cssRenderer && this.cssRenderer.render(this.scene, this.camera)
    // console.log(this.camera.position)
  }
  initCamera() {
    let { width, height } = this.options
    let rate = width / height
    // 设置45°的透视相机,更符合人眼观察
    this.camera = new THREE.PerspectiveCamera(45, rate, 0.1, 1500)
    this.camera.position.set(-102, 205, -342)

    this.camera.lookAt(0, 0, 0)
  }
  /**
   * 初始化渲染器
   */
  initRenderer() {
    let { width, height, bgColor } = this.options
    let renderer = new THREE.WebGLRenderer({
      antialias: true, // 锯齿
    })
    // 设置canvas的分辨率
    renderer.setPixelRatio(window.devicePixelRatio)
    // 设置canvas 的尺寸大小
    renderer.setSize(width, height)
    // 设置背景色
    renderer.setClearColor(bgColor, 1)
    // 插入到dom中
    this.container.appendChild(renderer.domElement)
    this.renderer = renderer
  }
  initLight() {
    //   平行光1
    let directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight1.position.set(400, 200, 200)
    //   平行光2
    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight2.position.set(-400, -200, -300)
    // 环境光
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    // 将光源添加到场景中
    this.addObject(directionalLight1)
    this.addObject(directionalLight2)
    this.addObject(ambientLight)
  }

  initStats() {
    if (!this.options.statsVisibel) return false
    this.stats = new Stats()
    this.container.appendChild(this.stats.dom)
  }
  initControls() {
    try {
      let {
        controls: { enableDamping, autoRotate, visibel, maxPolarAngle },
      } = this.options
      if (!visibel) return false
      // 轨道控制器，使相机围绕目标进行轨道运动（旋转|缩放|平移）
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.maxPolarAngle = maxPolarAngle
      this.controls.autoRotate = autoRotate
      this.controls.enableDamping = enableDamping
    } catch (error) {
      console.log(error)
    }
  }
  initAxes() {
    if (!this.options.axesVisibel) return false
    var axes = new THREE.AxesHelper(this.options.axesHelperSize)
    this.addObject(axes)
  }
  // 销毁，释放内存
  destroy() {
    // 停止动画运行
    window.cancelAnimationFrame(this.animationStop)
    // 清空
    this.scene = null // 场景
    this.camera = null // 相机
    this.renderer = null // 渲染器
    this.mesh = null // 网格
    this.animationStop = null // 用于停止动画
    this.controls = null // 轨道控制器
    this.stats = null // 统计
    this.empty(this.container)
  }
  // 清空dom
  empty(elem) {
    while (elem && elem.lastChild) elem.removeChild(elem.lastChild)
  }
  /**
   * 添加对象到场景
   * @param {*} object  {} []
   */
  addObject(object) {
    if (isType('Array', object)) {
      this.scene.add(...object)
    } else {
      this.scene.add(object)
    }
  }
  /**
   * 移除对象
   * @param {*} object {} []
   */
  removeObject(object) {
    if (isType('Array', object)) {
      object.map(item => {
        item.geometry.dispose()
      })
      this.scene.remove(...object)
    } else {
      object.geometry.dispose()
      this.scene.remove(object)
    }
  }
  /**
   * 重置
   */
  resize() {
    // 重新设置宽高
    let { width, height, isFull } = this.options
    this.options.width = isFull ? window.innerWidth : width
    this.options.height = isFull ? window.innerHeight : height
    this.renderer.setSize(this.options.width, this.options.height)
     // 标签渲染
     this.cssRenderer && this.cssRenderer.setSize(this.options.width, this.options.height)
    let rate = this.options.width / this.options.height

    this.camera.aspect = rate
    this.camera.updateProjectionMatrix()
  }
}
