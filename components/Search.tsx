"use client";

import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useEffect, useRef, useState } from "react";

const Search = ({ search }: { search?: string }) => {
  const router = useRouter();
  const initialRender = useRef(true);
  const [text, setText] = useState(search);
  const [query] = useDebounce(text, 1000); // Adjust debounce delay here
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const [searched, setSearched] = useState(false); // State to track if search has been initiated
  const handleSearch = async () => {
    if (!query) {
      setPokemonList([]);
      setSearched(false); // Reset searched state if query is empty
      return;
    }

    setIsLoading(true); // Start loading

    // Use setTimeout to simulate loading for 1 second
    setTimeout(async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
        if (!response.ok) {
          setPokemonList([]);
        } else {
          const data = await response.json();
          const filteredPokemon = data.results.filter((pokemon:any) => pokemon.name.startsWith(query.toLowerCase()));
          setPokemonList(filteredPokemon); // Store found Pokémon in array
        }
      } catch (error) {
        setPokemonList([]);
      } finally {
        setIsLoading(false); // End loading
        setSearched(true); // Set searched state to true after search attempt
      }
    }, 1000); // 1 second delay (1000 milliseconds)
  };
  useEffect(() => {
    

    if (!initialRender.current) {
      handleSearch();
      router.push(`?search=${query}`); // Push route with query param
    } else {
      initialRender.current = false;
    }
  }, [query]);

  const handleInputChange = (e:any) => {
    setText(e.target.value);
    setPokemonList([]); // Reset pokemonList state when input changes
    setSearched(false); // Reset searched state when input changes
  };

  const handleKeyDown = (e:any) => {
    if (e.key === "Enter") {
      // Perform search when Enter key is pressed
      handleSearch();
      router.push(`?search=${query}`); // Push route with query param
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] mx-auto max-w-[1500px]">
      <input
        type="text"
        value={text}
        placeholder="Search Pokemon..."
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-yellow-500 sm:text-sm sm:leading-6 mb-10"
      />
      {isLoading && <div className="text-center text-blue-500 font-bold text-xl mt-4">Loading...</div>}
      {!isLoading && searched && pokemonList.length === 0 && (
        <div className="text-center text-red-500 font-bold text-xl mt-4">
          NO DATA FOUND!!!
        </div>
      )}
      {!isLoading && searched && pokemonList.length > 0 && (
        <div className="text-center text-green-700 font-bold text-xl mt-4">
          {pokemonList.length} Pokémon found!
        </div>
      )}
    </div>
  );
};

export default Search;
