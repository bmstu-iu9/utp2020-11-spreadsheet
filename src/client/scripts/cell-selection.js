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

    const cellID = Array.from(cells).indexOf(cell);

    if (cellID !== selectedCellID) {
      if (selectedCellID !== undefined) {
        cells[selectedCellID].classList.remove('selected');
        cells[selectedCellID].classList.remove('cursor-text');
        cells[selectedCellID].blur();
      }
    }

    if (isSelection) {
      for (let i = Math.min(selectionStart[0], selectionEnd[0]);
        i <= Math.max(selectionStart[0], selectionEnd[0]); i += 1) {
        for (let j = Math.min(selectionStart[1], selectionEnd[1]);
          j <= Math.max(selectionStart[1], selectionEnd[1]); j += 1) {
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
  cell.addEventListener('mouseover', () => {
    if (isOnMouseDown) {
      selectionEnd = getCellXY(cell);
      for (let i = 0; i < tableHeight; i += 1) {
        for (let j = 0; j < tableWidth; j += 1) {
          if (j >= Math.min(selectionStart[0], selectionEnd[0])
              && j <= Math.max(selectionStart[0], selectionEnd[0])
              && i >= Math.min(selectionStart[1], selectionEnd[1])
              && i <= Math.max(selectionStart[1], selectionEnd[1])) {
            if (!cells[i * tableWidth + j].classList.contains('selected')) {
              cells[i * tableWidth + j].classList.add('selected');
            }
          } else if (cells[i * tableWidth + j].classList.contains('selected')) {
            cells[i * tableWidth + j].classList.remove('selected');
          }
        }
      }
    }
  });

  cell.addEventListener('click', (e) => {
    e.preventDefault();

    const cellID = Array.from(cells).indexOf(cell);

    cells[cellID].classList.add('selected');
    selectedCellID = cellID;
  });
  cell.addEventListener('dblclick', (e) => {
    e.preventDefault();
    cell.focus();

    cell.classList.add('cursor-text');
  });
});
