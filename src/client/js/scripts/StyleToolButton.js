export default class StyleToolButton {
  constructor(selection, button, func, styleClass) {
    this.selection = selection;
    this.buttonHTML = button;
    this.style = styleClass;
    this.func = func;

    if (styleClass) {
      this.buttonHTML.addEventListener('click', () => {
        this.clickClass();
        this.buttonHTML.dispatchEvent(new Event('change'));
      });
      this.buttonHTML.addEventListener('change', () => {
        if (selection.getMainCellInput().classList.contains(this.style)
            || selection.getMainCellInput().classList.contains(this.compromiss)) {
          this.buttonHTML.classList.add('button-active');
        } else {
          this.buttonHTML.classList.remove('button-active');
        }
      });
    } else if (func) {
      this.buttonHTML.addEventListener('click', () => {
        this.clickFunc();
      });
    }
  }

  drawText() {
    this.selection.reduceAll((cell) => {
      if (this.conflict) {
        let isConflict = false;
        this.conflict.forEach((conflictStyle) => {
          if (cell.children[0].classList.contains(conflictStyle)) {
            cell.children[0].classList.remove(conflictStyle);
            isConflict = true;
          }
        });
        // eslint-disable-next-line max-len
        cell.children[0].classList.add(isConflict && this.compromiss ? this.compromiss : this.style);
      } else {
        cell.children[0].classList.add(this.style);
      }
    });
  }

  eraseText() {
    this.selection.reduceAll((cell) => {
      if (this.compromiss && cell.children[0].classList.contains(this.compromiss)) {
        cell.children[0].classList.remove(this.compromiss);
        cell.children[0].classList.add(this.conflict);
      } else {
        cell.children[0].classList.remove(this.style);
      }
    });
  }

  isStyledText(styles) {
    let isStyled = false;
    styles.forEach((style) => {
      if (this.selection.getMainCellInput().classList.contains(style)) {
        isStyled = true;
      }
    });
    return isStyled;
  }

  clickClass() {
    if (this.isStyledText([this.style, this.compromiss])) {
      this.eraseText(this.style, this.conflict, this.compromiss);
    } else {
      this.drawText(this.style);
    }
  }

  clickFunc() {
    this.selection.reduceAll(this.func);
  }

  setConflict(conflictStyles, compromissStyle) {
    this.conflict = conflictStyles;
    this.compromiss = compromissStyle;
  }
}
