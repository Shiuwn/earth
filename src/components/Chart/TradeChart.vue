<template>
  <Chart :option="option"></Chart>
</template>
<script>
import Chart from './Chart.vue'
import useData from '../../hooks/useData'
import { ref, watch } from 'vue'
export default {
  components: { Chart },
  setup(prop) {
    const { importData, exportData } = useData()
    const option = ref(null)
    watch([prop.country, importData, exportData], () => {
      if (prop.country && importData.value && exportData.value) {
        const { country } = prop
        const subImport = importData.value.filter(d => d.Area === country)
        const subExport = exportData.value.filter(d => d.Area === country)
        const years = subImport.map(s => s.Year)
        option.value = {
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
      }
    })
    return {
      option,
    }
  },
}
</script>
