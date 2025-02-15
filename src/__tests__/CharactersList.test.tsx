import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CharactersList from "../components/CharactersList";
import * as swapi from "../api/swapi";
import { MemoryRouter } from "react-router-dom";
import { Character } from "../api/swapi";

const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [new URLSearchParams(), jest.fn()],
  };
});

const mockCharacters = [
  {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    gender: "male",
    url: "https://swapi.dev/api/people/1/",
  },
  {
    name: "Leia Organa",
    height: "150",
    mass: "49",
    gender: "female",
    url: "https://swapi.dev/api/people/5/",
  },
];

describe("Testing the CharactersList Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest
      .spyOn(swapi, "fetchCharacters")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation(async (_page?: number, _search?: string) => {
        return {
          count: mockCharacters.length,
          next: null,
          previous: null,
          results: mockCharacters as Character[],
        };
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    navigateMock.mockClear();
  });

  it("Should display the loading spinner initially and render the data after loading", async () => {
    const { container } = render(
      <MemoryRouter>
        <CharactersList />
      </MemoryRouter>
    );

    expect(container.querySelector(".futuristic-spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
      expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
    });

    expect(
      container.querySelector(".futuristic-spinner")
    ).not.toBeInTheDocument();
  });

  it("Should filter the characters based on the value entered in the search input", async () => {
    render(
      <MemoryRouter>
        <CharactersList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/Luke Skywalker/i));

    const searchInput = screen.getByPlaceholderText("Busque por um personagem");

    fireEvent.change(searchInput, { target: { value: "Leia" } });

    await waitFor(() => {
      expect(screen.queryByText(/Luke Skywalker/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
    });
  });

  it("Should display an empty state when no character matches the search", async () => {
    render(
      <MemoryRouter>
        <CharactersList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/Luke Skywalker/i));

    const searchInput = screen.getByPlaceholderText("Busque por um personagem");

    fireEvent.change(searchInput, {
      target: { value: "PersonagemInexistente" },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Desculpe, personagem não encontrado!/i)
      ).toBeInTheDocument();
    });
  });

  it("Should call the navigation function when clicking on a row in the table", async () => {
    render(
      <MemoryRouter>
        <CharactersList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/Luke Skywalker/i));

    fireEvent.click(screen.getByText(/Leia Organa/i));

    expect(navigateMock).toHaveBeenCalled();
  });
});
