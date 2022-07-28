const createElem = (elem, styles = '') => {
  const element = document.createElement(elem);
  if (styles !== '') element.classList.add(...styles);
  return element;
};

const firstCapital = (text) => {
  const newText = text.split('');
  newText[0] = newText[0].toUpperCase();
  return newText.join('');
};

const groupData = (data, nColumns) => {
  const grouped = [];
  for (let i = 0; i < nColumns; i++) {
    let temp = [];
    for (let pos = i; pos < data.length; pos += nColumns) {
      temp.push(data[pos]);
    }
    grouped.push(temp);
  }
  return grouped;
};

const removeChildren = (elem) => {
  while (elem.lastElementChild) {
    elem.removeChild(elem.lastElementChild);
  }
};

const showElement = (elem, nameClass) => {
  return elem.classList.remove(nameClass);
};
const hideElement = (elem, nameClass) => {
  return elem.classList.add(nameClass);
};

export {
  createElem,
  firstCapital,
  groupData,
  removeChildren,
  showElement,
  hideElement
};