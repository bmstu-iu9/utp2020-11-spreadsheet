export default class StyleToolBorder {
  constructor(selection, HTMLelement) {
    this.selection = selection;
    this.button = HTMLelement.querySelector('.tool-button-standard');
    this.dropDown = HTMLelement.querySelector('.drop-down');
    this.unbarButton = HTMLelement.querySelector('.unbar-button');
    this.sideButtons = HTMLelement.querySelectorAll('.side-button');
    this.widthInput = HTMLelement.querySelector('input');
    this.side = [true, true, true, true];

    this.unbarButton.addEventListener('click', () => {
      if (this.dropDown.classList.contains('invisible')) {
        this.dropDown.classList.remove('invisible');
      } else {
        this.dropDown.classList.add('invisible');
      }
    });

    this.sideButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.side[index] = !this.side[index];
        if (this.side[index]) {
          button.classList.add('button-active');
        } else {
          button.classList.remove('button-active');
        }
      });
    });

    this.widthInput.addEventListener('input', () => {
      this.selection.selectionSquares.forEach((selectionSquare) => {
        selectionSquare.erase('selected');
      });
      selection.reduceAll((cell) => {
        if (this.side[0]) {
          // eslint-disable-next-line no-param-reassign
          cell.style.borderTopWidth = `${this.widthInput.value}px`;
        }
        if (this.side[1]) {
          // eslint-disable-next-line no-param-reassign
          cell.style.borderRightWidth = `${this.widthInput.value}px`;
        }
        if (this.side[2]) {
          // eslint-disable-next-line no-param-reassign
          cell.style.borderBottomWidth = `${this.widthInput.value}px`;
        }
        if (this.side[3]) {
          // eslint-disable-next-line no-param-reassign
          cell.style.borderLeftWidth = `${this.widthInput.value}px`;
        }
      });
    });

    ['solid', 'dotted', 'dashed', 'invisible'].forEach((style) => {
      document.getElementById(`tool-border-${style}`).addEventListener('click', () => {
        selection.reduceAll((cell) => {
          if (this.side[0]) {
            if (style === 'invisible') {
              cell.style.borderTopColor = '#f3f3f3';
            } else {
              cell.style.borderTopStyle = style;
            }
          }
          if (this.side[1]) {
            if (style === 'invisible') {
              cell.style.borderRightCrolor = '#f3f3f3';
            } else {
              cell.style.borderRightStyle = style;
            }
          }
          if (this.side[2]) {
            if (style === 'invisible') {
              cell.style.borderBottomColor = '#f3f3f3';
            } else {
              cell.style.borderBottomStyle = style;
            }
          }
          if (this.side[3]) {
            if (style === 'invisible') {
              cell.style.borderLeftColor = '#f3f3f3';
            } else {
              cell.style.borderLeftStyle = style;
            }
          }
        });
      });
    });
  }
}
