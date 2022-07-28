import { createElem, showElement, hideElement } from "./helpers/utilities.js";

const buttonTop = () => {
  const btn = createElem('btn', ['button', 'is-large', 'is-info', 'is-hidden', 'is-back-top']);
  btn.setAttribute('aria-label', 'back to top');
  btn.setAttribute('id', 'btnBackTop');
  const icon = createElem('span', ['icon']);
  const i = createElem('i', ['mdi', 'mdi-arrow-up-bold', 'mdi-48px']);
  icon.appendChild(i);
  btn.appendChild(icon);
  return btn;
};

const scrollContainer = () => {
  return document.documentElement || document.body;
};

const handleScroll = () => {
  const elem = document.getElementById('btnBackTop');
  if (scrollContainer().scrollTop > 2200) return showElement(elem, 'is-hidden');
  return hideElement(elem, 'is-hidden');
};

const defaults = {
  hiddenClass: 'is-hidden',
};

class BackTop {
  constructor(settings) {
    this.settings = { ...defaults, ...settings };
    const btn = buttonTop();
    btn.addEventListener('click', this.toTop);
    document.body.appendChild(btn);
    document.addEventListener('scroll', () => handleScroll(btn));
  }
  toTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

export default BackTop;
//Mejorar Clase
//https://www.freecodecamp.org/news/back-to-top-button-and-page-progressbar-with-html-css-and-js/