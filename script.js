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
let isLoading = false;
let isFiltered = false;
let bigView = false;

async function init() {
    document.getElementById('loadingOverlay').style.display = 'flex';
    await includeHTML();
    await renderAPI();
    await renderSearchAPI();
    toggleVisibility('showScrollButtonId', false); // Pfeil zum nach oben scrollen, soll erst erscheinen, sobald 20 weitere Pokemon geladen sind
    document.getElementById('loadingOverlay').style.display = 'none';
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
let limit = 0;

// Für Suchfunktion
let pokemonCardArray = [];
let originalLoadedPokemonCount;

// Alle Pokemons laden bis zum Limit
async function renderAPI() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${limit}&limit=20`;
    let response = await fetch(url);
    let pokemonAPI = await response.json();
    originalLoadedPokemonCount = pokemonAPI.count;
    renderInfos(pokemonAPI, limit);
}

async function renderSearchAPI() {
    let urlForSearch = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    let responseForSearch = await fetch(urlForSearch);
    let loadAllPokemon = await responseForSearch.json();
    renderAllPokemonNames(loadAllPokemon);
}

function renderInfos(pokemonAPI, limit) {
    let allNames = pokemonAPI['results'];
    for (let i = 0; i < allNames.length; i++) {
        let name = allNames[i]['name']; // zeigt alle Pokemon Namen
        renderImageTypeColor(i + limit, name);
        // Pokemon Namen auf der Index Startseite einblenden
        document.getElementById('pokemonCollectionId').innerHTML += pokemonCollection((i + limit), name);
    }
}

function renderAllPokemonNames(loadAllPokemon) {
    let loadAllPokemonNames = loadAllPokemon['results'];
    for (let j = 0; j < loadAllPokemonNames.length; j++) {
        const allNamesForSearch = loadAllPokemonNames[j]['name'];
        pokemonCardArray.push(allNamesForSearch); // für die Suchfunktion
    }
}

function pokemonCollection(i, name) {
    return /* html */ `
    <div class="pokemon-card" id="pokemon-card-id${[i]}" onclick="renderBigView('${name}', ${i})">
            <!--number-->
            <div class="pokemon-number">
                #${i + 1}
            </div>
            <!--image-->
            <div class="height-limitter-50 center">
                <img id="pokemonImageId${[i]}" class="pokemonImage">
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
        `
}

async function renderImageTypeColor(i, name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    let pokemonAPI = await response.json();
    // load image:
    let imageElement = document.getElementById(`pokemonImageId${[i]}`);
    if (imageElement) {
        imageElement.src = pokemonAPI['sprites']['other']['official-artwork']['front_default'];
        imageElement.onerror = function () {
            imageElement.src = 'img/pokeball.png';
        };
    }
    // type backgrounds color
    typeImageAndColor(pokemonAPI, i);
}

function typeImageAndColor(pokemonAPI, i) {
    let allTypes = pokemonAPI['types'];
    let typeBackgrounds = [];
    for (let j = 0; j < allTypes.length; j++) {
        let type = allTypes[j];
        let typeName = type['type']['name'];
        try {
            // type images
            document.getElementById(`pokemon-type-image-id${[i]}`).innerHTML += /* html */ `
        <img src="./img/${typeName}-solid-white.png" class="pokemon-type-image">`;

            // backgrounds:
            document.getElementById(`pokemon-card-id${[i]}`).style.backgroundColor = typeColors[typeName];

            typeBackgrounds.push(typeColors[typeName]);

            // Farbverlauf
            document.getElementById(`pokemon-card-id${[i]}`).style.background = `linear-gradient(to right, ${typeBackgrounds.join(', ')})`;
        } catch (error) {
        }
    }
}

window.addEventListener('scroll', () => {
    if (!isLoading && !isFiltered) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1.0) {
            loadMore();
        }
    }
});

async function loadMore() {
    if (!isLoading) {
        isLoading = true;
        document.body.classList.add('disable-scroll');
        // Zeige die Ladeanimation
        document.getElementById('loadingOverlay').style.display = 'flex';
        await new Promise(resolve => setTimeout(resolve, 2500));
        limit += 20;
        await renderAPI();
        isLoading = false;

        // Verberge die Ladeanimation
        document.getElementById('loadingOverlay').style.display = 'none';
        document.body.classList.remove('disable-scroll');
        toggleVisibility('showScrollButtonId', true);
    }
}

async function renderBigView(name, i) {
    bigView = true;
    pokemonAPIglobal = await fetchPokemonData(name);
    renderBigViewInfos(name, i);
    document.getElementById('pokemonDetailsId').innerHTML = '';
    document.getElementById('pokemonDetailsId').innerHTML += cardBigView(name, i);
    slide(`pokemon-card-on-big-view-id${i}`);
    if (i < 1) {
        toggleVisibility('arrowleftId', false);
    }
    if (i === pokemonCardArray.length - 1) {
        toggleVisibility('arrowrightId', false);
    }
    toggleVisibility('showScrollButtonId', false);
}

async function fetchPokemonData(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    return response.json();
}

function cardBigView(name, i) {
    return /* html */ `
    <!--mit limitter mittig ausrichten-->
    <div class="dark-background" onclick="closeBigView()" id="deleteBackgroundId">
    </div>
    <div class="cardOnBigViewLimitter" id="deletePokemonCardId">
    <img onclick="back(${i})" src="./img/arrowleft.png" id="arrowleftId">
    <img onclick="next(${i})" src="./img/arrowright.png" id="arrowrightId">
        <div class="card-on-big-view" id="pokemon-card-on-big-view-id${[i]}">
            <div class="pokemon-number-on-big-view delete">
                #${i + 1}
            </div>
            <div class="pokemon-name-image-type-on-big-view">
            <div class="closeBigView center" onclick="closeBigView()">
                <img src="./img/x-white.png">
            </div>
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
                        <h2 onclick="openAbilities(pokemonAPIglobal)">Abilities</h2>
                    </div>
                    <div class="cardInfoContentLimitter center-horicontal">
                    <div class="cardInfoContent">
                            <div id="aboutId">
                            </div>
                            <div id="openChartId">
                            </div>
                            <div id="abilityId">
                            </div>
                        <div>
                    </div>
            </div>
        </div>
    </div>`
}

function next(i) {
    i++;
    renderBigView(pokemonCardArray[i], i);
}

function back(i) {
    i--;
    renderBigView(pokemonCardArray[i], i);
}

function openChart() {
    toggleVisibility('openChartId', true);
    toggleVisibility('aboutId', false);
    toggleVisibility('abilityId', false);
    // underline area
    document.querySelector('h2[onclick="openAbout(pokemonAPIglobal)"]').classList.remove('underlined');
    document.querySelector('h2[onclick="openAbilities(pokemonAPIglobal)"]').classList.remove('underlined');
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
    let loadImage = pokemonAPIglobal['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokemon-image-on-big-view-id').src = loadImage;

    typeImageAndColorBigView(pokemonAPIglobal, i); // Typenbilder, Typenbeschreibung, Hintergrundfarbe
    chart(pokemonAPIglobal); // Balkendiagramm
    openAbilities(pokemonAPIglobal);
    openAbout(pokemonAPIglobal); // Infos über das Pokemon. Wichtig: Die unterste Funktion wird automatisch beim öffnen der Karte angezeigt.
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
    toggleVisibility('openChartId', false);
    toggleVisibility('aboutId', true);
    toggleVisibility('abilityId', false);
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

    // underline area
    document.querySelector('h2[onclick="openAbout(pokemonAPIglobal)"]').classList.add('underlined');
    document.querySelector('h2[onclick="openAbilities(pokemonAPIglobal)"]').classList.remove('underlined');
    document.querySelector('h2[onclick="openChart()"]').classList.remove('underlined');
}

function openAbilities(pokemonAPIglobal) {
    toggleVisibility('openChartId', false);
    toggleVisibility('aboutId', false);
    toggleVisibility('abilityId', true);
    const abilities = pokemonAPIglobal['abilities'];
    document.getElementById('abilityId').innerHTML = '';
    for (let i = 0; i < abilities.length; i++) {
        let ability = abilities[i]['ability']['name'];
        document.getElementById('abilityId').innerHTML += /* html */ `
        <div class="center">
            <h4>${ability.toUpperCase()}</h4>
        </div>
        `;
    }
    // underline area
    document.querySelector('h2[onclick="openAbout(pokemonAPIglobal)"]').classList.remove('underlined');
    document.querySelector('h2[onclick="openAbilities(pokemonAPIglobal)"]').classList.add('underlined');
    document.querySelector('h2[onclick="openChart()"]').classList.remove('underlined');
}

function closeBigView() {
    deletePokemonCardId.style.display = 'none';
    deleteBackgroundId.style.display = 'none';
    toggleVisibility('showScrollButtonId', true);
    document.body.classList.remove('disable-scroll');
    bigView = false;
}

function toggleVisibility(id, show) {
    const showHide = document.getElementById(id);
    showHide.classList.toggle('d-none', !show);
}
let searchTimeout;
function filterNames() {
    if (bigView === true) {
        closeBigView();
    }
    isFiltered = true;
    let searchInputValue = document.getElementById('searchId').value.toLowerCase();
    let displayedPokemonCount = 0;

    // Leeren Sie das Pokémon-Collection-Div, um es neu zu füllen
    document.getElementById('pokemonCollectionId').innerHTML = '';
    if (searchInputValue === '') {
        isFiltered = false;
    } else {
        isFiltered = true;
    }
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async function () {
        for (let i = 0; i < pokemonCardArray.length; i++) {
            let name = pokemonCardArray[i];
            if (name.includes(searchInputValue)) {
                renderImageTypeColor(i, name);
                document.getElementById('pokemonCollectionId').innerHTML += pokemonCollection(i, name);
                displayedPokemonCount++;
            }
            if (displayedPokemonCount >= 20) {
                break;
            }
        }
    }, 200);
}

function slide(frontId) {
    document.body.classList.add('disable-scroll');
    slideInAnimation = document.getElementById(frontId);
    toggleVisibility(frontId, true);
    slideInAnimation.classList.add('slide-in');
    setTimeout(function () {
        slideInAnimation.classList.remove('slide-in');
    }, 500);
}