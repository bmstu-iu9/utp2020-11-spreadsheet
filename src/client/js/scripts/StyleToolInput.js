export default class StyleToolInput {
  constructor(selection, HTMLelement, style, type, isCell) {
    this.input = HTMLelement.querySelector('input');
    this.unbarButton = HTMLelement.querySelector('div.unbar-button');
    this.style = style;
    this.selection = selection;
    this.isCell = isCell;

    if (type === 'list') {
      this.list = HTMLelement.querySelector('div.drop-down-list');
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
    } else if (type === 'color') {
      this.button = HTMLelement.querySelector('.tool-button-standard, .tool-button-big, .tool-button-big');
      this.input.addEventListener('input', () => {
        this.button.style.color = this.input.value;
        this.apply();
      });
      this.button.addEventListener('click', () => {
        this.apply();
      });
    }

    if (this.isBorder) {
      this.sideButtons = HTMLelement.querySelector('.side-button');
      this.sideButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this.borderSide = button.index;
        });
      });
    }
  }

  apply() {
    if (this.style === 'borderColor') {
      this.selection.selectionSquares.forEach((selectionSquare) => {
        selectionSquare.erase('selected');
      });
    }

    this.selection.reduceAll((cell) => {
      if (this.isCell || this.style === 'backgroundColor') {
        // eslint-disable-next-line no-param-reassign
        cell.style[this.style] = this.input.value;
      }
      if (!this.isCell) {
        // eslint-disable-next-line no-param-reassign
        cell.children[0].style[this.style] = this.input.value;
      }
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
