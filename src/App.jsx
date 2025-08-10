import React, { useState, useEffect } from "react";
import { gatitoRandom, getCatsByBreed, getBreeds } from "./services/catServices";
import SearchBar from "./components/SearchBar";
import FavoriteList from "./components/FavoriteList";
import logo from "./assets/miaupicDere.png";

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [pendingBreed, setPendingBreed] = useState("");
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalCat, setModalCat] = useState(null); // Para imagen grande

  useEffect(() => {
    const axiosBreeds = async () => {
      const data = await getBreeds();
      setBreeds(data);
    };
    axiosBreeds();
  }, []);

  useEffect(() => {
    if (!selectedBreed) {
      const axiosCats = async () => {
        const gatitos = await Promise.all(
          Array.from({ length: 6 }, () => gatitoRandom())
        );
        setCats(gatitos);
      };
      axiosCats();
    }
  }, [selectedBreed]);

  const getBreedIdFromSearch = () => {
    if (pendingBreed) return pendingBreed;
    const match = breeds.find(
      (b) => b.name.toLowerCase() === searchTerm.toLowerCase()
    );
    return match?.id || "";
  };

  const canSearch = Boolean(getBreedIdFromSearch());

  const handleSearch = async () => {
    const breedId = getBreedIdFromSearch();
    if (!breedId) return;
    setLoading(true);
    const catsData = await getCatsByBreed(breedId);
    setCats(catsData);
    setSelectedBreed(breedId);
    setLoading(false);
  };

  const handleAddToFavorites = (cat) => {
    if (!favorites.some((fav) => fav.id === cat.id)) {
      setFavorites([...favorites, cat]);
    }
  };

  const handleRemoveFromFavorites = (catId) => {
    setFavorites(favorites.filter((cat) => cat.id !== catId));
  };

  const isFavorite = (catId) => favorites.some((fav) => fav.id === catId);

  return (
    <div className="min-h-screen bg-[#3d3350] flex items-start justify-center p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">

        {/* Columna izquierda */}
        <div className="flex-1 flex flex-col gap-0">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <img
              src={logo}
              alt="Logo"
              className="w-39 h-auto object-contain -mt-12"
            />
          </div>

          {/* Título + barra de búsqueda */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mt-1">
            <h1 className="text-2xl font-bold text-pink-200">
              {!selectedBreed ? "Gatos Randoms 😺" : "Gato filtrado 🐈"}
            </h1>
            <div className="flex items-center gap-2">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                  setSearchTerm(val);
                }}
                breeds={breeds}
                onSelectSuggestion={(breedId, breedName) => {
                  setPendingBreed(breedId);
                  if (breedName) {
                    setSearchTerm(breedName);
                  }
                }}
              />
              <button
                onClick={handleSearch}
                className="bg-pink-400 text-white px-4 py-2 rounded-full hover:bg-pink-500 transition"
                disabled={!canSearch || loading}
              >
                {loading ? "Cargando..." : "Buscar"}
              </button>
            </div>
          </div>

          {/* Lista de gatos */}
          {cats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white/10 p-4 rounded-xl mt-2">
              {cats.map((cat) => (
                <div
                  key={cat.id}
                  className="relative bg-pink-50 rounded-lg overflow-hidden shadow flex flex-col cursor-pointer"
                  onClick={() => setModalCat(cat)}
                >
                  <img
                    src={cat.url}
                    alt="Gato"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 text-center text-sm font-medium text-[#3d3350]">
                    {cat.breeds?.[0]?.name ||
                      breeds.find((b) => b.id === selectedBreed)?.name ||
                      "Raza desconocida"}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToFavorites(cat);
                    }}
                    disabled={isFavorite(cat.id)}
                    className={`absolute top-2 right-2 px-2 py-1 text-sm rounded shadow transition ${
                      isFavorite(cat.id)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-pink-600 hover:bg-pink-100"
                    }`}
                  >
                    {isFavorite(cat.id) ? "✔" : "❤️"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && selectedBreed && cats.length === 0 && (
            <p className="text-center mt-6 text-gray-300">
              No se encontraron gatos para esta raza.
            </p>
          )}
        </div>

        {/* Columna derecha */}
        <div className="w-full md:w-64 bg-[#a57380] rounded-xl p-4 flex flex-col md:mt-[54px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-bold">Gatos Favoritos</h2>
            <span className="text-white">🐾</span>
          </div>
          <FavoriteList
            favorites={favorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        </div>
      </div>

      {/* Modal de imagen */}
      {modalCat && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setModalCat(null)}
        >
          <div
            className="relative bg-white p-4 rounded-xl flex flex-col items-center max-w-[90%] max-h-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón X */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
              onClick={() => setModalCat(null)}
            >
              ×
            </button>

            <img
              src={modalCat.url}
              alt="Gato completo"
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
            <p className="mt-2 text-lg font-semibold text-[#3d3350]">
              {modalCat.breeds?.[0]?.name ||
                breeds.find((b) => b.id === selectedBreed)?.name ||
                "Raza desconocida"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
