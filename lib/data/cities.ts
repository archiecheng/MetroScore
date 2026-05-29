// TODO: city data retrieval and normalization
export type CityData = {
  name: string;
  state: string;
  population: number;
  medianIncome: number;
  medianHomePrice: number;
  medianRent: number;
};

export async function getCityData(_cityName: string): Promise<CityData> {
  throw new Error("Not implemented");
}
