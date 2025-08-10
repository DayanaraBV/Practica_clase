function FavoriteList({ favorites, onRemoveFromFavorites }) {
  if (favorites.length === 0) {
    return (
      <div className="text-center text-white opacity-70">
        <p>No tienes gatos favoritos aún.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {favorites.map((cat) => (
        <div
          key={cat.id}
          className="relative bg-pink-50 rounded-lg overflow-hidden shadow"
        >
          <img
            src={cat.url}
            alt="Gato favorito"
            className="w-full h-32 object-cover"
          />
          <button
            onClick={() => onRemoveFromFavorites(cat.id)}
            className="absolute top-2 right-2 bg-white text-red-600 p-1 rounded-full shadow hover:bg-red-100"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}

export default FavoriteList;
