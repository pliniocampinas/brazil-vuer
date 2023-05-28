// import * as MunicipalitiesCodes from "@/repositories/municipalities-codes.json";
import * as gdpPerCapitaBrl2019 from "@/repositories/gdp-per-capita-2019.json";
import MunicipalitiesData from '@/interfaces/MunicipalitiesData';
import { sleep } from "@/utils/timeHelper";

interface GdpData {
  gdpPerCapitaBrl2019: number
  code: string
}

export const fetchData = async () => {
  const gdpDataJSON = gdpPerCapitaBrl2019 as GdpData[]
  const municipalitiesData = [] as MunicipalitiesData[]

  for (let i = 0; i < gdpDataJSON.length; i++) {
    const municipalityData  = {
      mainValue: gdpDataJSON[i].gdpPerCapitaBrl2019,
      code: gdpDataJSON[i].code,
    }
    municipalitiesData.push(municipalityData)
  }

  await sleep(500)

  return municipalitiesData
}

export const fetchNames = async () => {
  return []
}