<template>
  <div class="chart" ref="chartDom"></div>
</template>
<script>
import { computed, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
export default {
  name: 'Chart',
  props: {
    option: Object,
  },
  setup(prop) {
    const chart = ref(null)
    const chartDom = ref(null)
    onMounted(() => {
      chart.value = echarts.init(chartDom.value)
    })
    watch(
      () => prop.option,
      () => {
        chart.value?.setOption(prop.option)
      },
    )
    return {
      chart,
      chartDom,
    }
  },
}
</script>
<style lang="scss" scoped>
.chart {
  width: 400px;
  height: 360px;
}
</style>
