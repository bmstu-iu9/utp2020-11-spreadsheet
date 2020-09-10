function hide(element) {
  element.classList.remove('show');
  element.classList.add('hide');
}
function show(element) {
  element.classList.add('show');
  element.classList.remove('hide');
}
window.onload = () => {
  show(document.getElementById('new-book-button'));
  hide(document.getElementById('book-form-wrapper'));
};

document.getElementById('new-book-button').onclick = () => {
  hide(document.getElementById('new-book-button'));
  show(document.getElementById('book-form-wrapper'));
};
