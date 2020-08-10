const cells = document.querySelectorAll('#table td:not(.column-header):not(.row-header) input');
let selectedCellID;

cells.forEach((cell) => {
  cell.addEventListener('mousedown', (e) => {
    e.preventDefault();
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
});
