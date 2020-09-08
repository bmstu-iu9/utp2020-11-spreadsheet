import WorkbookPageBackend from './WorkbookPageBackend.js';

const baseURL = `${document.location.protocol}//${document.location.host}`;
const registerPageURL = `${baseURL}`;
const workspacePageURL = `${baseURL}/workspace.html`;
const backend = new WorkbookPageBackend();

document.getElementById('name-panel-span').textContent = WorkbookPageBackend.getUsername();
document.getElementById('logout-button').addEventListener('click',
  () => WorkbookPageBackend.logout(registerPageURL));
