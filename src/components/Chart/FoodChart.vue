<template>
  <div class="chart-wrapper">
    <h3>Food Price Index Changes by Time</h3>
    <Chart :option="option" class="food-chart"></Chart>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import csv from '@/utils/csv.js'
import Chart from './Chart.vue'

export default defineComponent({
  components: { Chart },
  setup() {
    const option = ref(null)
    onMounted(async () => {
      try {
        let data = await csv('./assets/data/annualFoodPrice.csv')
        const keys = data.columns.filter(d => d !== 'Year')
        data = data.slice()
        const years = data.map(d => d.Year)
        const genSeries = data => {
          return keys.map(k => ({
            name: k,
            type: 'line',
            data: data.map(d => d[k]),
          }))
        }
        option.value = {
          legend: {
            data: keys,
            textStyle: {
              color: '#fff',
            },
          },
          xAxis: {
            type: 'category',
            data: years,
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
          series: genSeries(data),
        }
      } catch (e) {
        console.log(e)
      }
    })
    return {
      option,
    }
  },
})
</script>
<style lang="scss" scoped>
.chart-wrapper {
  color: #fff;
  text-align: center;
  .food-chart {
    width: 500px;
  }
}
</style>
