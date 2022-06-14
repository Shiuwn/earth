import { ref, onMounted } from 'vue'
import csv from '../utils/csv'

let exportData = ref(null)
let importData = ref(null)

export default function useData() {
  onMounted(async () => {
    if (!exportData.value || !importData.value) {
      try {
        exportData.value = await csv('./data/export.csv')
        importData.value = await csv('./data/import.csv')
      } catch (e) {
        console.log(e)
      }
    }
  })
  return {
    exportData,
    importData,
  }
}
