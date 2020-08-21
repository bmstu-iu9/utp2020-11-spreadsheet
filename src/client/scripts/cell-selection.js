const cells = document.querySelectorAll('#table td:not(.column-header):not(.row-header)');
const cellsInputs = document.querySelectorAll('#table td:not(.column-header):not(.row-header) input');
const rowHeaders = document.querySelectorAll('td.row-header:not(#triangle-cell)');
const columnHeaders = document.querySelectorAll('td.column-header:not(#triangle-cell)');
const table = document.getElementById('table');
const tableHeight = table.children[0].children.length - 1;
const tableWidth = table.children[0].children[0].children.length - 1;

const fontBlock = document.getElementById('tool-font');
const fontUnbarBtn = fontBlock.children[0].children[1];
const fontList = fontBlock.children[1];
const fontNames = document.querySelectorAll('#tool-font li');
const fontDisplay = document.getElementById('input-font');
let fontIsDropped = false;

const fontsizeBlock = document.getElementById('tool-fontsize');
const fontsizeUnbarBtn = fontsizeBlock.children[0].children[1];
const fontsizeList = fontsizeBlock.children[1];
const fontsizeNames = document.querySelectorAll('#tool-fontsize li');
const fontsizeDisplay = document.getElementById('input-fontsize');
let fontsizeIsDropped = false;

const boldBtn = document.getElementById('button-bold');
const italicBtn = document.getElementById('button-italics');
const underlineBtn = document.getElementById('button-underlined');
const stretchBtn = document.getElementById('button-stretched');
const lowercaseBtn = document.getElementById('button-low-reg');
const uppercaseBtn = document.getElementById('button-high-reg');

let isOnMouseDown = false;
let selectionStart;
let selectionEnd;
let focusedXY;
const selectionEvent = new Event('selection');

let isBold;
let isItalic;
let isUnderline;
let isLineThrough;

table.addEventListener('mouseover', () => {
  if (fontIsDropped) {
    fontIsDropped = false;
    fontList.classList.add('invisible');
  }
  if (fontsizeIsDropped) {
    fontsizeIsDropped = false;
    fontsizeList.classList.add('invisible');
  }
});

function getCellXY(cell) {
  const cellID = Array.from(cells).indexOf(cell);
  const Y = Math.floor(cellID / tableWidth);
  const X = cellID % tableWidth;
  return [X, Y];
}

function checkStyles(cell) {
  if (cell.classList.contains('bold')) {
    isBold = true;
  }
  if (cell.classList.contains('italic')) {
    isItalic = true;
  }
  if (cell.classList.contains('underline') || cell.classList.contains('underline-line-through')) {
    isUnderline = true;
  }
  if (cell.classList.contains('line-through') || cell.classList.contains('underline-line-through')) {
    isLineThrough = true;
  }
}

function updateButtons() {
  boldBtn.dispatchEvent(selectionEvent);
  italicBtn.dispatchEvent(selectionEvent);
  underlineBtn.dispatchEvent(selectionEvent);
  stretchBtn.dispatchEvent(selectionEvent);
  fontDisplay.value = cellsInputs[selectionStart[1] * tableWidth + selectionStart[0]].style.fontFamily || 'Arial';
  fontsizeDisplay.value = cellsInputs[selectionStart[1] * tableWidth + selectionStart[0]].style.fontSize.slice(0, -2) || '13';
}

function changeSelection() {
  for (let i = Math.min(selectionStart[0], selectionEnd[0]);
    i <= Math.max(selectionStart[0], selectionEnd[0]); i += 1) {
    for (let j = Math.min(selectionStart[1], selectionEnd[1]);
      j <= Math.max(selectionStart[1], selectionEnd[1]); j += 1) {
      cells[j * tableWidth + i].classList.add('selection');
    }
  }
}

