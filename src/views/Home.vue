<template>
  <div>
    <!-- <earth ref="Earth"></earth> -->
    <food-chart class="right-chart"></food-chart>
  </div>
</template>

<script>
// import Earth from '@/components/Earth'
import FoodChart from '../components/Chart/FoodChart.vue'

export default {
  name: 'Home',
  data() {
    return {
      earthStatus: false,
    }
  },

  mounted() {
    // this.$refs['Earth'].show()
  },

  components: {
    // Earth,
    FoodChart,
  },
}
</script>
<style lang="scss">
body,
html,
#app {
  background-color: #000;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.right-chart {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
