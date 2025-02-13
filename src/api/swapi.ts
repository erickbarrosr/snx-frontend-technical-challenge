import axios from "axios";

const BASE_URL = "https://swapi.dev/api";

export interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

export const fetchCharacters = async (
  page: number = 1,
  search: string = ""
): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/people/`, {
    params: { page, search },
  });

  return response.data;
};
