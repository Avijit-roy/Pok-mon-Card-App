let totalPokemons = 18;
let cardTable = document.getElementById("cardTable");
let showme = document.getElementById("all");
let uniqueNumbers = new Set();
let uniqueArray;

// Function to generate unique random Pokémon IDs
const generateUniqueArray = () => {
  uniqueNumbers.clear(); // Clear the set before generating new unique numbers
  while (uniqueNumbers.size < totalPokemons) {
    let randomNumber = Math.floor(Math.random() * 1000); // Adjust based on actual Pokémon count
    uniqueNumbers.add(randomNumber);
  }

  uniqueArray = Array.from(uniqueNumbers);
  console.log(uniqueArray);
};

// Function to fetch Pokémon data by type
const fetchPokemonsByType = async (type) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    // Select the first 18 Pokémon of this type
    const pokemons = data.pokemon
      .slice(0, totalPokemons)
      .map((p) => p.pokemon.name);
    // Fetch detailed data for each Pokémon
    pokemons.forEach((pokemon) => fetchPokemonDetails(pokemon));
  } catch (err) {
    console.log(err);
  }
};

// Function to fetch and display Pokémon data
const fetchPokemonDetails = async (name) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const finalData = await response.json();
    let types = finalData.types
      .map((typeInfo) => typeInfo.type.name)
      .join(" / ");

    let inhtml = `<div class="pokemon-card">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${finalData.id}.png"
        alt="${finalData.name}"
      />
      <h3>${finalData.name}</h3>
      <p>ID: ${finalData.id}</p>
      <p>Type:  ${types}</p>
    </div>`;
    cardTable.innerHTML += inhtml;
  } catch (err) {
    console.log(err);
  }
};

// Function to load random Pokémon when the "All" button is clicked
const loadAllPokemons = () => {
  cardTable.innerHTML = ""; // Clear existing cards
  generateUniqueArray(); // Generate new unique Pokémon IDs
  uniqueArray.forEach((id) => fetchPokemonDetails(id)); // Fetch details for each random Pokémon
};

// Function to handle type button clicks
const handleTypeButtonClick = (event) => {
  const type = event.target.classList[1]; // Get the type from the button class
  cardTable.innerHTML = ""; // Clear existing cards
  fetchPokemonsByType(type); // Fetch Pokémon of the selected type
};

// Set up event listeners for all type buttons
document.querySelectorAll(".type-btn").forEach((button) => {
  button.addEventListener("click", handleTypeButtonClick);
});

// Set up event listener for "All" button
if (showme) {
  showme.addEventListener("click", loadAllPokemons);
} else {
  console.error("Element with ID 'all' not found.");
}

// Run loadAllPokemons function after the window has loaded
window.onload = loadAllPokemons();