function applySelection() {
  for (let i = Math.min(selectionStart[0], selectionEnd[0]);
    i <= Math.max(selectionStart[0], selectionEnd[0]); i += 1) {
    columnHeaders[i].classList.add('header-selected');
  }
  for (let j = Math.min(selectionStart[1], selectionEnd[1]);
    j <= Math.max(selectionStart[1], selectionEnd[1]); j += 1) {
    rowHeaders[j].classList.add('header-selected');
  }
  for (let i = Math.min(selectionStart[0], selectionEnd[0]);
    i <= Math.max(selectionStart[0], selectionEnd[0]); i += 1) {
    for (let j = Math.min(selectionStart[1], selectionEnd[1]);
      j <= Math.max(selectionStart[1], selectionEnd[1]); j += 1) {
      cells[j * tableWidth + i].classList.remove('selection');
      cells[j * tableWidth + i].classList.add('selected');
      checkStyles(cellsInputs[j * tableWidth + i]);
    }
  }
}

function removeSelection(ctrl) {
  if (focusedXY !== undefined) {
    cellsInputs[focusedXY[1] * tableWidth + focusedXY[0]].blur();
    cellsInputs[focusedXY[1] * tableWidth + focusedXY[0]].classList.remove('cursor-text');
  }
  if (!ctrl) {
    for (let i = 0; i < tableHeight; i += 1) {
      rowHeaders[i].classList.remove('header-selected');
    }
    for (let i = 0; i < tableWidth; i += 1) {
      columnHeaders[i].classList.remove('header-selected');
    }
    isBold = false;
    isUnderline = false;
    isItalic = false;
    isLineThrough = false;
  }
  for (let i = 0; i < tableHeight; i += 1) {
    for (let j = 0; j < tableWidth; j += 1) {
      if (!ctrl) {
        cells[i * tableWidth + j].classList.remove('selected');
      }
      cells[i * tableWidth + j].classList.remove('selection');
    }
  }
}

cells.forEach((cell) => {
  cell.addEventListener('mousedown', (e) => {
    e.preventDefault();
    fontDisplay.blur();
    fontsizeDisplay.blur();
    isOnMouseDown = true;
    removeSelection(e.ctrlKey);
    selectionEnd = getCellXY(cell);
    if (!e.shiftKey) {
      selectionStart = selectionEnd;
    }
    changeSelection();
    updateButtons();
  });
  cell.addEventListener('mouseup', (e) => {
    e.preventDefault();
    applySelection();
    updateButtons();
    isOnMouseDown = false;
  });
  cell.addEventListener('mouseover', (e) => {
    if (isOnMouseDown) {
      removeSelection(e.ctrlKey);
      selectionEnd = getCellXY(cell);
      changeSelection();
    }
  });
  cell.addEventListener('dblclick', (e) => {
    e.preventDefault();
    cell.children[0].focus();
    cell.children[0].classList.add('cursor-text');
    focusedXY = getCellXY(cell);
  });
});

rowHeaders.forEach((rowHeader, id) => {
  rowHeader.addEventListener('dblclick', (e) => {
    e.preventDefault();
    removeSelection(e.ctrlKey);
    selectionStart = [0, id];
    if (!e.shiftKey) {
      selectionEnd = [tableWidth - 1, id];
    }
    applySelection();
    updateButtons();
  });
});

columnHeaders.forEach((columnHeader, id) => {
  columnHeader.addEventListener('dblclick', (e) => {
    e.preventDefault();
    removeSelection(e.ctrlKey);
    selectionStart = [id, 0];
    if (!e.shiftKey) {
      selectionEnd = [id, tableHeight - 1];
    }
    applySelection();
    updateButtons();
  });
});

function reduceCells(func, start = selectionStart, end = selectionEnd) {
  for (let i = Math.min(start[0], end[0]);
    i <= Math.max(start[0], end[0]); i += 1) {
    for (let j = Math.min(start[1], end[1]);
      j <= Math.max(start[1], end[1]); j += 1) {
      func(cellsInputs[j * tableWidth + i]);
    }
  }
}

boldBtn.addEventListener('click', () => {
  if (isBold) {
    reduceCells((cell) => (cell.classList.remove('bold')));
    isBold = false;
  } else {
    reduceCells((cell) => (cell.classList.add('bold')));
    isBold = true;
  }
  boldBtn.dispatchEvent(selectionEvent);
});

italicBtn.addEventListener('click', () => {
  if (isItalic) {
    reduceCells((cell) => (cell.classList.remove('italic')));
    isItalic = false;
  } else {
    reduceCells((cell) => (cell.classList.add('italic')));
    isItalic = true;
  }
  italicBtn.dispatchEvent(selectionEvent);
});

