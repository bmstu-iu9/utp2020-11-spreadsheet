export default class StyleToolList {
  constructor(selection, HTMLelement, style) {
    this.input = HTMLelement.querySelector('input');
    this.list = HTMLelement.querySelector('div.drop-down-list');
    this.unbarButton = HTMLelement.querySelector('div.unbar-button');
    this.style = style;
    this.selection = selection;

    this.unbarButton.addEventListener('click', () => {
      if (this.isShowed()) {
        this.hideList();
      } else {
        this.showList();
      }
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.apply();
      }
    });

    this.list.querySelectorAll('li').forEach((item) => {
      item.addEventListener('click', () => {
        this.hideList();
        this.input.value = item.innerHTML;
        this.apply();
      });
    });
  }

  apply() {
    this.selection.reduceAll((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.children[0].style[this.style] = this.input.value;
    });
  }

  showList() {
    this.list.classList.remove('invisible');
  }

  hideList() {
    this.list.classList.add('invisible');
  }

  isShowed() {
    return !this.list.classList.contains('invisible');
  }
}
