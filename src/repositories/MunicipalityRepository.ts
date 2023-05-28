import * as MunicipalitiesCodes from "@/repositories/municipalities-codes.json";
import * as gdpPerCapitaBrl2019 from "@/repositories/gdp-per-capita-2019.json";
import MunicipalitiesData from '@/interfaces/MunicipalitiesData';
import { sleep } from "@/utils/timeHelper";

interface GdpData {
  gdpPerCapitaBrl2019: number
  code: string
}

interface CityNameWithState {
  stateAcronym: string
  name: string
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

export const fetchNameAndState = (cityCode: string): CityNameWithState | null => {
  const dataJSON = MunicipalitiesCodes

  for (let i = 0; i < dataJSON.length; i++) {
    const cityNameWithState = dataJSON[i]
    if(cityNameWithState.code === cityCode) {
      return {
        stateAcronym: cityNameWithState.stateAcronym,
        name: cityNameWithState.name,
      }
    }
  }

  return null
}