let toolbarTabs = document.querySelectorAll('div.toolbar-tab');


for (let toolbarTab of toolbarTabs) {
  toolbarTab.addEventListener("click", e => {
    e.preventDefault();

    document.querySelector('div.toolbar-tab.toolbar-tab-active').classList.remove('toolbar-tab-active');
    document.getElementById('toolbar-wrapper').children[1].classList.add('hide');

  });
}
