import { firstCapital, createElem, groupData, removeChildren } from './helpers/utilities.js';

const createCardHeader = (num, name) => {
  const header = createElem('header', ['card-header']);
  const div = createElem('div', ['px-2', 'is-flex', 'is-align-items-center', 'is-justify-content-center']);
  const spanIcon = createElem('span', ['icon']);
  spanIcon.appendChild(createElem('i', ['mdi', 'mdi-pound']));
  const spanNum = createElem('span');
  spanNum.innerText = num;
  const p = createElem('p', ['card-header-title']);
  p.innerText = name;
  div.appendChild(spanIcon)
  div.appendChild(spanNum);
  div.appendChild(p);
  header.appendChild(div);
  return header;
};

const createCardImage = (url, altText) => {
  const div = createElem('div', ['card-image']);
  const figure = createElem('figure', ['image', 'is-1by1']);
  const img = createElem('img');
  img.src = url;
  img.alt = altText;
  figure.appendChild(img);
  div.appendChild(figure);
  return div;
};

const createCardContent = (types) => {
  const div = createElem('div', ['card-content']);
  const divContent = createElem('div', ['content', 'is-flex', 'is-justify-content-center', 'is-flex-wrap-wrap', 'is-gap-1']);
  types.forEach(type => {
    divContent.appendChild(type);
  });
  div.appendChild(divContent);
  return div;
};

const createTypeElem = (type) => {
  const span = createElem('span', ['type-icon', 'type-' + type]);
  span.innerText = firstCapital(type);
  return span;
};

class PokeElements {
  getPokeCard(number, name, type, url, altText) {
    const card = createElem('div', ['card', 'mb-5']);
    card.setAttribute('poke-id', number);
    const header = createCardHeader(number, name);
    const image = createCardImage(url, altText);
    const pokeTypes = this.getPokeTypes(type);
    const content = createCardContent(pokeTypes);
    card.appendChild(header);
    card.appendChild(image);
    card.appendChild(content);
    return card;
  }
  getPokeTypes(types) {
    return types.map(type => createTypeElem(type.toLowerCase()));
  }
  showPokeModal(modal, data) {
    const {
      number,
      name,
      type,
      weakness,
      height,
      weight,
      abilities,
      ThumbnailAltText: altText,
      ThumbnailImage: url } = data;
    const numberModal = modal.querySelector('[name=number]');
    const nameModal = modal.querySelector('[name=name]');
    const imageModal = modal.querySelector('[name=image]');
    const heightModal = modal.querySelector('[name=height]');
    const weightModal = modal.querySelector('[name=weight]');
    const abilitiesModal = modal.querySelector('[name=abilities]');
    const typeModal = modal.querySelector('[name=type]');
    const weaknessModal = modal.querySelector('[name=weakness]');
    numberModal.innerText = number;
    nameModal.value = name;
    imageModal.setAttribute('src', url);
    imageModal.setAttribute('alt', altText);
    heightModal.value = height + ' in';
    weightModal.value = weight + ' lbs';
    abilitiesModal.value = abilities.map(a => a);
    removeChildren(typeModal);
    removeChildren(weaknessModal);
    const pokeTypes = this.getPokeTypes(type);
    pokeTypes.forEach(t => typeModal.appendChild(t));
    const pokeWeakness = this.getPokeTypes(weakness);
    pokeWeakness.forEach(t => weaknessModal.appendChild(t));
    modal.classList.add('is-active');
  }
}

export default PokeElements;