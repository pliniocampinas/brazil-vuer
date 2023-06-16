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

  if(params.sourceFormat === SourceFormat.Json) {
    return await fetchJsonData(params.sourceUrl, params.valueKey, params.cityCodeKey)
  }

  return await fetchExampleData()
}

const fetchCsvData = async (csvUrl: string, valueKey: string, cityCodeKey: string): Promise<MunicipalitiesData[]> => {
  const response = await fetch(csvUrl)

  if(response.status === 404) {
    throw Error('Csv Url not found [' + csvUrl + ']')
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

const fetchJsonData = async (url: string, valueKey: string, cityCodeKey: string): Promise<MunicipalitiesData[]> => {
  const response = await fetch(url)

  if(response.status === 404) {
    throw Error('Json Url not found [' + url + ']')
  }

  const csvRows = await response.json() as []

  return csvRows.map(row => {
    return {
      code: row[cityCodeKey] + '',
      mainValue: parseInt(row[valueKey]?? '0'),
    }
  })
}