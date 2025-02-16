import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Row, Col, Button, message } from "antd";
import axios from "axios";
import { Character } from "../api/swapi";

const FuturisticSpinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="futuristic-spinner">
        <div className="circle"></div>
        <div className="glow"></div>
      </div>
    </div>
  );
};

interface HomeworldData {
  name: string;
  climate: string;
  terrain: string;
  population: string;
}

interface FilmData {
  title: string;
  director: string;
  release_date: string;
}

interface SpeciesData {
  name: string;
  classification: string;
  language: string;
}

interface VehicleData {
  name: string;
  model: string;
  manufacturer: string;
}

interface StarshipData {
  name: string;
  model: string;
  manufacturer: string;
}

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [homeworldData, setHomeworldData] = useState<HomeworldData | null>(
    null
  );
  const [filmsData, setFilmsData] = useState<FilmData[]>([]);
  const [speciesData, setSpeciesData] = useState<SpeciesData[]>([]);
  const [vehiclesData, setVehiclesData] = useState<VehicleData[]>([]);
  const [starshipsData, setStarshipsData] = useState<StarshipData[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const prevPage = location.state?.prevPage || 1;

  useEffect(() => {
    if (prevPage) {
      sessionStorage.setItem("currentPage", String(prevPage));
    }
  }, [prevPage]);

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Character>(
          `https://swapi.dev/api/people/${id}/`
        );
        setCharacter(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        message.error("Erro ao buscar detalhes do personagem.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetail();
  }, [id]);

  useEffect(() => {
    if (character) {
      if (character.homeworld) {
        axios
          .get<HomeworldData>(character.homeworld)
          .then((response) => setHomeworldData(response.data))
          .catch((err) => console.error(err));
      }

      if (character.films.length > 0) {
        Promise.all(
          character.films.map((url) =>
            axios.get<FilmData>(url).then((resp) => resp.data)
          )
        )
          .then((data) => setFilmsData(data))
          .catch((err) => console.error(err));
      }

      if (character.species.length > 0) {
        Promise.all(
          character.species.map((url) =>
            axios.get<SpeciesData>(url).then((resp) => resp.data)
          )
        )
          .then((data) => setSpeciesData(data))
          .catch((err) => console.error(err));
      }

      if (character.vehicles.length > 0) {
        Promise.all(
          character.vehicles.map((url) =>
            axios.get<VehicleData>(url).then((resp) => resp.data)
          )
        )
          .then((data) => setVehiclesData(data))
          .catch((err) => console.error(err));
      }

      if (character.starships.length > 0) {
        Promise.all(
          character.starships.map((url) =>
            axios.get<StarshipData>(url).then((resp) => resp.data)
          )
        )
          .then((data) => setStarshipsData(data))
          .catch((err) => console.error(err));
      }
    }
  }, [character]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          width: "100%",
        }}
      >
        <FuturisticSpinner />
      </div>
    );
  }

  if (!character) {
    return <p>Nenhum personagem encontrado.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
        className="custom-back-button"
      >
        Voltar
      </Button>

      <Row gutter={[16, 16]}>
        {/* Card de Informações Básicas */}
        <Col xs={24}>
          <Card title="Informações Básicas" bordered>
            <Row gutter={[16, 16]}>
              {/* Coluna de Informações */}
              <Col xs={24} md={16}>
                <p>
                  <strong>Nome:</strong> {character.name}
                </p>
                <p>
                  <strong>Altura:</strong> {character.height}
                </p>
                <p>
                  <strong>Massa:</strong> {character.mass}
                </p>
                <p>
                  <strong>Cabelo:</strong> {character.hair_color}
                </p>
                <p>
                  <strong>Pele:</strong> {character.skin_color}
                </p>
                <p>
                  <strong>Olhos:</strong> {character.eye_color}
                </p>
                <p>
                  <strong>Ano de Nascimento:</strong> {character.birth_year}
                </p>
                <p>
                  <strong>Gênero:</strong> {character.gender}
                </p>
              </Col>

              {/* Coluna da Imagem */}
              <Col xs={24} md={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <img
                    src={`/${id}.jpg`}
                    alt={character.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Card de Planeta Natal */}
        <Col xs={24}>
          <Card title="Planeta Natal" bordered>
            {homeworldData ? (
              <div>
                <p>
                  <strong>Nome:</strong> {homeworldData.name}
                </p>
                <p>
                  <strong>Clima:</strong> {homeworldData.climate}
                </p>
                <p>
                  <strong>Terreno:</strong> {homeworldData.terrain}
                </p>
                <p>
                  <strong>População:</strong> {homeworldData.population}
                </p>
              </div>
            ) : (
              <p>Sem informações disponíveis.</p>
            )}
          </Card>
        </Col>

        {/* Card de Filmes */}
        <Col xs={24}>
          <Card title="Filmes" bordered>
            {filmsData.length > 0 ? (
              filmsData.map((film, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <p>
                    <strong>Título:</strong> {film.title}
                  </p>
                  <p>
                    <strong>Diretor:</strong> {film.director}
                  </p>
                  <p>
                    <strong>Data de Lançamento:</strong> {film.release_date}
                  </p>
                  {index !== filmsData.length - 1 && <hr />}
                </div>
              ))
            ) : (
              <p>Sem informações disponíveis.</p>
            )}
          </Card>
        </Col>

        {/* Card de Espécies */}
        <Col xs={24}>
          <Card title="Espécies" bordered>
            {speciesData.length > 0 ? (
              speciesData.map((species, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <p>
                    <strong>Nome:</strong> {species.name}
                  </p>
                  <p>
                    <strong>Classificação:</strong> {species.classification}
                  </p>
                  <p>
                    <strong>Idioma:</strong> {species.language}
                  </p>
                  {index !== speciesData.length - 1 && <hr />}
                </div>
              ))
            ) : (
              <p>Sem informações disponíveis.</p>
            )}
          </Card>
        </Col>

        {/* Card de Veículos */}
        <Col xs={24}>
          <Card title="Veículos" bordered>
            {vehiclesData.length > 0 ? (
              vehiclesData.map((vehicle, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <p>
                    <strong>Nome:</strong> {vehicle.name}
                  </p>
                  <p>
                    <strong>Modelo:</strong> {vehicle.model}
                  </p>
                  <p>
                    <strong>Fabricante:</strong> {vehicle.manufacturer}
                  </p>
                  {index !== vehiclesData.length - 1 && <hr />}
                </div>
              ))
            ) : (
              <p>Sem informações disponíveis.</p>
            )}
          </Card>
        </Col>

        {/* Card de Naves Espaciais */}
        <Col xs={24}>
          <Card title="Naves Espaciais" bordered>
            {starshipsData.length > 0 ? (
              starshipsData.map((ship, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <p>
                    <strong>Nome:</strong> {ship.name}
                  </p>
                  <p>
                    <strong>Modelo:</strong> {ship.model}
                  </p>
                  <p>
                    <strong>Fabricante:</strong> {ship.manufacturer}
                  </p>
                  {index !== starshipsData.length - 1 && <hr />}
                </div>
              ))
            ) : (
              <p>Sem informações disponíveis.</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CharacterDetail;
