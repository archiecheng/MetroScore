// TODO: implement city scoring logic
export type CityScores = {
  housing: number;
  income: number;
  population: number;
  jobs: number;
  climate: number;
  quality: number;
  overall: number;
};

export function computeMetroScore(_cityData: unknown): CityScores {
  throw new Error("Not implemented");
}
