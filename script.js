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

let pokemonAPIglobal;

async function init() {
    await includeHTML();
    await renderAPI();
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

// Für Suchfunktion
let pokemonCardArray = [];

// Alle Pokemons laden bis zum Limit
async function renderAPI() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;
    let response = await fetch(url);
    let pokemonAPI = await response.json();
    renderInfos(pokemonAPI);
}

function renderInfos(pokemonAPI) {
    let allNames = pokemonAPI['results'];
    for (let i = 0; i < allNames.length; i++) {
        let name = allNames[i]['name']; // zeigt alle Pokemon Namen
        pokemonCardArray.push(name); // für die Suchfunktion
        renderImageTypeColor(name, i);
        // Pokemon Namen auf der Index Startseite einblenden
        document.getElementById('pokemonCollectionId').innerHTML += pokemonCollection(i, name);
    }
}

function pokemonCollection(i, name) {
    return /* html */ `
    <div class="pokemon-card" id="pokemon-card-id${[i]}">
            <!--number-->
            <div class="pokemon-number">
                #${i + 1}
            </div>
            <!--image-->
            <div class="height-limitter-50 center">
                <img id="pokemonImageId${[i]}" class="pokemonImage" onclick="renderBigView('${name}', ${i})">
            </div>
            <!--description-->
            <div class="height-limitter-50 center-vertical">
                <div class="pokemon-info-box">
                    <div class="pokemon-name center-vertical">
                        <b>${name.toUpperCase()}</b>
                    </div>
                    <div id="pokemon-type-image-id${[i]}" class="pokemon-type       center">
                    </div>
                </div>
            </div >
    </div >
        `
}

async function renderImageTypeColor(name, i) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    let pokemonAPI = await response.json();
    // load image:
    let loadImage = pokemonAPI['sprites']['other']['home']['front_default'];
    document.getElementById(`pokemonImageId${[i]}`).src = /* html */ `
     ${loadImage}`;
    // type backgrounds color
    typeImageAndColor(pokemonAPI, i);
}

function typeImageAndColor(pokemonAPI, i) {
    let allTypes = pokemonAPI['types'];
    let typeBackgrounds = [];
    for (let j = 0; j < allTypes.length; j++) {
        let type = allTypes[j];
        let typeName = type['type']['name'];
        // type images
        document.getElementById(`pokemon-type-image-id${[i]}`).innerHTML += /* html */ `
        <img src="./img/${typeName}-solid-white.png" class="pokemon-type-image">`;

        // backgrounds:
        document.getElementById(`pokemon-card-id${[i]}`).style.backgroundColor = typeColors[typeName];

        typeBackgrounds.push(typeColors[typeName]);

        // Farbverlauf
        document.getElementById(`pokemon-card-id${[i]}`).style.background = `linear-gradient(to right, ${typeBackgrounds.join(', ')})`;
    }
}

window.addEventListener('scroll', () => {
    // Überprüfen, ob das Ende der Seite erreicht wurde
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        // Hier wird der Code ausgeführt, wenn das Ende der Seite erreicht wurde
        console.log('end');
        loadMore();
    }
});

async function loadMore() {
    limit += 20;
    document.getElementById('pokemonCollectionId').innerHTML = '';
    renderAPI();
}

async function renderBigView(name, i) {
    pokemonAPIglobal = await fetchPokemonData(name);
    renderBigViewInfos(name, i);
    document.getElementById('pokemonDetailsId').innerHTML = '';
    document.getElementById('pokemonDetailsId').innerHTML += cardBigView(i, name, pokemonAPIglobal);
}

async function fetchPokemonData(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    return response.json();
}

function cardBigView(i, name) {
    return /* html */ `
    <!--mit limitter mittig ausrichten-->
    <div class="dark-background" onclick="closeBigView()" id="deleteBackgroundId">
    </div>
    <div class="cardOnBigViewLimitter" id="deletePokemonCardId">
        <div class="card-on-big-view" id="pokemon-card-on-big-view-id${[i]}">
            <div class="pokemon-number-on-big-view delete">
                #${i + 1}
            </div>
            <div class="pokemon-name-image-type-on-big-view">
                <!--image-on-big-view-->
                <img id="pokemon-image-on-big-view-id">
                <!--name-on-big-view-->
                <div class="pokemon-name-type-limitter">
                    <h1 class="pokemon-name-on-big-screen">${name.toUpperCase()}</h1>
                    <!--type-on-big-view-->
                    <div id="pokemon-type-on-big-view-id${[i]}" class="center pokemon-type-on-big-screen">
                    </div>
                </div>
            </div>
            <div class="info-container center-horicontal">
                    <div class="cardInfo" id="cardInfoId">
                        <h2 onclick="openAbout(pokemonAPIglobal)">About</h2>
                        <h2 onclick="openChart()">Stats</h2>
                        <h2 onclick="openEvolutions()">Evolutions</h2>
                    </div>
                    <div class="cardInfoContentLimitter center-horicontal">
                    <div class="cardInfoContent">
                            <div id="aboutId">
                            </div>
                            <div id="openChartId">
                            </div>
                            <div>
                            </div>
                        <div>
                    </div>
            </div>
        </div>
    </div>`
}

