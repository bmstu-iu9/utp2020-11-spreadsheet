export default class StyleToolButton {
  constructor(selection, button, func, styleClass) {
    this.selection = selection;
    this.buttonHTML = button;
    this.func = func;
    this.styleClass = styleClass;

    this.buttonHTML.addEventListener('click', () => {
      this.click(styleClass);
    });
  }

  drawText(style) {
    this.selection.reduceAll((cell) => {
      cell.children[0].classList.add(style);
    });
  }

  eraseText(style) {
    this.selection.reduceAll((cell) => {
      cell.children[0].classList.remove(style);
    });
  }

  isStyledText(style) {
    return this.selection.getMainCellInput().classList.contains(style);
  }

  click(style) {
    // eslint-disable-next-line no-unused-expressions
    if (this.isStyledText(this.compromiss)) {
      this.eraseText(this.compromiss);
      this.drawText(this.conflict);
    } else if (this.isStyledText(style)) {
      this.eraseText(style);
    } else if (this.isStyledText(this.conflict)) {
      this.eraseText(this.conflict);
      this.drawText(this.compromiss);
    } else {
      this.drawText(style);
    }
  }

  setConflict(conflictStyle, compromissStyle) {
    this.conflict = conflictStyle;
    this.compromiss = compromissStyle;
  }
}
