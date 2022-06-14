import csv from '../utils/csv'
export default function useData() {
  return {
    exportPromise: csv('./assets/data/export.csv'),
    importPromise: csv('./assets/data/import.csv'),
  }
}
