function hideTabsContent(tabs, contents) {
  tabs.forEach((tab) => {
    tab.classList.remove('selected');
  });
  contents.forEach((content) => {
    content.classList.remove('show');
    content.classList.add('hide');
  });
}

function showTabContent(tabNumber, tabs, contents) {
  if (contents[tabNumber].classList.contains('hide')) {
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
    signTabs.forEach((tab, i) => {
      if (target === tab) {
        showTabContent(i, signTabs, signForms);
      }
    });
  }
};
// eslint-disable-next-line no-alert
alert('jghjg');
