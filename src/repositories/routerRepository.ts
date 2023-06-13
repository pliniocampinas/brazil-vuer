import { csvParse } from "d3";
import { fetchData as fetchExampleData } from '@/repositories/StaticMunicipalityRepository'
import MunicipalitiesData from '@/interfaces/MunicipalitiesData';
import { SourceFormat } from "@/interfaces/Enums";

export interface fetchDataParams {
  sourceFormat: SourceFormat
  sourceUrl: string
  valueKey: string
  cityCodeKey: string
}

export const fetchData = async (params: fetchDataParams | null = null): Promise<MunicipalitiesData[]> => {
  if(!params) {
    return await fetchExampleData()
  }

  if(params.sourceFormat === SourceFormat.Csv) {
    return await fetchCsvData(params.sourceUrl, params.valueKey, params.cityCodeKey)
  }

  return await fetchExampleData()
}

const fetchCsvData = async (csvUrl: string, valueKey: string, cityCodeKey: string): Promise<MunicipalitiesData[]> => {
  // const csvUrl = 'https://gist.githubusercontent.com/pliniocampinas/3a0b327dbe7180dd984352e1be4b86e9/raw/4c89ca9aa4d46fbb4630e892613492e8593879b0/pib-municipios-2010-2019.csv'
  const response = await fetch(csvUrl)

  if(response.status === 404) {
    throw Error('Csv Url not found ' + csvUrl)
  }

  const csvRows = await response.text()
    .then(v => csvParse(v))

  return csvRows.map(row => {
    return {
      code: row[cityCodeKey] + '',
      mainValue: parseInt(row[valueKey]?? '0'),
    }
  })
}