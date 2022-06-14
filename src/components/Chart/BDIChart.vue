<template>
  <Chart :option="option"></Chart>
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
        let data = await csv('./data/BDI.csv')
        data = data.slice()
        option.value = {
          xAxis: {
            type: 'category',
            data: data.map(d => d.date),
          },
          yAxis: {
            type: 'value',
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
