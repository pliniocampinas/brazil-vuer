import * as gdpPerCapitaBrl2019 from "@/repositories/gdp-per-capita-2019.json";
import MunicipalitiesData from '@/interfaces/MunicipalitiesData';

interface GdpData {
  gdpPerCapitaBrl2019: number
  code: string
}

export const fetchData = async () => {
  const gdpData = gdpPerCapitaBrl2019 as GdpData[]
  return gdpData.map(item => ({
    mainValue: item.gdpPerCapitaBrl2019,
    code: item.code,
  })) as MunicipalitiesData[]
}