const MAX_POKEMON = 649;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  });

async function fetchPokemonData(pokemon) {
  try {
    const response = await fetch(pokemon.url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

async function displayPokemons(pokemonList) {
  listWrapper.innerHTML = "";

  for (const pokemon of pokemonList) {
    const pokemonID = pokemon.url.split("/")[6];
    const pokemonData = await fetchPokemonData(pokemon);

    if (!pokemonData) continue; // Skip if data couldn't be fetched

    const mainType = pokemonData.types[0].type.name; // Get main type
    const typeColor = typeColors[mainType] || "#0073e6"; // Default to blue

    const listItem = document.createElement("div");
    listItem.className = "list-item";

    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap type-background" style="background-color: ${typeColor};">
            <p class="body3-fonts">${pokemon.name}</p>
        </div>
    `;

    listItem.addEventListener("click", () => {
      window.location.href = `./detail.html?id=${pokemonID}`;
    });

    listWrapper.appendChild(listItem);
  }
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  // Sort results before displaying
  filteredPokemons.sort((a, b) => {
    const idA = parseInt(a.url.split("/")[6], 10);
    const idB = parseInt(b.url.split("/")[6], 10);
    return idA - idB;
  });

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};
