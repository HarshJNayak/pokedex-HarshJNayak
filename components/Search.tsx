"use client";

import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useEffect, useRef, useState } from "react";

const Search = ({ search }: { search?: string }) => {
  const router = useRouter();
  const initialRender = useRef(true);
  const [text, setText] = useState(search);
  const [query] = useDebounce(text, 1000); 
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [searched, setSearched] = useState(false); 
  const handleSearch = async () => {
    if (!query) {
      setPokemonList([]);
      setSearched(false); 
      return;
    }

    setIsLoading(true); 

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
        setIsLoading(false); 
        setSearched(true);
      }
    }, 1000); 
  };
  useEffect(() => {
    

    if (!initialRender.current) {
      handleSearch();
      router.push(`?search=${query}`); 
    } else {
      initialRender.current = false;
    }
  }, [query]);

  const handleInputChange = (e:any) => {
    setText(e.target.value);
    setPokemonList([]); 
    setSearched(false); 
  };

  const handleKeyDown = (e:any) => {
    if (e.key === "Enter") {
      
      handleSearch();
      router.push(`?search=${query}`); 
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
