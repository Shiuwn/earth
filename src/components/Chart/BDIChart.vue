<template>
  <div class="chart-wrapper">
    <h3>BDI Index Change by Time</h3>
    <Chart :option="option" class="bdi-chart"></Chart>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import csv from '../../utils/csv'
import Chart from './Chart.vue'
export default {
  components: {
    Chart,
  },
  setup() {
    const option = ref(null)
    onMounted(async () => {
      try {
        let data = await csv('./assets/data/BDI.csv')
        data = data.slice()
        option.value = {
          xAxis: {
            type: 'category',
            data: data.map(d => d.date),
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff',
              },
            },
          },
          series: {
            name: 'BDI',
            type: 'line',
            data: data.map(d => parseFloat(d.index)),
          },
        }
      } catch (e) {
        console.log(e)
      }
    })
    return {
      option,
    }
  },
}
</script>
<style lang="scss" scoped>
.chart-wrapper {
  color: #fff;
  text-align: center;
  .bdi-chart {
    width: 500px;
  }
}
</style>
