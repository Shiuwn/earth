<template>
  <div class="earth-app-wrap">
    <div id="earth-app"></div>
  </div>
  <div class="info-tag" v-show="visibelLabel">
    <div class="info-tag-inner">
      <div class="info-tag-name">{{labelContent.name}}</div>
      <div class="info-tag-con">{{labelContent.con}}</div>
      <div class="info-tag-echarts">123</div>
    </div>
    <div class="info-tag-close" @click="hide">x</div>
  </div>
</template>

<script>

import Earth3d from './Earth3D'
import emitter from '@/utils/emitter'

export default {
  data() {
    return {
      visibelLabel: false,
      labelContent:{
        name:'',
        con:""
      }
    }
  },
  created(){
    emitter.$on('label-show',this.show)
    
  },
  async mounted() {
    let earth = new Earth3d({
      container: '#earth-app',
      bgColor: 0x0a1936,
    })
    this.earth = earth;
    earth.run()
    let earthInstance = await earth.initModel()

    earthInstance.tween.start()
    window.addEventListener('resize',earth.resize.bind(earth))
  },
  methods: {
    show(info={}) {
      if(info.name){
        this.visibelLabel = true
        this.labelContent.name = info.name || ''
        this.labelContent.con = info.con || ''
        this.earth.controls.autoRotate = false;

      }
    },
    hide(){
       console.log('hide');
      this.earth.controls.autoRotate = true;
      this.visibelLabel = false
    }
  },
}
</script>

<style lang="scss">
.earth-app-wrap {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}

#earth-app {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.info-tag {
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
 
  height: 500px;
  z-index: 999;
  border: 15px solid solid #000;
  background:rgba(0,0,0,0.5);
  width:500px;
  
  color: #fff;
  &-inner {
    padding: 20px 30px;
    color: rgba(120, 221, 255, 1);
  }
  &-name {
    font-family: 'PangMenZhengDao';
    font-size: 28px
  }
  &-con {
    padding-top: 10px;
    font-size:12px;
    line-height: 1.35;
  }
  &-echarts{
    width:100%;
    height:200px;
    background:#ccc;
  }
  &-close{
    cursor: pointer;
    position: absolute;
    right:0px;
    top:0px;
    width:24px;
    height: 24px;
    font-size:18px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    transform: translate(50%,-50%);
    background:rgb(34,176,222);
    border-radius: 50%;
  }
}
.name-tag{
  // background:rgba(0,0,0,0.5);
  color:#fff;
  padding:5px 10px;
  border-radius: 10px;
}
</style>
