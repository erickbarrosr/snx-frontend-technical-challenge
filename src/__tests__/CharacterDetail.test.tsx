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

  it("Should renders character details correctly", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/character/1"]}>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.textContent).toMatch(/Luke Skywalker/i);
    });

    const paragraphs = container.querySelectorAll("p");

    const nameParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Nome:")
    );
    expect(nameParagraph).toBeDefined();
    expect(nameParagraph!.textContent).toContain("Luke Skywalker");

    const heightParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Altura:")
    );
    expect(heightParagraph).toBeDefined();
    expect(heightParagraph!.textContent).toContain("172");

    const massParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Massa:")
    );
    expect(massParagraph).toBeDefined();
    expect(massParagraph!.textContent).toContain("77");

    const hairParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Cabelo:")
    );
    expect(hairParagraph).toBeDefined();
    expect(hairParagraph!.textContent).toContain("Blond");

    const birthYearParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Ano de Nascimento:")
    );
    expect(birthYearParagraph).toBeDefined();
    expect(birthYearParagraph!.textContent).toContain("19BBY");

    const planetParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Tatooine")
    );
    expect(planetParagraph).toBeDefined();
    expect(planetParagraph!.textContent).toContain("Tatooine");

    const climateParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Clima:")
    );
    expect(climateParagraph).toBeDefined();
    expect(climateParagraph!.textContent).toContain("Arid");

    const terrainParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("Terreno:")
    );
    expect(terrainParagraph).toBeDefined();
    expect(terrainParagraph!.textContent).toContain("Desert");

    const populationParagraph = Array.from(paragraphs).find((p) =>
      p.textContent?.includes("População:")
    );
    expect(populationParagraph).toBeDefined();
    expect(populationParagraph!.textContent).toContain("200000");
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
    const { container } = render(
      <MemoryRouter initialEntries={["/character/1"]}>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.textContent).toMatch(/Luke Skywalker/i);
    });

    const buttons = Array.from(container.querySelectorAll("button"));
    const backButton = buttons.find((btn) =>
      btn.textContent?.includes("Voltar")
    );
    expect(backButton).toBeDefined();

    userEvent.click(backButton!);

    expect(window.location.pathname).toBe("/");
  });
});
