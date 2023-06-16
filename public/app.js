(() => {
  const App = {
    htmlElements: {
      // General
      document: document,
      inputNamePokemon: document.querySelector("#name_pokemon"),
      loading: document.querySelector(".loading"),
      titlesSection: document.querySelector(".titles-section"),
      // HEAD-SEARCH
      headSearch: document.querySelector(".head-search"),
      searchCard: document.querySelector("#searchCard"),
      iconSpinner: document.querySelector(".simple-spinner"),
      iconSearch: document.querySelector(".search_icon"),
      simpleSpinner: document.querySelector(".simple-spinner"),
      // CONTENT-SEARCH
      bodySearch: document.querySelector(".body-search"),
      tabAllSection: document.querySelector("#tabAll"),
      typesPokemon: document.querySelector("#typesPokemon"),

      keySection: document.querySelector(".keyS-section"),
      filterBtn: document.querySelector(".filters-btn"),
      actionsSearch: document.querySelector(".actions-section"),
      selectFilters: document.querySelector(".select-filters"),
      optTypes: document.querySelector("#opt-types"),
      optAbility: document.querySelector("#opt-ability"),
      btnsOptions: document.querySelector(".btns-options"),
      btnCatch: document.querySelector(".btn-catch"),
      btnClear : document.querySelector(".clear-btn"),

      // SET DATA
      sectionInfoPokemon : document.querySelector(".section-information-pokemon"),
      namePokemon : document.querySelector(".info-name-pokemon"),
      idPokemon : document.querySelector(".info-id-pokemon"),
      infoTypesPokemon: document.querySelector(".info-types-pokemon"),
      weightNum : document.querySelector(".weight-num"),
      heightNum : document.querySelector(".height-num"),
      colorPokemon : document.querySelector(".info-color-pokemon"),
      listAbilities : document.querySelector("#list-abilities"),
      gallerySprites: document.querySelector(".gallery-sprites"),
      sectionEvolutionChain : document.querySelector("#list-evolution-chain")
    },

    data: {
      listPokemons: [],
      typesPokemon: [],
      abilitiesPokemon: [],

      search: {
        types: ["all"],
        abilities: [],
        listPokemons: [],
        activate: false,
        allData: true,
        filter: {
          name: "opt-types",
          id: "",
        },
      },
    },

    handlers: {
      searchPokemon: async () => {
        const searchTerm =
          App.htmlElements.inputNamePokemon.value.toLowerCase();
        let selectedType = "";
        let jsonData = "";
        let filter = App.data.search.filter;
        let filterId = App.data.search.filter.id;
        let listAllPokemons = await App.methodsAPI.getAllPokemons();
        let listTypes = await App.methodsAPI.getAllTypesPokemons();
        let listAbilities = await App.methodsAPI.getAllAbilities();

        if (App.data.search.allData === true) {
          jsonData = listAllPokemons;
          selectedType = ["all"];
        } else {
          if (filter.name === "opt-types") {
            selectedType = listTypes;
            if (filterId === "") {
              App.data.search.filter.id = selectedType[0].name;
              jsonData = await App.methodsAPI.getPokemonsTypes(
                selectedType[0].name
              );
            } else {
              App.data.search.filter.id = filterId;
              jsonData = await App.methodsAPI.getPokemonsTypes(filterId);
            }
          } else {
            selectedType = listAbilities;
            if (filterId === "") {
              App.data.search.filter.id = selectedType[0].name;
              jsonData = await App.methodsAPI.getPokemonsAbility(
                selectedType[0].name
              );
            } else {
              App.data.search.filter.id = filterId;
              jsonData = await App.methodsAPI.getPokemonsAbility(filterId);
            }
          }
        }

        App.data.search.types = selectedType;
        let results = "";

        if (App.data.search.allData === true) {
          results = jsonData.filter((pokemon) => {
            if (
              searchTerm !== "" &&
              !pokemon.name.toLowerCase().includes(searchTerm)
            ) {
              return false;
            }
            return true;
          });
        } else {
          results = jsonData.filter((pokemon) => {
            if (
              searchTerm !== "" &&
              !pokemon.pokemon.name.toLowerCase().includes(searchTerm)
            ) {
              return false;
            }
            return true;
          });
        }

        App.methodsFront.renderResults(results);
      },

      focusInputSection: async () => {
        if (App.data.search.activate === false) {
          App.handlers.actionsSearch();
        }
      },

      focusInputKey: async (e) => {
        if (e.key === "/") {
          setTimeout(() => {
            App.htmlElements.inputNamePokemon.value = "";
          }, 50);

          App.handlers.actionsSearch();
        }
      },

      actionsSearch: () => {
        App.data.search.activate = true;
        App.htmlElements.inputNamePokemon.focus();
        App.methodsFront.sliceUpInput();
        App.htmlElements.keySection.style.display = "none";
        App.htmlElements.actionsSearch.style.display = "flex";
        App.handlers.searchPokemon();
      },

      setDataPokemon: async (event) => {
        App.methodsFront.appearLoading();
        const selectPokemon = event.target.id;
        const dataPokemon = await App.methodsAPI.getInfoPokemon(selectPokemon);
        const speciePokemon = dataPokemon.species;
        const colorPokemon = await App.methodsAPI.getColorRepresent(speciePokemon.name);
        const evolutionChainUrl = await App.methodsAPI.getEvolutionChainUrl(speciePokemon.name);
        const dataEvolutionChain = await App.methodsAPI.getEvolutionChainData(evolutionChainUrl);
        const listEvolutionChain = App.methodsBack.evolutionChain(dataEvolutionChain);
  
        const types = dataPokemon.types;
        const abilities = dataPokemon.abilities;
        const sprites = dataPokemon.sprites;

        App.htmlElements.namePokemon.innerHTML=App.methodsBack.formatName(dataPokemon.name);
        App.htmlElements.idPokemon.innerHTML="#"+App.methodsBack.formatNumber(dataPokemon.id);
        App.htmlElements.weightNum.innerHTML= dataPokemon.weight;
        App.htmlElements.heightNum.innerHTML= dataPokemon.height;
        App.htmlElements.colorPokemon.style.background = colorPokemon;

        App.htmlElements.infoTypesPokemon.innerHTML="";
        App.htmlElements.listAbilities.innerHTML="";
        App.htmlElements.gallerySprites.innerHTML="";
        

        types.forEach((item) =>{
          App.htmlElements.infoTypesPokemon.innerHTML+=`<span class="types">${App.methodsBack.formatName(item.type.name)}</span>`
        });

        abilities.forEach((item) =>{
          App.htmlElements.listAbilities.innerHTML+=`<div class="ability">
          <div class="icon-circle"><img src= ${item.is_hidden ? "./assets/images/hide.png" : "" }></div>
          <div class="ability-name">${item.ability.name.toUpperCase()}</div></div>`
        });

        App.methodsFront.viewEvolutionChain(listEvolutionChain);
        App.methodsFront.viewSprites(sprites);
    
        App.methodsFront.hiddenLoading();

        App.htmlElements.sectionInfoPokemon.style.display="flex";
        App.methodsFront.scrollToSection();
      },
    },

    methodsFront: {
      hiddenLoading: () => {
        App.htmlElements.loading.classList.add("off");
      },
      appearLoading: () => {
        App.htmlElements.loading.classList.remove("off");
      },
      sliceUpInput: () => {
        const searchCard = App.htmlElements.searchCard;
        searchCard.classList.add("sliceUp");
        setTimeout(function () {
          searchCard.style.top = "100px";
        }, 10);
        App.htmlElements.titlesSection.classList.add("active");
        App.htmlElements.simpleSpinner.classList.add("active");
        App.htmlElements.bodySearch.classList.add("active");
      },

      createButtonType: (item) => {
        const nameType = App.methodsBack.formatName(item.name);

        const button = document.createElement("button");
        button.classList.add("tab-link");
        button.style.display = "flex";
        button.style.margin = "5px 0";
        button.style.justifyContent = "space-around";
        button.setAttribute("data-tab", `tab${nameType}`);
        button.setAttribute("data-nameType", `${nameType.toLowerCase()}`);

        if (App.methodsFront.selectedTypeActual(item.name)) {
          button.classList.add("active");
        }

        const buttonContent = document.createElement("div");
        buttonContent.classList.add("tab-content-link");

        if (App.data.search.filter.name === "opt-types") {
          const image = document.createElement("img");
          image.style.marginRight = "5px";
          image.src = `assets/icons/types_pokemon/${item.name}.png`;
          buttonContent.appendChild(image);
        }

        const typeName = document.createElement("span");
        typeName.classList.add("name_type");
        typeName.textContent = nameType;
        buttonContent.appendChild(typeName);

        button.appendChild(buttonContent);

        button.addEventListener("click", function () {
          const tabLinks = document.querySelectorAll(".tab-link");
          const tabId = this.getAttribute("data-nameType").toLowerCase();

          App.data.search.types = [tabId];
          App.data.search.filter.id = tabId;

          tabLinks.forEach(function (link) {
            link.classList.remove("active");
          });

          App.handlers.searchPokemon();
        });

        return button;
      },

      createPokemonCard: (pokemon) => {
        const idPokemon = App.methodsBack.setIdPokemon(pokemon.pokemon.url);
        const namePokemonTitle = App.methodsBack.formatName(
          pokemon.pokemon.name
        );
        const namePokemonId = pokemon.pokemon.name;

        const card = document.createElement("div");
        card.classList.add("card-search-pokemon");

        const description = document.createElement("div");
        description.classList.add("description-search-pokemon");

        const iconPokemon = document.createElement("div");
        iconPokemon.classList.add("icon-pokemon");

        const imgIconPokemon = document.createElement("div");
        imgIconPokemon.classList.add("img-icon-pokemon");

        const img = document.createElement("img");
        img.src = `assets/icons/pokeballs_colors/${
          pokemon.color == undefined ? "black" : pokemon.color
        }.png`;
        img.alt = "color";

        imgIconPokemon.appendChild(img);
        iconPokemon.appendChild(imgIconPokemon);
        description.appendChild(iconPokemon);

        const dataSearchPokemon = document.createElement("div");
        dataSearchPokemon.classList.add("data-search-pokemon");

        const namePokemon = document.createElement("div");
        namePokemon.classList.add("name-pokemon");
        namePokemon.textContent = namePokemonTitle;

        const numberPokemon = document.createElement("div");
        numberPokemon.classList.add("number-pokemon");
        numberPokemon.textContent = `#${App.methodsBack.formatNumber(
          idPokemon
        )}`;

        dataSearchPokemon.appendChild(namePokemon);
        dataSearchPokemon.appendChild(numberPokemon);
        description.appendChild(dataSearchPokemon);

        const btnCatch = document.createElement("div");
        btnCatch.classList.add("btn-catch");
        btnCatch.id = namePokemonId;

        const imgCatch = document.createElement("img");
        imgCatch.src = "assets/icons/pokeball_default.png";
        imgCatch.alt = "";

        const spanCatch = document.createElement("span");
        spanCatch.textContent = "Catch";

        btnCatch.appendChild(imgCatch);
        btnCatch.appendChild(spanCatch);

        card.appendChild(description);
        card.appendChild(btnCatch);

        btnCatch.addEventListener("click", App.handlers.setDataPokemon);

        return card;
      },

      createAllPokemonCard: (pokemon) => {
        const idPokemon = App.methodsBack.setIdPokemon(pokemon.url);
        const namePokemonTitle = App.methodsBack.formatName(pokemon.name);
        const namePokemonId = pokemon.name;

        const card = document.createElement("div");
        card.classList.add("card-search-pokemon");

        const description = document.createElement("div");
        description.classList.add("description-search-pokemon");

        const iconPokemon = document.createElement("div");
        iconPokemon.classList.add("icon-pokemon");

        const imgIconPokemon = document.createElement("div");
        imgIconPokemon.classList.add("img-icon-pokemon");

        const img = document.createElement("img");
        img.src = `assets/icons/pokeballs_colors/${
          pokemon.color == undefined ? "black" : pokemon.color
        }.png`;
        img.alt = "color";

        imgIconPokemon.appendChild(img);
        iconPokemon.appendChild(imgIconPokemon);
        description.appendChild(iconPokemon);

        const dataSearchPokemon = document.createElement("div");
        dataSearchPokemon.classList.add("data-search-pokemon");

        const namePokemon = document.createElement("div");
        namePokemon.classList.add("name-pokemon");
        namePokemon.textContent = namePokemonTitle;

        const numberPokemon = document.createElement("div");
        numberPokemon.classList.add("number-pokemon");
        numberPokemon.textContent = `#${App.methodsBack.formatNumber(
          idPokemon
        )}`;

        dataSearchPokemon.appendChild(namePokemon);
        dataSearchPokemon.appendChild(numberPokemon);
        description.appendChild(dataSearchPokemon);

        const btnCatch = document.createElement("div");
        btnCatch.classList.add("btn-catch");
        btnCatch.id = namePokemonId;

        const imgCatch = document.createElement("img");
        imgCatch.src = "assets/icons/pokeball_default.png";
        imgCatch.alt = "";

        const spanCatch = document.createElement("span");
        spanCatch.textContent = "Catch";

        btnCatch.appendChild(imgCatch);
        btnCatch.appendChild(spanCatch);

        card.appendChild(description);
        card.appendChild(btnCatch);

        btnCatch.addEventListener("click", App.handlers.setDataPokemon);

        return card;
      },

      simulateLoading: () => {
        App.htmlElements.iconSearch.style.opacity = "0";
        App.htmlElements.iconSpinner.style.opacity = "1";
        setTimeout(() => {
          App.htmlElements.iconSearch.style.opacity = "1";
          App.htmlElements.iconSpinner.style.opacity = "0";
        }, 1000);
      },

      selectedTypeActual: (tabSelect) => {
        const actualTypeSelect = App.data.search.filter.id;
        if (actualTypeSelect === tabSelect) {
          return true;
        } else {
          return false;
        }
      },

      renderResults: (results) => {
        const dataPokemons = results;
        let listType = App.data.search.types;
        App.htmlElements.tabAllSection.innerHTML = "";
        if (dataPokemons.length === 0) {
          App.htmlElements.tabAllSection.innerHTML =
            "<p>No se encontraron resultados.</p>";
        }

        if (App.data.search.types.length > 1) {
          App.htmlElements.tabAllSection.innerHTML = "";
          App.htmlElements.typesPokemon.innerHTML = "";

          listType.forEach((item) => {
            const button = App.methodsFront.createButtonType(item);
            App.htmlElements.typesPokemon.appendChild(button);
          });

          dataPokemons.forEach((pokemon) => {
            const card = App.methodsFront.createPokemonCard(pokemon);
            App.htmlElements.tabAllSection.appendChild(card);
          });
        } else {
          App.htmlElements.tabAllSection.innerHTML = "";
          App.htmlElements.typesPokemon.innerHTML = "";

          dataPokemons.forEach((pokemon) => {
            const card = App.methodsFront.createAllPokemonCard(pokemon);
            App.htmlElements.tabAllSection.appendChild(card);
          });
        }
      },

      appearFilters: () => {
        if (App.htmlElements.selectFilters.style.display === "none") {
          App.htmlElements.selectFilters.style.display = "block";
        } else {
          App.htmlElements.selectFilters.style.display = "none";
        }
      },

      scrollToSection() {
        const section = App.htmlElements.sectionInfoPokemon;
        section.scrollIntoView({ behavior: 'smooth' });
     },

      viewSprites : (sprites) => {
        
        for (const spriteCategory in sprites) {
          if (sprites[spriteCategory]) {
            
            if (spriteCategory === 'other') {
              for (const category in sprites[spriteCategory]) {
                if (sprites[spriteCategory][category].hasOwnProperty('front_default')) {
                  const img = document.createElement('img');
                  img.src = sprites[spriteCategory][category]['front_default'];
                  App.htmlElements.gallerySprites.appendChild(img);
                }
              }
            } else if (spriteCategory === 'versions') {
              for (const version in sprites[spriteCategory]) {
                if (sprites[spriteCategory][version].hasOwnProperty('front_default')) {
                  const img = document.createElement('img');
                  img.src = sprites[spriteCategory][version]['front_default'];
                  App.htmlElements.gallerySprites.appendChild(img);
                }
              }
        } else {
          const img = document.createElement('img');
          img.src = sprites[spriteCategory];
          App.htmlElements.gallerySprites.appendChild(img);
        }
      }
    }

      },

      viewEvolutionChain : (listEvolution) => { 
  
        App.htmlElements.sectionEvolutionChain.innerHTML="";
        listEvolution.forEach(async (evolution)=>{
          let pokemonActual = evolution.pokemonActual;
          let pokActualImg = await App.methodsAPI.getImagePokemon(pokemonActual);
          let levelEvolut = evolution.levelEvolut;
          let pokemonLast = evolution.pokemonLast;
          let pokLastImg = await App.methodsAPI.getImagePokemon(pokemonLast);

          App.htmlElements.sectionEvolutionChain.innerHTML+=`<div class="evolution">
          <div class="evolution-pokemon">
              <div class="icons-pokemon">
                  <div class="icon-circle"><img src="./assets/images/baby.png"></div>
                  <img src="${pokActualImg}">
               </div>
              <span class="evolution-name">${App.methodsBack.formatName(pokemonActual)}</span>
          </div>

          <div class="evolution-level">
              <span>Level ${levelEvolut}</span>
              <img src="./assets/images/flecha.png">
          </div>

          <div class="evolution-pokemon">
              <div class="icons-pokemon">
                  <img src="${pokLastImg}">
                  <div class="icon-circle"><img src="./assets/images/baby.png"></div>
              </div>
              <span class="evolution-name">${App.methodsBack.formatName(pokemonLast)}</span>
          </div>

      </div>`
        });
      }
    },

    methodsBack: {
      formatNumber: (num) => {
        return num.toString().padStart(3, "0");
      },
      formatName: (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
      },
      setIdPokemon: (dataUrl) => {
        const url = dataUrl;
        const parts = url.split("/");
        const number = parseInt(parts[parts.length - 2]);
        return number;
      },

      filterClick: () => {
        if (App.htmlElements.filterBtn.classList.contains("active")) {
          App.htmlElements.selectFilters.style.display = "none";
          App.htmlElements.selectFilters.classList.remove("active");
        } else {
          App.htmlElements.selectFilters.style.display = "block";
          App.htmlElements.selectFilters.classList.add("active");
        }

        App.data.search.filter.id = "";
        App.data.search.types = ["all"];
        App.data.search.allData = false;

        App.htmlElements.selectFilters.style.display = "block";
      },

      selectedFilter: (event) => {
        const optType = App.htmlElements.optTypes;
        const optAbility = App.htmlElements.optAbility;

        optType.classList.remove("active");
        optAbility.classList.remove("active");

        event.target.classList.add("active");
        App.data.search.filter.name = event.target.id;
        document.querySelector(".filters-btn > span").innerHTML = event.target.innerText;

        App.data.search.allData = false;

        App.handlers.searchPokemon();
        App.methodsFront.simulateLoading();

        setTimeout(() => {
          App.htmlElements.selectFilters.style.display = "none";
        }, 1000);
      },

      evolutionChain : (chain) =>{
    const dataEvolutionChain = [];

    while (chain) {
      const pokemonActual = chain.species.name;
      let levelEvolut = null;
      let pokemonLast = null;
      let isBabyAct = "";
      let isBabyLast = "";

      if (chain.evolves_to.length > 0) {
        pokemonLast = chain.evolves_to[0].species.name;
        levelEvolut = chain.evolves_to[0].evolution_details[0].min_level;
        is_babyPkActual = chain.evolves_to[0].is_baby;

        if (levelEvolut === null) {
          const nextEvolutionDetails = chain.evolves_to[0].evolution_details[0];
          if (nextEvolutionDetails) {
            levelEvolut = nextEvolutionDetails.min_level;
            isBabyLast = nextEvolutionDetails.is_baby;
          }
        }
      }

      if (pokemonLast !== null) {
        dataEvolutionChain.push({
          is_babyPkActual: isBabyAct,
          pokemonActual: pokemonActual,
          levelEvolut: levelEvolut,
          pokemonLast: pokemonLast,
          is_babyPkLast: isBabyLast
        });
      }

      chain = chain.evolves_to[0];
    }
    console.log(dataEvolutionChain);
    return dataEvolutionChain;
      },

      resetInput : () => {
        App.htmlElements.inputNamePokemon.value="";
        App.data.search.allData=true;
        document.querySelector(".filters-btn > span").innerHTML = "Filters";
        App.htmlElements.optTypes.classList.remove("active");
        App.htmlElements.optAbility.classList.remove("active");
        App.htmlElements.sectionInfoPokemon.style.display="none";
        App.handlers.searchPokemon();
      }
    },

    methodsAPI: {
      getAllPokemons: async () => {
        const url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
      },

      getAllAbilities: async () => {
        const url = "https://pokeapi.co/api/v2/ability?limit=100000&offset=0";
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
      },

      getAllTypesPokemons: async () => {
        const url = "https://pokeapi.co/api/v2/type/?limit=100000&offset=0";
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
      },

      getInfoType: async (nameType) => {
        const url = `https://pokeapi.co/api/v2/type/${nameType}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
      },

      getColorRepresent: async (nameSpecie) => {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${nameSpecie}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.color.name;
      },

      getInfoPokemon: async (namePokemon) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${namePokemon}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
      },

      getSpeciePokemon: async (namePokemon) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${namePokemon}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.species.name;
      },

      getTypesPokemon: async (namePokemon) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${namePokemon}`;
        const response = await fetch(url);
        const data = await response.json();
        const arraySpecies = data.types;

        const listSpecies = [];
        arraySpecies.forEach((item) => {
          listSpecies.push(item.type.name);
        });

        return listSpecies;
      },

      getPokemonsAbility: async (nameAbility) => {
        const url = `https://pokeapi.co/api/v2/ability/${nameAbility}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.pokemon;
      },

      getPokemonsTypes: async (nameType) => {
        const url = `https://pokeapi.co/api/v2/type/${nameType}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.pokemon;
      },

      getEvolutionChainUrl : async (nameSpecie) =>{
        const url = `https://pokeapi.co/api/v2/pokemon-species/${nameSpecie}`;
        const response = await fetch(url);
        const data = await response.json();
        const evolitionChainUrl = data.evolution_chain.url;
        return evolitionChainUrl;
      },

      getEvolutionChainData : async (url) =>{
        const response = await fetch(url);
        const data = await response.json();
        return data.chain
      },

      getImagePokemon : async(namePokemon) =>{
        const url = `https://pokeapi.co/api/v2/pokemon/${namePokemon}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.sprites.front_default;
      }
    },

    init: () => {
      App.htmlElements.inputNamePokemon.addEventListener(
        "input",
        App.handlers.searchPokemon
      );
      App.htmlElements.headSearch.addEventListener(
        "click",
        App.handlers.focusInputSection
      );
      App.htmlElements.document.addEventListener(
        "keydown",
        App.handlers.focusInputKey
      );
      App.htmlElements.filterBtn.addEventListener(
        "click",
        App.methodsBack.filterClick
      );
      App.htmlElements.optTypes.addEventListener(
        "click",
        App.methodsBack.selectedFilter
      );
      App.htmlElements.optAbility.addEventListener(
        "click",
        App.methodsBack.selectedFilter
      );
      App.htmlElements.btnClear.addEventListener("click", App.methodsBack.resetInput);
    },
  };

  App.init();
})();
