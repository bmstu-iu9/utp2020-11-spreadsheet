export default class StyleToolButton {
  constructor(selection, button, func, styleClass) {
    this.selection = selection;
    this.buttonHTML = button;
    this.style = styleClass;
    this.func = func;

    if (styleClass) {
      this.buttonHTML.addEventListener('click', () => {
        this.clickClass();
      });
    } else if (func) {
      this.buttonHTML.addEventListener('click', () => {
        this.clickFunc();
      });
    }
  }

  drawText() {
    this.selection.reduceAll((cell) => {
      if (cell.children[0].classList.contains(this.conflict)) {
        cell.children[0].classList.remove(this.conflict);
        cell.children[0].classList.add(this.compromiss);
      } else {
        cell.children[0].classList.add(this.style);
      }
    });
  }

  eraseText() {
    this.selection.reduceAll((cell) => {
      if (cell.children[0].classList.contains(this.compromiss)) {
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

  setConflict(conflictStyle, compromissStyle) {
    this.conflict = conflictStyle;
    this.compromiss = compromissStyle;
  }
}
