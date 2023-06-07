import { csvParse } from "d3";
import { fetchData as fetchExampleData } from '@/repositories/MunicipalityRepository'

export const fetchData = async (sourceFormat: string, sourceUrl: string, valueKey: string, cityCodeKey: string) => {
  if(sourceFormat === 'csv') {
    return await fetchCsvData(sourceUrl, valueKey, cityCodeKey)
  }
  
  return await fetchExampleData()
}

const fetchCsvData = async (csvUrl: string, valueKey: string, cityCodeKey: string) => {
  // const csvUrl = 'https://gist.githubusercontent.com/pliniocampinas/3a0b327dbe7180dd984352e1be4b86e9/raw/4c89ca9aa4d46fbb4630e892613492e8593879b0/pib-municipios-2010-2019.csv'
  const response = await fetch(csvUrl)
    .then(response => response.text())
    .then(v => csvParse(v)) 

  return response.map(rows => {
    return {
      code: rows[cityCodeKey],
      mainValue: rows[valueKey],
    }
  })
}