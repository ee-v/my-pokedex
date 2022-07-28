import { createElem, removeChildren, showElement, hideElement } from './helpers/utilities.js';

const defaults = {
  limit: 50,
  hiddenClass: 'is-hidden'
};

const PgnElement = {
  element: null,
  btnPrevPage: null,
  btnNextPage: null,
  selectPages: null,
  display: null
};

const Book = {
  pages: null,
  actualPage: 0,
  totalPages: 0
};

const setSelectPages = (elem, numPages) => {
  removeChildren(elem);
  for (let i = 1; i <= numPages; i++) {
    let opt = createElem('option');
    opt.setAttribute('value', i);
    opt.innerText = i;
    elem.appendChild(opt);
  }
};

const totalPages = (bookLength, limit) => {
  if (bookLength == 0) return null;
  return bookLength < limit ? 1 : Math.round(bookLength / limit);
};

class Pagination {
  constructor(settings) {
    this.settings = { ...defaults, ...settings };
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  init(element, display) {
    PgnElement.element = element;
    PgnElement.btnPrevPage = element.querySelector('[pagination-func=prevPage]');
    PgnElement.btnNextPage = element.querySelector('[pagination-func=nextPage]');
    PgnElement.selectPages = element.querySelector('[pagination-func=selectPages]');
    PgnElement.display = display;
    PgnElement.btnPrevPage.addEventListener('click', this.prevPage);
    PgnElement.btnNextPage.addEventListener('click', this.nextPage);
    PgnElement.selectPages.addEventListener('change', (e) => {//Se podria mejorar?
      let page = e.currentTarget.value;
      PgnElement.display(this.getPage(page));
    });
  }
  setBook(data) {
    Book.pages = data;
    Book.actualPage = 1;
    Book.totalPages = totalPages(Book.pages.length, this.settings.limit);
    if (!Book.totalPages) {
      hideElement(PgnElement.element, this.settings.hiddenClass);
    } else {
      setSelectPages(PgnElement.selectPages, Book.totalPages);
      showElement(PgnElement.element, this.settings.hiddenClass);//Comprobar si ya esta visible?
    }
    PgnElement.display(this.getPage());
  }
  getNumActualPage() {
    return Book.actualPage;
  }
  getNumTotalPages() {
    return Book.totalPages;
  }
  getPage(page = 1) {
    page = parseInt(page);
    Book.actualPage = page;
    PgnElement.selectPages.value = page;

    if (page > 1 && page < Book.totalPages) { // Mejorar, cuando solo hay una pagina
      showElement(PgnElement.btnPrevPage, this.settings.hiddenClass);
      showElement(PgnElement.btnNextPage, this.settings.hiddenClass);
    } else if (Book.totalPages === 1) {
      hideElement(PgnElement.btnPrevPage, this.settings.hiddenClass);
      hideElement(PgnElement.btnNextPage, this.settings.hiddenClass);
    } else if (page === Book.totalPages) {
      showElement(PgnElement.btnPrevPage, this.settings.hiddenClass);
      hideElement(PgnElement.btnNextPage, this.settings.hiddenClass);
    } else {
      hideElement(PgnElement.btnPrevPage, this.settings.hiddenClass);
      showElement(PgnElement.btnNextPage, this.settings.hiddenClass);
    }

    const prevIndex = this.settings.limit * (page - 1);
    const nextIndex = this.settings.limit * page;
    return Book.pages.slice(prevIndex, nextIndex);
  }
  prevPage() {
    if (Book.actualPage === 1) return;
    PgnElement.display(this.getPage(Book.actualPage - 1));
  }
  nextPage() {
    if (Book.actualPage === Book.totalPages) return;
    PgnElement.display(this.getPage(Book.actualPage + 1));
  }
}

export default Pagination;