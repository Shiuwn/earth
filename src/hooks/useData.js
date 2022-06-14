import csv from '../utils/csv'
export default function useData() {
  return {
    exportPromise: csv('./data/export.csv'),
    importPromise: csv('./data/import.csv'),
  }
}
