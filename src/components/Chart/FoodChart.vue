<template>
  <Chart :option="option"></Chart>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { onMounted, ref } from '@vue/runtime-core'
import csv from '@/utils/csv.js'
import Chart from './Chart.vue'

export default defineComponent({
  components: { Chart },
  setup() {
    const option = ref(null)
    onMounted(async () => {
      try {
        let data = await csv('./data/annualFoodPrice.csv')
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
          },
          xAxis: {
            type: 'category',
            data: years,
          },
          yAxis: {
            type: 'value',
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
