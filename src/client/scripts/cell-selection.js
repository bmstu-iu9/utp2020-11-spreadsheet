const cells = document.querySelectorAll('#table td:not(.column-header):not(.row-header) input');
const table = document.getElementById('table');
const tableHeight = table.children[0].children.length - 1;
const tableWidth = table.children[0].children[0].children.length - 1;
let selectedCellID;
let isOnMouseDown = false;
let isSelection = false;
let selectionStart;
let selectionEnd;

function getCellXY(cell) {
  const cellID = Array.from(cells).indexOf(cell);
  const Y = Math.floor(cellID / tableWidth);
  const X = cellID % tableWidth;
  return [X, Y];
}

cells.forEach((cell) => {
  cell.addEventListener('mousedown', (e) => {
    e.preventDefault();

    if (isSelection) {
      for (let i = selectionStart[0]; i <= selectionEnd[0]; i += 1) {
        for (let j = selectionStart[1]; j <= selectionEnd[1]; j += 1) {
          cells[j * tableWidth + i].classList.remove('selected');
        }
      }
    }
    cell.classList.add('selected');
    isOnMouseDown = true;
    // eslint-disable-next-line no-multi-assign
    selectionStart = selectionEnd = getCellXY(cell);
  });
  cell.addEventListener('mouseup', (e) => {
    e.preventDefault();

    if (isOnMouseDown) {
      isSelection = true;
    }
    isOnMouseDown = false;
  });
  cell.addEventListener('mouseover', (e) => {
    if (isOnMouseDown) {
      const newSelectionEnd = getCellXY(cell);
      if (newSelectionEnd[0] > selectionEnd[0]) {
        for (let i = selectionStart[1]; i <= newSelectionEnd[1]; i += 1) {
          for (let j = selectionEnd[0]; j <= newSelectionEnd[0]; j += 1) {
            cells[i * tableWidth + j].classList.add('selected');
          }
        }
      }
      if (newSelectionEnd[1] > selectionEnd[1]) {
        for (let i = selectionStart[0]; i <= newSelectionEnd[0]; i += 1) {
          for (let j = selectionEnd[1]; j <= newSelectionEnd[1]; j += 1) {
            cells[j * tableWidth + i].classList.add('selected');
          }
        }
      }
      if (newSelectionEnd[0] < selectionEnd[0]) {
        for (let i = selectionStart[1]; i <= selectionEnd[1]; i += 1) {
          for (let j = newSelectionEnd[0] + 1; j <= selectionEnd[0]; j += 1) {
            cells[i * tableWidth + j].classList.remove('selected');
          }
        }
      }
      if (newSelectionEnd[1] < selectionEnd[1]) {
        for (let i = selectionStart[0]; i <= selectionEnd[0]; i += 1) {
          for (let j = newSelectionEnd[1] + 1; j <= selectionEnd[1]; j += 1) {
            cells[j * tableWidth + i].classList.remove('selected');
          }
        }
      }
      selectionEnd = newSelectionEnd;
    }
  });

  cell.addEventListener('click', (e) => {
    e.preventDefault();

    const cellID = Array.from(cells).indexOf(cell);

    if (cellID !== selectedCellID) {
      if (selectedCellID !== undefined) {
        cells[selectedCellID].classList.remove('selected');
        cells[selectedCellID].classList.remove('cursor-text');
        cells[selectedCellID].blur();
      }
      cells[cellID].classList.add('selected');
      selectedCellID = cellID;
    }
  });
  cell.addEventListener('dblclick', (e) => {
    e.preventDefault();
    cell.focus();

    cell.classList.add('cursor-text');
  });
})
;
