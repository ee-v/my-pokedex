import { removeChildren, hideElement, showElement, createElem, groupData } from './assets/js/helpers/utilities.js';
import PokeElements from './assets/js/PokeElements.js';
import Pagination from './assets/js/Pagination.js';
import BackTop from './assets/js/BackTop.js';

window.addEventListener('DOMContentLoaded', () => {
  //Others
  const noData = document.getElementById('noData');
  const loader = document.getElementById('loader');
  //PokeElements
  const myPokeElem = new PokeElements();
  const pokeSection = document.getElementById('pokeSection');
  const pokeModal = document.getElementById('pokeModal');
  //Pagination
  const pagination = new Pagination();
  //Search elements
  const btnSearch = document.getElementById('btnSearch');
  const btnClear = document.getElementById('btnClearSearch');
  const mySearch = document.getElementById('search');
  //Sort elements
  const btnSortAsc = document.getElementById('btnSortAsc');
  const btnSortDesc = document.getElementById('btnSortDesc');
  const btnSortAZ = document.getElementById('btnSortAZ');
  const btnSortZA = document.getElementById('btnSortZA');
  const btnClearFilter = document.getElementById('btnClearFilter');
  //Button back to top
  const backTop = new BackTop();

  //EL JSON esta mal
  const API = 'https://storage.googleapis.com/campus-cvs/00000000000-images-lectures/pokemons.json';
  const API_TEST = './pokemons.json';

  const getData = (url) => {
    return fetch(url, { mode: 'no-cors' })
      .then(response => response.json())
      .then(data => data);
  };

  const compareDataToLocal = (data) => {
    const local = localStorage.getItem('data');
    if (local !== null || data === local) return local;
    localStorage.setItem('data', data);
    return data;
  };

  const getPokemon = () => {
    const pokeData = localStorage.getItem('data');
    return JSON.parse(pokeData);
  };

  const getFilteredPokemon = () => {
    const pokeData = sessionStorage.getItem('search');
    return JSON.parse(pokeData);
  };

  const sortPokemonAsc = () => {
    const pokeData = getFilteredPokemon() || getPokemon();
    pokeData.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    pagination.setBook(pokeData);
    showElement(btnClearFilter, 'is-hidden');
  };

  const sortPokemonDesc = () => {
    const pokeData = getFilteredPokemon() || getPokemon();
    pokeData.sort((a, b) => parseInt(b.number) - parseInt(a.number));
    pagination.setBook(pokeData);
    showElement(btnClearFilter, 'is-hidden');
  };

  const sortPokemonAZ = () => {
    const pokeData = getFilteredPokemon() || getPokemon();
    pokeData.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (bName > aName) return -1;
      if (bName < aName) return 1;
      return 0;
    });
    pagination.setBook(pokeData);
    showElement(btnClearFilter, 'is-hidden');
  };

  const sortPokemonZA = () => {
    const pokeData = getFilteredPokemon() || getPokemon();
    pokeData.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName > bName) return -1;
      if (aName < bName) return 1;
      return 0;
    });
    pagination.setBook(pokeData);
    showElement(btnClearFilter, 'is-hidden');
  };

  const filterPokemon = () => {
    if (!search.value) return pagination.setBook(getPokemon());
    let searchBy = search.value;
    let filteredData = [];
    let pokeData = getPokemon();
    if (parseInt(searchBy)) {
      filteredData = pokeData.filter(pokemon => pokemon.number.includes(searchBy));
    } else {
      filteredData = pokeData.filter(pokemon => {
        let nameEqual = pokemon.name.toLowerCase().includes(searchBy.toLowerCase());
        let typeEqual = pokemon.type.some(t => t.toLowerCase().includes(searchBy.toLowerCase()));
        return nameEqual || typeEqual;
      });
    }
    sessionStorage.setItem('search', JSON.stringify(filteredData));
    pagination.setBook(filteredData);
  };

  const printPokeInfo = (pokeSection, pokeData) => {
    removeChildren(pokeSection);
    showElement(loader, 'is-hidden');
    if (pokeData.length == 0) {
      hideElement(pokeSection, 'is-hidden');
      hideElement(loader, 'is-hidden');
      showElement(noData, 'is-hidden');
      return;
    }
    hideElement(noData, 'is-hidden');
    const myPokeSection = createElem('div', ['columns']);
    const groupedData = groupData(pokeData, 4);
    groupedData.forEach(group => {
      let pokeColumn = createElem('div', ['column']);
      group.forEach(pokeInfo => {
        let { number, name, type, ThumbnailAltText: altText, ThumbnailImage: url } = pokeInfo;
        let pokeCard = myPokeElem.getPokeCard(number, name, type, url, altText);
        pokeCard.addEventListener('click', (e) => handleModal(e));
        pokeColumn.appendChild(pokeCard);
      });
      myPokeSection.appendChild(pokeColumn);
    });
    pokeSection.appendChild(myPokeSection);
    hideElement(loader, 'is-hidden');
    showElement(pokeSection, 'is-hidden');
    backTop.toTop();
  };

  const clearSearch = () => {
    mySearch.value = '';
    hideElement(btnClear, 'is-hidden');
    sessionStorage.removeItem('search');
    pagination.setBook(getPokemon());
  };

  const clearFilter = () => {
    mySearch.value = '';
    hideElement(btnClear, 'is-hidden');
    hideElement(btnClearFilter, 'is-hidden');
    sessionStorage.removeItem('search');
    pagination.setBook(getPokemon());

  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") return filterPokemon();
    return;
  };

  const handleInput = (e) => {
    let val = e.currentTarget.value;
    if (!!val) showElement(btnClear, 'is-hidden'); else hideElement(btnClear, 'is-hidden');
  };

  const handleModal = (e) => {
    let pokeId = e.currentTarget.getAttribute('poke-id');
    let pokeInfo = getPokemon().find(pokemon => pokemon.number === pokeId); //Checar de donde sacar/buscar el pokemon
    myPokeElem.showPokeModal(pokeModal, pokeInfo);
  };

  const init = async () => {
    const myPagination = document.getElementById('pagination');
    pagination.init(myPagination, (data) => printPokeInfo(pokeSection, data));

    const MyData = await getData(API_TEST);
    const pokeData = compareDataToLocal(JSON.stringify(MyData));
    pagination.setBook(JSON.parse(pokeData));

    mySearch.addEventListener('input', (e) => handleInput(e));
    mySearch.addEventListener('keypress', (e) => handleEnterPress(e));
    btnClear.addEventListener('click', clearSearch);
    btnSearch.addEventListener('click', filterPokemon);

    btnSortAsc.addEventListener('click', sortPokemonAsc);
    btnSortDesc.addEventListener('click', sortPokemonDesc);
    btnSortAZ.addEventListener('click', sortPokemonAZ);
    btnSortZA.addEventListener('click', sortPokemonZA);
    btnClearFilter.addEventListener('click', clearFilter);
  };

  init();
});