function openChart() {
    show('openChartId');
    hide('aboutId');
    document.querySelector('h2[onclick="openAbout(pokemonAPIglobal)"]').classList.remove('underlined');
    document.querySelector('h2[onclick="openChart()"]').classList.add('underlined');
    document.getElementById('openChartId').innerHTML = `
    <canvas id="myChartId">
    </canvas>`;
    renderChart();
}

async function renderBigViewInfos(name, i) {
    baseStatsNamesArray = []; // Arrays zu Beginn leeren
    baseStatsValuesArray = []; // Arrays zu Beginn leeren
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    await response.json();
    let loadImage = pokemonAPIglobal['sprites']['other']['home']['front_default'];
    document.getElementById('pokemon-image-on-big-view-id').src = loadImage;

    typeImageAndColorBigView(pokemonAPIglobal, i); // Typenbilder, Typenbeschreibung, Hintergrundfarbe
    chart(pokemonAPIglobal); // Balkendiagramm
    // openChart();
    openAbout(pokemonAPIglobal); // Infos über das Pokemon
}

function typeImageAndColorBigView(pokemonAPI, i) {
    let allTypes = pokemonAPI['types'];
    let typeBackgrounds = [];
    for (let j = 0; j < allTypes.length; j++) {
        let type = allTypes[j];
        let typeName = type['type']['name'];
        //type image
        document.getElementById(`pokemon-type-on-big-view-id${[i]}`).innerHTML +=
        /* html */ `
        <img src="./img/${typeName}-solid-white.png" class="pokemon-type-image">
        <div>${typeName}</div>`;

        document.getElementById(`pokemon-card-on-big-view-id${[i]}`).style.backgroundColor = typeColors[typeName];

        typeBackgrounds.push(typeColors[typeName]);

        // Farbverlauf
        document.getElementById(`pokemon-card-on-big-view-id${[i]}`).style.background = `linear-gradient(to right, ${typeBackgrounds.join(', ')})`;
    }
}

function chart(pokemonAPIglobal) {
    let currentAbilities = pokemonAPIglobal['stats'];
    for (let j = 0; j < currentAbilities.length; j++) {
        let currentAbility = currentAbilities[j];
        // stats Namen in die Arrays
        let currentAbilityName = currentAbility['stat']['name'];
        let currentAbilityValue = currentAbility['base_stat'];
        baseStatsNamesArray.push(currentAbilityName.toUpperCase()); // ins Array für die chart.js
        baseStatsValuesArray.push(currentAbilityValue); // ins Array für die chart.js
    }
}

function openAbout(pokemonAPIglobal) {
    hide('openChartId');
    show('aboutId');
    let weight = pokemonAPIglobal['weight'];
    let height = pokemonAPIglobal['height'];
    let exp = pokemonAPIglobal['base_experience'];
    document.getElementById('aboutId').innerHTML = /* html */ `
    <h3>Overview</h3>
    <div class="overviewLimitter">
        <h4><b>Weight:</b><h4>${weight / 10} kg</h4>
    </div>
    <div class="overviewLimitter">
        <h4><b>Height:</b></h4><h4>${height / 10} m</h4>
    </div>
    <div class="overviewLimitter">
        <h4><b>Exp:</b></h4><h4>${exp}</h4>
    </div>
    `;

    document.querySelector('h2[onclick="openAbout(pokemonAPIglobal)"]').classList.add('underlined');
    document.querySelector('h2[onclick="openChart()"]').classList.remove('underlined');
}

function filterNames() {
    let search = document.getElementById('searchId').value.toLowerCase();

    for (let i = 0; i < pokemonCardArray.length; i++) {
        let name = pokemonCardArray[i].toLowerCase();
        let card = document.getElementById(`pokemon-card-id${i}`);

        if (search === '' || name.includes(search)) {
            card.style.display = 'block'; // Karte anzeigen
        } else {
            card.style.display = 'none'; // Karte ausblenden
        }
    }
}

function resetSearch() {
    if (document.getElementById('searchId').value === '') {
        filterNames();
    }
}

function closeBigView() {
    deletePokemonCardId.style.display = 'none';
    deleteBackgroundId.style.display = 'none';
}

function hide(id) {
    document.getElementById(id).classList.add('d-none');
}
function show(id) {
    document.getElementById(id).classList.remove('d-none');
}