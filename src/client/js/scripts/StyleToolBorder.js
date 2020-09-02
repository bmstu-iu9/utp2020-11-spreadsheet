export default class StyleToolBorder {
  constructor(selection, HTMLelement) {
    this.selection = selection;
    this.HTMLelement = HTMLelement;
    this.button = HTMLelement.querySelector('.tool-button-standard');
    this.dropDown = HTMLelement.querySelector('.drop-down');
    this.unbarButton = HTMLelement.querySelector('.unbar-button');
    this.sideButtons = HTMLelement.querySelectorAll('.side-button');
    this.widthInput = HTMLelement.querySelector('input');
    this.side = [true, true, true, true];

    this.HTMLelement.addEventListener('mouseleave', () => {
      this.dropDown.classList.add('invisible');
    });

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
          cell.style.borderTopWidth = `${this.widthInput.value}px`;
        }
        if (this.side[1]) {
          cell.style.borderRightWidth = `${this.widthInput.value}px`;
        }
        if (this.side[2]) {
          cell.style.borderBottomWidth = `${this.widthInput.value}px`;
        }
        if (this.side[3]) {
          cell.style.borderLeftWidth = `${this.widthInput.value}px`;
        }
      });
    });

    ['solid', 'dotted', 'dashed', 'hidden'].forEach((style) => {
      document.getElementById(`tool-border-${style}`).addEventListener('click', () => {
        this.selection.selectionSquares.forEach((selectionSquare) => {
          selectionSquare.erase('selected');
        });
        selection.reduceAll((cell) => {
          if (this.side[0]) {
            cell.style.borderTopStyle = style;
          }
          if (this.side[1]) {
            cell.style.borderRightStyle = style;
          }
          if (this.side[2]) {
            cell.style.borderBottomStyle = style;
          }
          if (this.side[3]) {
            cell.style.borderLeftStyle = style;
          }
        });
      });
    });
  }
}
