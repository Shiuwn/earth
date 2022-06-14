<template>
  <Chart :option="option"></Chart>
</template>
<script>
import Chart from './Chart.vue'
import useData from '../../hooks/useData'
import { ref, watch } from 'vue'
export default {
  components: { Chart },
  props: {
    country: String,
  },
  setup(prop) {
    const { importPromise, exportPromise } = useData()
    const option = ref(null)
    const renderChart = () => {
      const { country } = prop
      Promise.all([importPromise, exportPromise]).then(([importData, exportData]) => {
        const subImport = importData.filter(d => d.Area === country)
        const subExport = exportData.filter(d => d.Area === country)
        const years = subImport.map(s => s.Year)
        option.value = {
          legend: {},
          xAxis: {
            type: 'category',
            data: years,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Import',
              type: 'line',
              data: subImport.map(d => d.Value),
            },
            {
              name: 'Export',
              type: 'line',
              data: subExport.map(d => d.Value),
            },
          ],
        }
      })
    }
    watch(prop.country, () => {
      prop.country && renderChart()
    })
    prop.country && renderChart()
    return {
      option,
    }
  },
}
</script>
