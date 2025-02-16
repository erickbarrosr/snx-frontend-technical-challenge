import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Space,
  Pagination,
  Row,
  Col,
  message,
  Empty,
} from "antd";
import { Character, fetchCharacters } from "../api/swapi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QuestionOutlined } from "@ant-design/icons";

const { Search } = Input;

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

const CharactersList: React.FC = () => {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const [inputValue, setInputValue] = useState("");
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (Number(searchParams.get("page")) !== page) {
      setSearchParams({ page: String(page) });
    }
  }, [page, setSearchParams, searchParams]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const storedData = sessionStorage.getItem("charactersData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAllCharacters(parsedData);
        setFilteredCharacters(parsedData);
        return;
      }

      let pageNumber = 1;
      let allData: Character[] = [];
      let response;
      do {
        response = await fetchCharacters(pageNumber);
        allData = allData.concat(response.results);
        pageNumber++;
      } while (response.next !== null);

      sessionStorage.setItem("charactersData", JSON.stringify(allData));
      setAllCharacters(allData);
      setFilteredCharacters(allData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      message.error("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedPage = sessionStorage.getItem("currentPage");
    if (storedPage) {
      setPage(Number(storedPage));
    }
    fetchAllData();
  }, []);

  const handleSearch = (value: string) => {
    setPage(1);
    try {
      const regex = new RegExp(value, "i");
      const filtered = allCharacters.filter((character) =>
        regex.test(character.name)
      );
      setFilteredCharacters(filtered);
    } catch (error) {
      console.log(error);

      message.error("Expressão regular inválida");
      setFilteredCharacters(allCharacters);
    }
  };

  useEffect(() => {
    handleSearch(inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, allCharacters]);

  const currentData = filteredCharacters.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Altura",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Massa",
      dataIndex: "mass",
      key: "mass",
    },
    {
      title: "Gênero",
      dataIndex: "gender",
      key: "gender",
    },
  ];

  const getIdFromUrl = (url: string): string => {
    const parts = url.split("/").filter(Boolean);

    return parts[parts.length - 1];
  };

  const customEmptyText = (
    <Empty
      image={<QuestionOutlined style={{ fontSize: 48, color: "#ffcc00" }} />}
      description={
        <span style={{ color: "#ffcc00" }}>
          Desculpe, personagem não encontrado!
        </span>
      }
    />
  );

  return (
    <Space direction="vertical" style={{ width: "100%", padding: "20px" }}>
      {loading ? (
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
      ) : (
        <>
          <Row justify="center">
            <Col xs={24} sm={12} md={8}>
              <Search
                className="custom-search custom-input"
                placeholder="Busque por um personagem"
                enterButton={false}
                size="large"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Col>
          </Row>
          <Table
            dataSource={currentData}
            columns={columns}
            rowKey="name"
            pagination={false}
            bordered
            onRow={(record) => ({
              style: { cursor: "pointer" },
              onClick: () => {
                const id = getIdFromUrl(record.url);
                navigate(`/character/${id}`, { state: { prevPage: page } });
              },
            })}
            locale={{
              emptyText: customEmptyText,
            }}
          />
          <Pagination
            current={page}
            total={filteredCharacters.length}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(newPage) => {
              sessionStorage.setItem("currentPage", String(newPage));
              setPage(newPage);
            }}
            style={{ textAlign: "center", marginTop: "20px" }}
          />
        </>
      )}
    </Space>
  );
};

export default CharactersList;
