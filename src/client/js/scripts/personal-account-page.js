import PersonalPageBackend from './PersonalPageBackend.js';
import RequestAuthorizer from '../requests/RequestAuthorizer.js';
import PostWorkbookRequest from '../requests/PostWorkbookRequest.js';
import PersonalPageResultHandler from './PersonalPageResultHandler.js';
import GetWorkbookRequest from '../requests/GetWorkbookRequest.js';

const baseURL = `${document.location.protocol}//${document.location.host}`;
const registerPageURL = `${baseURL}`;
const addForm = document.getElementById('book-form');
const workspacePageURL = `${baseURL}/workspace.html`;
const backend = new PersonalPageBackend(addForm);
const resultHandler = new PersonalPageResultHandler(workspacePageURL, registerPageURL);
let authorizer;
try {
  authorizer = new RequestAuthorizer(localStorage.getItem('token'));
} catch (e) {
  resultHandler.authErrorHandle(e);
}
const postWorkbookRequest = new PostWorkbookRequest(baseURL, authorizer);

document.getElementById('name-panel-span').textContent = PersonalPageBackend.getUsername();
document.getElementById('logout-button').addEventListener('click',
  () => PersonalPageBackend.logout(registerPageURL));
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  backend.addBook(postWorkbookRequest, resultHandler);
});

const getWorkbookRequest = new GetWorkbookRequest(baseURL, authorizer);

PersonalPageBackend.getBookList(getWorkbookRequest, resultHandler);
