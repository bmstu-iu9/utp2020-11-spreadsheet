function hideTabsContent(tabs, contents) {
  for (let i = 0; i < tabs.length; i += 1) {
    tabs[i].classList.remove('selected');
  }
  for (let i = 0; i < contents.length; i += 1) {
    contents[i].classList.remove('show');
    contents[i].classList.add('hide');
  }
}

function showTabContent(tabNumber, tabs, contents) {
  if (contents[tabNumber].classList.contains('hide') || !contents[tabNumber].classList.contains('show')) {
    hideTabsContent(tabs, contents);
    tabs[tabNumber].classList.add('selected');
    contents[tabNumber].classList.remove('hide');
    contents[tabNumber].classList.add('show');
  }
}
window.onload = () => {
  const signForms = document.getElementsByClassName('sign-form');
  const signTabs = document.getElementsByClassName('form-choice-button');
  showTabContent(0, signTabs, signForms);
};

document.getElementById('sign-choice').onclick = (event) => {
  const { target } = event;
  if (target.className === 'form-choice-button') {
    const signForms = document.getElementsByClassName('sign-form');
    const signTabs = document.getElementsByClassName('form-choice-button');
    for (let i = 0; i < signTabs.length; i += 1) {
      if (target === signTabs[i]) {
        showTabContent(i, signTabs, signForms);
      }
    }
  }
};
