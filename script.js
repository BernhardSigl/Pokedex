const typeColors = {
    fire: "#F57D31",
    water: "#6493EB",
    grass: "#74CB48",
    electric: "#F9CF30",
    ice: "#9AD6DF",
    fighting: "#C12239",
    poison: "#A43E9E",
    ground: "#DEC16B",
    flying: "#A891EC",
    psychic: "#FB5584",
    bug: "#A7B723",
    rock: "#B69E31",
    ghost: "#70559B",
    steel: "#B7B9D0",
    dragon: "#7037FF",
    dark: "#75574C",
    fairy: "#E69EAC",
    normal: "#AAA67F"
};

async function init() {
    await includeHTML();
    await loadPokemonCollection();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}
// Für Diagramm
let baseStatsNamesArray = [];
let baseStatsValuesArray = [];

// Load More
let limit = 20;

let pokemonCardArray = [];


let pokemonCollection;
async function loadPokemonCollection() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;
    let response = await fetch(url);
    pokemonCollection = await response.json();
    renderPokemonCollection();
    pokemonCardArray.push(); // für die Suchfunktion
}

function renderPokemonCollection() {
    let allNames = pokemonCollection['results'];
    for (let i = 0; i < allNames.length; i++) {
        let name = allNames[i]['name']; // zeigt alle Pokemon Namen
        pokemonCardArray.push(name);
        loadPokemonAPI(name, i);
        // Pokemon Namen auf der Index Startseite einblenden
        document.getElementById('pokemonCollectionId').innerHTML += /* html */ `
        <div class="pokemon-card" id="pokemon-card-id${[i]}">
                <!--number-->
                <div class="pokemon-number">
                #${i + 1}
                </div>
                <!--image-->
                <div class="height-limitter-50 center">
                <img id="pokemonImageId${[i]}" class="pokemonImage" onclick="showPokemonDetails('${name}', ${i})">
                </div>
                <!--description-->
                <div class="height-limitter-50 center-vertical">
                    <div class="pokemon-info-box">
                        <div class="pokemon-name center-vertical">
                            <b>${name.toUpperCase()}</b>
                        </div>
                        <div id="pokemon-type-image-id${[i]}" class="pokemon-type center">
                        </div>
                    </div>
                </div >
        </div >
            `;
    }
}
async function loadPokemonAPI(name, i) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    let pokemonAPI = await response.json();
    // load image:
    let loadImage = pokemonAPI['sprites']['other']['home']['front_default'];
    document.getElementById(`pokemonImageId${[i]}`).src = /* html */ `
     ${loadImage}`;

    let allTypes = pokemonAPI['types'];
    let typeBackgrounds = [];

    // backgrounds:
    for (let j = 0; j < allTypes.length; j++) {
        let type = allTypes[j];
        let typeName = type['type']['name'];

        document.getElementById(`pokemon-type-image-id${[i]}`).innerHTML += /* html */ `
        <img src="./img/${typeName}-solid-white.png" class="pokemon-type-image">`;

        document.getElementById(`pokemon-card-id${[i]}`).style.backgroundColor = typeColors[typeName];

        typeBackgrounds.push(typeColors[typeName]);

        // Farbverlauf
        document.getElementById(`pokemon-card-id${[i]}`).style.background = `linear-gradient(to right, ${typeBackgrounds.join(', ')})`;
    }
}

function loadMore() {
    limit += 20;
    document.getElementById('pokemonCollectionId').innerHTML = '';
    loadPokemonCollection();
}

async function showPokemonDetails(name, j) {
    pokemonBigView(name, j);
    document.getElementById('pokemonDetailsId').innerHTML = '';
    document.getElementById('pokemonDetailsId').innerHTML += /* html */ `
    <!--mit limitter mittig ausrichten-->
    <div class="dark-background" onclick="closeBigView()" id="deleteBackgroundId">
    </div>
    <div class="cardOnBigViewLimitter" id="deletePokemonCardId">
        <div class="card-on-big-view" id="pokemon-card-on-big-view-id${[j]}">
            <div class="pokemon-number-on-big-view delete">
                #${j + 1}
            </div>
            <div class="pokemon-name-image-type-on-big-view">
                <!--image-on-big-view-->
                <img id="pokemon-image-on-big-view-id">
                <!--name-on-big-view-->
                <div class="pokemon-name-type-limitter">
                    <h1 class="pokemon-name-on-big-screen">${name.toUpperCase()}</h1>
                    <!--type-on-big-view-->
                    <div id="pokemon-type-on-big-view-id${[j]}" class="center pokemon-type-on-big-screen">
                    </div>
                </div>
            </div>
            <div class="info-container center-horicontal">
                    <div class="baseStats">
                        <canvas id="myChartId">
                        </canvas>
                    </div>
            </div>
        </div>
    </div>`
}

async function pokemonBigView(name, j) {
    baseStatsNamesArray = []; // Arrays zu Beginn leeren
    baseStatsValuesArray = []; // Arrays zu Beginn leeren
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    let currentCharacters = await response.json();
    let currentPokemonImageInDetail = currentCharacters['sprites']['other']['home']['front_default'];
    document.getElementById('pokemon-image-on-big-view-id').src = currentPokemonImageInDetail;


    let allTypes = currentCharacters['types'];
    let typeBackgrounds = [];

    // backgrounds:
    for (let k = 0; k < allTypes.length; k++) {
        let type = allTypes[k];
        let typeName = type['type']['name'];

        document.getElementById(`pokemon-type-on-big-view-id${[j]}`).innerHTML += /* html */ `
        <img src="./img/${typeName}-solid-white.png" class="pokemon-type-image">
        <div>${typeName}</div>
        `;

        document.getElementById(`pokemon-card-on-big-view-id${[j]}`).style.backgroundColor = typeColors[typeName];

        typeBackgrounds.push(typeColors[typeName]);

        // Farbverlauf
        document.getElementById(`pokemon-card-on-big-view-id${[j]}`).style.background = `linear-gradient(to right, ${typeBackgrounds.join(', ')})`;
    }

    let currentAbilities = currentCharacters['stats'];
    for (let i = 0; i < currentAbilities.length; i++) {
        let currentAbility = currentAbilities[i];
        // stats Namen in die Arrays
        let currentAbilityName = currentAbility['stat']['name'];
        let currentAbilityValue = currentAbility['base_stat'];
        baseStatsNamesArray.push(currentAbilityName.toUpperCase()); // ins Array für die chart.js
        baseStatsValuesArray.push(currentAbilityValue); // ins Array für die chart.js
    }
    renderChart();
}

// Funktion zur Filterung der Pokemon-Namen
function filterNames() {
    let search = document.getElementById('searchId').value.toLowerCase();
    let cards = document.getElementsByClassName('pokemon-card');

    for (let i = 0; i < cards.length; i++) {
        let name = pokemonCardArray[i].toLowerCase();
        if (search === '' || name.includes(search)) {
            cards[i].style.display = 'block'; // Karte anzeigen
        } else {
            cards[i].style.display = 'none'; // Karte ausblenden
        }
    }
}

function resetSearch() {
    if (document.getElementById('searchId').value === '') {
        filterNames();
    }
}

function closeBigView() {
    // const cardOnBigViewLimitter = document.querySelector('.dark-background');
    deletePokemonCardId.style.display = 'none';
    deleteBackgroundId.style.display = 'none';
}