underlineBtn.addEventListener('click', () => {
  if (isUnderline) {
    if (isLineThrough) {
      reduceCells((cell) => (cell.classList.remove('underline-line-through')));
      reduceCells((cell) => (cell.classList.add('line-through')));
    } else {
      reduceCells((cell) => (cell.classList.remove('underline')));
    }
    isUnderline = false;
  } else if (isLineThrough) {
    reduceCells((cell) => (cell.classList.remove('line-through')));
    reduceCells((cell) => (cell.classList.add('underline-line-through')));
    isUnderline = true;
  } else {
    reduceCells((cell) => (cell.classList.add('underline')));
    isUnderline = true;
  }
  underlineBtn.dispatchEvent(selectionEvent);
});

stretchBtn.addEventListener('click', () => {
  if (isLineThrough) {
    if (isUnderline) {
      reduceCells((cell) => (cell.classList.remove('underline-line-through')));
      reduceCells((cell) => (cell.classList.add('underline')));
    } else {
      reduceCells((cell) => (cell.classList.remove('line-through')));
    }
    isLineThrough = false;
  } else if (isUnderline) {
    reduceCells((cell) => (cell.classList.remove('underline')));
    reduceCells((cell) => (cell.classList.add('underline-line-through')));
    isLineThrough = true;
  } else {
    reduceCells((cell) => (cell.classList.add('line-through')));
    isLineThrough = true;
  }
  stretchBtn.dispatchEvent(selectionEvent);
});

boldBtn.addEventListener('selection', () => {
  if (isBold) {
    boldBtn.classList.add('button-active');
  } else {
    boldBtn.classList.remove('button-active');
  }
});

italicBtn.addEventListener('selection', () => {
  if (isItalic) {
    italicBtn.classList.add('button-active');
  } else {
    italicBtn.classList.remove('button-active');
  }
});

underlineBtn.addEventListener('selection', () => {
  if (isUnderline) {
    underlineBtn.classList.add('button-active');
  } else {
    underlineBtn.classList.remove('button-active');
  }
});

stretchBtn.addEventListener('selection', () => {
  if (isLineThrough) {
    stretchBtn.classList.add('button-active');
  } else {
    stretchBtn.classList.remove('button-active');
  }
});

lowercaseBtn.addEventListener('click', () => {
  reduceCells((cell) => {
    // eslint-disable-next-line no-param-reassign
    cell.value = cell.value.toLowerCase();
  });
});

uppercaseBtn.addEventListener('click', () => {
  reduceCells((cell) => {
    // eslint-disable-next-line no-param-reassign
    cell.value = cell.value.toUpperCase();
  });
});

fontUnbarBtn.addEventListener('click', () => {
  if (fontIsDropped) {
    fontList.classList.add('invisible');
    fontIsDropped = false;
  } else {
    fontList.classList.remove('invisible');
    fontIsDropped = true;
  }
});

fontNames.forEach((font) => {
  font.addEventListener('click', () => {
    fontDisplay.value = font.innerHTML;
    fontList.classList.add('invisible');
    fontIsDropped = false;

    reduceCells((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.style.fontFamily = font.innerHTML;
    });
  });
});

fontDisplay.addEventListener(('keydown'), (e) => {
  if (e.key === 'Enter') {
    reduceCells((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.style.fontFamily = fontDisplay.value;
    });
  }
});

fontsizeUnbarBtn.addEventListener('click', () => {
  if (fontsizeIsDropped) {
    fontsizeList.classList.add('invisible');
    fontsizeIsDropped = false;
  } else {
    fontsizeList.classList.remove('invisible');
    fontsizeIsDropped = true;
  }
});

fontsizeNames.forEach((fontsize) => {
  fontsize.addEventListener('click', () => {
    fontsizeDisplay.value = fontsize.innerHTML;
    fontsizeList.classList.add('invisible');
    fontsizeIsDropped = false;

    reduceCells((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.style.fontSize = `${fontsize.innerHTML}px`;
    });
  });
});

fontsizeDisplay.addEventListener(('keydown'), (e) => {
  if (e.key === 'Enter') {
    reduceCells((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.style.fontSize = `${fontsizeDisplay.value}px`;
    });
  }
});
