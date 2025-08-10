import React, { useState } from "react";

function SearchBar({ searchTerm, onSearchChange, breeds, onSelectSuggestion }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelectBreed = (breed) => {
    onSearchChange(breed.name);
    onSelectSuggestion(breed.id, breed.name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-48">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value);
          onSelectSuggestion("", null);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Escribe una raza..."
        className="w-full px-4 py-2 rounded-full bg-[#6a5a87] text-pink-100 placeholder-pink-200 focus:outline-none"
      />

      {showSuggestions && searchTerm && (
        <ul className="absolute z-10 bg-[#6a5a87] text-pink-100 w-full mt-1 rounded-md max-h-40 overflow-y-auto shadow-lg">
          {breeds
            .filter((breed) =>
              breed.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 10)
            .map((breed) => (
              <li
                key={breed.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectBreed(breed);
                }}
                className="p-2 hover:bg-[#8b7aad] cursor-pointer"
              >
                {breed.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
