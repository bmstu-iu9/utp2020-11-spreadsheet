const cells = document.querySelectorAll('#table td:not(.column-header):not(.row-header)');
const cellsInputs = document.querySelectorAll('#table td:not(.column-header):not(.row-header) input');
const rowHeaders = document.querySelectorAll('td.row-header:not(#triangle-cell)');
const columnHeaders = document.querySelectorAll('td.column-header:not(#triangle-cell)');
const table = document.getElementById('table');
const tableWrapper = document.getElementById('table-wrapper');
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

function removeSelection(ctrl) {
  if (!ctrl) {
    for (let i = 0; i < tableHeight; i += 1) {
      rowHeaders[i].classList.remove('header-selected');
    }
    for (let i = 0; i < tableWidth; i += 1) {
      columnHeaders[i].classList.remove('header-selected');
    }
  }
  for (let i = 0; i < tableHeight; i += 1) {
    for (let j = 0; j < tableWidth; j += 1) {
      if (!ctrl) {
        cellsInputs[i * tableWidth + j].classList.remove('selected');
      }
      cellsInputs[i * tableWidth + j].classList.remove('selection');
    }
  }
}

cells.forEach((cell) => {
  cell.addEventListener('mousedown', (e) => {
    e.preventDefault();

    const cellID = Array.from(cells).indexOf(cell);

    if (cellID !== selectedCellID && selectedCellID !== undefined && !e.ctrlKey) {
      cellsInputs[selectedCellID].classList.remove('selected');
      cellsInputs[selectedCellID].classList.remove('cursor-text');
      cellsInputs[selectedCellID].blur();
    }

    if (isSelection) {
      removeSelection(e.ctrlKey);
    }
    cellsInputs[cellID].classList.add('selection');
    isOnMouseDown = true;
    selectedCellID = Array.from(cells).indexOf(cell);
    selectionEnd = getCellXY(cell);
    if (e.shiftKey) {
      for (let i = Math.min(selectionStart[0], selectionEnd[0]);
        i <= Math.max(selectionStart[0], selectionEnd[0]); i += 1) {
        for (let j = Math.min(selectionStart[1], selectionEnd[1]);
          j <= Math.max(selectionStart[1], selectionEnd[1]); j += 1) {
          cellsInputs[j * tableWidth + i].classList.remove('selection');
          cellsInputs[j * tableWidth + i].classList.add('selected');
          rowHeaders[j].classList.add('header-selected');
          columnHeaders[i].classList.add('header-selected');
        }
      }
    } else {
      selectionStart = selectionEnd;
    }
  });
  cell.addEventListener('mouseup', (e) => {
    e.preventDefault();

    for (let i = Math.min(selectionStart[0], selectionEnd[0]);
      i <= Math.max(selectionStart[0], selectionEnd[0]); i += 1) {
      for (let j = Math.min(selectionStart[1], selectionEnd[1]);
        j <= Math.max(selectionStart[1], selectionEnd[1]); j += 1) {
        cellsInputs[j * tableWidth + i].classList.remove('selection');
        cellsInputs[j * tableWidth + i].classList.add('selected');
        rowHeaders[j].classList.add('header-selected');
        columnHeaders[i].classList.add('header-selected');
      }
    }

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
            if (!cellsInputs[i * tableWidth + j].classList.contains('selection')) {
              cellsInputs[i * tableWidth + j].classList.add('selection');
            }
          } else if (cellsInputs[i * tableWidth + j].classList.contains('selection')) {
            cellsInputs[i * tableWidth + j].classList.remove('selection');
          }
        }
      }
    }
  });
  cell.addEventListener('dblclick', (e) => {
    e.preventDefault();
    cell.children[0].focus();

    cell.children[0].classList.add('cursor-text');
  });
});

rowHeaders.forEach((rowHeader, id) => {
  rowHeader.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (isSelection) {
      removeSelection(e.ctrlKey);
    }
    if (!e.shiftKey) {
      selectionStart = [0, id];
    }
    for (let i = Math.min(selectionStart[1], id);
      i <= Math.max(selectionStart[1], id); i += 1) {
      for (let j = 0; j < tableWidth; j += 1) {
        cellsInputs[i * tableWidth + j].classList.add('selected');
      }
    }
    rowHeader.classList.add('header-selected');
    isSelection = true;
  });
});

columnHeaders.forEach((columnHeader, id) => {
  columnHeader.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (isSelection) {
      removeSelection(e.ctrlKey);
    }
    if (!e.shiftKey) {
      selectionStart = [id, 0];
    }
    for (let i = Math.min(selectionStart[0], id);
      i <= Math.max(selectionStart[0], id); i += 1) {
      for (let j = 0; j < tableHeight; j += 1) {
        cellsInputs[j * tableWidth + i].classList.add('selected');
      }
    }
    columnHeader.classList.add('header-selected');
    isSelection = true;
  });
});
