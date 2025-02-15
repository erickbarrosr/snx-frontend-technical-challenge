import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import CharacterDetail from "../components/CharacterDetail";
import userEvent from "@testing-library/user-event";

jest.mock("axios");

const mockGet = jest.fn();

axios.get = mockGet;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
}));

describe("Testing the CharacterDetail Component", () => {
  const mockCharacter = {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "Blond",
    skin_color: "Fair",
    eye_color: "Blue",
    birth_year: "19BBY",
    gender: "Male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: ["https://swapi.dev/api/films/1/"],
    species: [],
    vehicles: [],
    starships: [],
  };

  const mockHomeworld = {
    name: "Tatooine",
    climate: "Arid",
    terrain: "Desert",
    population: "200000",
  };

  const mockFilm = {
    title: "A New Hope",
    director: "George Lucas",
    release_date: "1977-05-25",
  };

  beforeEach(() => {
    mockGet.mockImplementation((url) => {
      if (url.includes("people"))
        return Promise.resolve({ data: mockCharacter });
      if (url.includes("planets"))
        return Promise.resolve({ data: mockHomeworld });
      if (url.includes("films")) return Promise.resolve({ data: mockFilm });
      return Promise.reject(new Error("URL não mapeada"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should render the character details correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/character/1"]}>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    expect(await screen.findByText("Nome: Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Altura: 172")).toBeInTheDocument();
    expect(screen.getByText("Massa: 77")).toBeInTheDocument();
    expect(screen.getByText("Cabelo: Blond")).toBeInTheDocument();
    expect(screen.getByText("Ano de Nascimento: 19BBY")).toBeInTheDocument();

    expect(await screen.findByText("Nome: Tatooine")).toBeInTheDocument();
    expect(screen.getByText("Clima: Arid")).toBeInTheDocument();
    expect(screen.getByText("Terreno: Desert")).toBeInTheDocument();
    expect(screen.getByText("População: 200000")).toBeInTheDocument();
  });

  it("Should show an error message if the API fails", async () => {
    mockGet.mockRejectedValue(new Error("Erro ao buscar dados"));

    render(
      <MemoryRouter initialEntries={["/character/1"]}>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Erro ao buscar detalhes do personagem.")
    ).toBeInTheDocument();
  });

  it("Should allow the user to go back to the previous page", async () => {
    render(
      <MemoryRouter initialEntries={["/character/1"]}>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Nome: Luke Skywalker")).toBeInTheDocument();

    const backButton = screen.getByText("Voltar");
    userEvent.click(backButton);

    expect(window.location.pathname).toBe("/");
  });
});
