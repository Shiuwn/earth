import { csvParse } from 'd3-dsv'
const csv = url => {
  return fetch(url)
    .then(response => response.text())
    .then(text => csvParse(text))
}

export default csv
