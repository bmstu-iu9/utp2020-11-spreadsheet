const toolbarTabs = document.querySelectorAll('div.toolbar-tab');
const toolbars = document.querySelectorAll('div.toolbar');

toolbarTabs.forEach((toolbarTab) => {
  toolbarTab.addEventListener('click', (e) => {
    e.preventDefault();

    const currTab = document.querySelector('div.toolbar-tab.toolbar-tab-active');
    const currToolbar = document.querySelector('div.toolbar.show-flex');
    const newTabNum = Array.from(toolbarTabs).indexOf(toolbarTab);
    const newToolbar = toolbars[newTabNum];
    currTab.classList.remove(`toolbar-tab-active`);
    currToolbar.classList.remove('show-flex');
    currToolbar.classList.add('hide');
    toolbarTab.classList.add('toolbar-tab-active');
    newToolbar.classList.remove('hide');
    newToolbar.classList.add('show-flex');
  });
});
